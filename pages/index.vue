<script setup lang="ts">
const auth = authStore();

const todo = todoStore();
todo.dbListen(); // start listening to the database

const sortedTodos = ref(todo.getOrderedByStatusTodoList());

todo.$subscribe(() => {
  // update sorted list when todoStore state updates
  getSortedTodoList();
});

const newitem = ref("");

const sortBy = ref("date");

const markAsDoneOrUndone = (id: string) => {
  todo.changeTodoStatus(id);
};

const deleteItemFromList = (id: string) => {
  todo.deleteTodo(id);
};

const addNewTodo = () => {
  todo.addTodo(newitem.value);
};

const getSortedTodoList = async (by?: string) => {
  if (by) sortBy.value = by;
  if (sortBy.value === "status") sortedTodos.value = todo.getOrderedByStatusTodoList();
  else if (sortBy.value === "date") sortedTodos.value = todo.getOrderedByDateTodoList();
  else sortedTodos.value = todo.getOrderedByStatusTodoList();
};

const logout = async () => {
  await auth.logout();
  return navigateTo("/auth");
};
</script>

<template>
  <div id="todolist">
    <div class="header">
      <div class="flex justify-between">
        <h1>Todo List</h1>
        <button class="btn-picto" type="button" aria-label="Logout" title="Logout" @click="logout">
          <i aria-hidden="true" class="material-icons">logout</i>
        </button>
      </div>
      <span>Get things done, one item at a time.</span>
    </div>

    <div v-if="todo.todos.length !== 0">
      <transition-group name="todolist" tag="ul">
        <li v-for="item in sortedTodos" v-bind:class="item.done ? 'done' : ''" v-bind:key="item.id">
          <span class="label">{{ item.label }}</span>
          <div class="actions flex items-center">
            <button
              class="btn-picto flex items-center flex-center"
              type="button"
              v-on:click="markAsDoneOrUndone(item.id)"
              v-bind:aria-label="item.done ? 'Undone' : 'Done'"
              v-bind:title="item.done ? 'Undone' : 'Done'"
            >
              <i aria-hidden="true" class="material-icons">{{ item.done ? "check_box" : "check_box_outline_blank" }}</i>
            </button>
            <button
              class="btn-picto flex items-center flex-center"
              type="button"
              v-on:click="deleteItemFromList(item.id)"
              aria-label="Delete"
              title="Delete"
            >
              <i aria-hidden="true" class="material-icons">delete</i>
            </button>
          </div>
        </li>
      </transition-group>
      <div class="flex items-center justify-end gap-3 mt-4">
        <p>Move done items at the end?</p>
        <ToggleButton
          class="ml-0"
          :checked="sortBy === 'status'"
          @click="getSortedTodoList(sortBy === 'status' ? 'date' : 'status')"
        />
      </div>
    </div>
    <p v-else class="emptylist">Your todo list is empty.</p>

    <form name="newform" @submit.prevent>
      <label for="newitem">Add to the todo list</label>
      <div class="flex w-full">
        <input type="text" name="newitem" id="newitem" v-model="newitem" />
        <button type="submit" @click="addNewTodo">Add item</button>
      </div>
    </form>
  </div>
</template>
<style scoped>
/** {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
html,
body {
  background: #f7f1f1;
  font-size: 1.1rem;
  font-family: "Quicksand", sans-serif;
  height: 100%;
}*/
@keyframes strikeitem {
  to {
    width: calc(100% + 1rem);
  }
}

#todolist {
  margin: 4rem auto;
  padding: 2rem 3rem 3rem;
  max-width: 500px;
  background: #ff6666;
  color: #fff;
  box-shadow: -20px -20px 0px 0px rgba(100, 100, 100, 0.1);
}
#todolist .header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}
#todolist h1 {
  /*text-align:center;*/
  font-weight: normal;
  font-size: 2.6rem;
  letter-spacing: 0.05em;
  /*border-bottom: 1px solid rgba(255, 255, 255, 0.3);*/
}
#todolist h1 span {
  display: block;
  font-size: 0.8rem;
  margin-bottom: 0.7rem;
  margin-left: 3px;
  margin-top: 0.2rem;
}

#todolist .emptylist {
  margin-top: 2.6rem;
  text-align: center;
  letter-spacing: 0.05em;
  font-style: italic;
  opacity: 0.8;
}
#todolist ul {
  margin-top: 2.6rem;
  list-style: none;
}
#todolist .todolist-move {
  transition: transform 1s;
}
#todolist li {
  display: flex;
  margin: 0 -3rem 4px;
  padding: 1.1rem 3rem;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
}

#todolist .actions {
  flex-shrink: 0;
  padding-left: 0.7em;
}
#todolist .label {
  position: relative;
  transition: opacity 0.2s linear;
}
#todolist .done .label {
  opacity: 0.6;
}
#todolist .done .label:before {
  content: "";
  position: absolute;
  top: 50%;
  left: -0.5rem;
  display: block;
  width: 0%;
  height: 1px;
  background: #fff;
  animation: strikeitem 0.3s ease-out 0s forwards;
}
#todolist .btn-picto {
  border: none;
  background: none;
  -webkit-appearance: none;
  cursor: pointer;
  color: #fff;
}

/* FORM */
form {
  margin-top: 3rem;
  display: flex;
  flex-wrap: wrap;
}
form label {
  min-width: 100%;
  margin-bottom: 0.5rem;
  font-size: 1.3rem;
}
form input {
  flex-grow: 1;
  border: none;
  background: #f7f1f1;
  color: #000;
  padding: 0 1.5em;
  font-size: initial;
}
form button {
  padding: 0 1.3rem;
  border: none;
  background: #ff6666;
  color: white;
  text-transform: uppercase;
  font-weight: bold;
  border: 1px solid rgba(255, 255, 255, 0.3);
  margin-left: 5px;
  cursor: pointer;
  transition: background 0.2s ease-out;
}
form button:hover {
  background: #ff5e5e;
}
form input,
form button {
  font-family: "Quicksand", sans-serif;
  height: 3rem;
}

/* fallback */
@font-face {
  font-family: "Material Icons";
  font-style: normal;
  font-weight: 400;
  src: url(https://fonts.gstatic.com/s/materialicons/v128/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2) format("woff2");
}

.material-icons {
  font-family: "Material Icons";
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-feature-settings: "liga";
  -webkit-font-smoothing: antialiased;
}
</style>
