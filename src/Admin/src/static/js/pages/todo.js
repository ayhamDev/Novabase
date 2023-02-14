import { Component, useStore, navigate } from "../Soft.esm.js";

export default Component("todo-page", {
  Render() {
    const auth = useStore("auth");
    console.log(navigate);
    if (!auth.user) return navigate("/");
    const list = useStore("todolist");
    return /*html*/ `
            <div>
              <h1>This is Todo List</h1>
              <p>This Page is Protected With Auth.</p>
              <h2>${list.todos.length <= 0 ? `Loading...` : ``}</h2>

              <ol>
                  ${list.todos
                    .map(function (todo) {
                      return /*html*/ `
                          <li>${todo.title}</li>
                          <br>
                      `;
                    })
                    .join("")} 
              </ol>
            </div>

        `;
  },
  ShadowRoot: false,
  useOnce() {
    const list = useStore("todolist");
    const auth = useStore("auth");
    fetch("https://jsonplaceholder.typicode.com/todos")
      .then((response) => response.json())
      .then((data) => {
        list.todos = data;
      });
  },
  useStore: ["auth", "todolist"],
});
