import { getFirestore, getDocs, collection } from "firebase/firestore";
import { defineStore } from "pinia";

const db = getFirestore(firebaseApp);
//const todoSnapshot = await getDocs(collection(db, "todo"));
let todos = [];
(await getDocs(collection(db, "todo"))).forEach((todo) => {
  todos.push(todo.data() as Todo);
});

export interface Todo {
  id: number;
  label: string;
  done: boolean;
  dateCreated: Date;
  dateUpdated: Date;
}

export interface todoState {
  todo: Todo[] | undefined[];
}

const state = (): todoState => ({
  todo: todos,
});

/*const getTodos = async (): Promise<todoState> => {
  const todos = await getDocs(collection(db, "todo"))
  return todos.map((todo) => todo as Todo)
}*/

/*(
  async () => {
    const todo = await fetch("https://jsonplaceholder.typicode.com/todos");
    const todoJson = await todo.json();
    console.log(todoJson);
  }
)*/

const getters = {
  getTodoList: (state: todoState) => () => {
    return state.todo;
  },
  getTodoById: (state: todoState) => (id: number) => {
    return state.todo.find((todo) => todo.id === id);
  },
  getOrderedByDateTodoList: (state: todoState) => () => {
    return state.todo.sort((a, b) => a.dateCreated.getTime() - b.dateCreated.getTime());
  },
  getOrderedByStatusTodoList: (state: todoState) => () => {
    return state.todo.sort((a, b) => (a.done ? 1 : 0) - (b.done ? 1 : 0));
  },
  getActiveTodoList: (state: todoState) => () => {
    return state.todo.filter((todo) => !todo.done);
  },
  getDoneTodoList: (state: todoState) => () => {
    return state.todo.filter((todo) => todo.done);
  },
};

const actions = {
  addTodo(label: string) {
    const todo = {
      id: this.todo.length + 1,
      lable: label,
      done: false,
      dateCreated: new Date(),
      dateUpdated: new Date(),
    };
    this.todo.push(todo);
  },
  updateTodo(id: number, label: string) {
    const todo = this.getTodoById(id);
    todo.lable = label;
    todo.dateUpdated = new Date();
  },
  deleteTodo(id: number) {
    const todo = this.getTodoById(id);
    this.todo.splice(this.todo.indexOf(todo), 1);
  },
  changeTodoStatus(id: number) {
    const todo = this.getTodoById(id);
    todo.done = !todo.done;
    //todo.dateUpdated = new Date();
  },
};

export const todoStore = defineStore("authStore", {
  state,
  getters,
  actions,
});
