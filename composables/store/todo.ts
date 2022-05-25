import { getFirestore, collection, onSnapshot, doc, updateDoc, deleteDoc, setDoc } from "firebase/firestore";
import { defineStore } from "pinia";
import { v4 as uuidV4 } from "uuid";

const db = getFirestore(firebaseApp);

export interface Todo {
  id: string;
  label: string;
  done: boolean;
  dateCreated: string;
  dateUpdated: string;
}

export interface todoState {
  todos: Todo[] | undefined[];
}

const state = (): todoState => ({
  todos: [], //[{ id: 2, label: "fds", done: false, dateCreated: new Date(), dateUpdated: new Date() }]
});

const getters = {
  getTodoList: (state: todoState) => () => {
    return state.todos;
  },
  getTodoById: (state: todoState) => (id: string) => {
    return state.todos.find((todo) => todo.id === id);
  },
  getOrderedByDateTodoList: (state: todoState) => () => {
    const todoListCopy = [...state.todos];
    return todoListCopy.sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime());
  },
  getOrderedByStatusTodoList: (state: todoState) => () => {
    const todoListCopy = [...state.todos];
    return todoListCopy.sort(
      (a, b) =>
        (a.done ? 1 : 0) - (b.done ? 1 : 0) || new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
    );
  },
  getActiveTodoList: (state: todoState) => () => {
    return state.todos.filter((todo) => !todo.done);
  },
  getDoneTodoList: (state: todoState) => () => {
    return state.todos.filter((todo) => todo.done);
  },
};

const actions = {
  async addTodo(label: string) {
    const id = uuidV4();
    await setDoc(doc(db, "users", authStore().auth.currentUser.uid, "todoList", id), {
      id: id,
      label: label,
      done: false,
      dateCreated: new Date().toUTCString(),
      dateUpdated: new Date().toUTCString(),
    });
  },
  async updateTodo(id: string, label: string) {
    await updateDoc(doc(db, "users", authStore().auth.currentUser.uid, "todoList", id), {
      label: label,
      dateUpdated: new Date().toUTCString(),
    });
  },
  async deleteTodo(id: string) {
    await deleteDoc(doc(db, "users", authStore().auth.currentUser.uid, "todoList", id));
  },
  async changeTodoStatus(id: string) {
    await updateDoc(doc(db, "users", authStore().auth.currentUser.uid, "todoList", id), {
      done: !this.getTodoById(id).done,
    });
  },
  dbListen() {
    onSnapshot(collection(db, "users", authStore().auth.currentUser.uid, "todoList"), (doc) => {
      this.todos = doc.docs.map((d) => d.data()) as Todo[];
    });
  },
};

export const todoStore = defineStore("todoStore", {
  state,
  getters,
  actions,
});

//const auth = authStore();
/*const todoListPath = ["users", authStore().auth.currentUser.uid, "todoList"] as const;
actions.dbListen();*/
