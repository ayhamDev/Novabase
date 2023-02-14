import { Component } from "../Soft.esm.js";

export default Component("app-bar", {
  Render() {
    return /*html*/ `
            <nav>
                <a href="/" link >home</a>
                <br>
                <a href="/todo" link >Todo List</a>
            </nav>
        `;
  },
  shadowRoot: false,
});
