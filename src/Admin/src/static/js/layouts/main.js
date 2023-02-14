import { Component } from "../Soft.esm.js";
import "../components/nav.js";

export default Component("main-layout", {
  Render() {
    return /*html*/ `
          <div>
            <app-bar></app-bar>
            <slot></slot>
          </div>
        `;
  },
  shadowRoot: false,
});
