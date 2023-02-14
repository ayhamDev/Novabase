import { Component, useStore } from "../Soft.esm.js";

export default Component("home-page", {
  Render() {
    const auth = useStore("auth");
    return /*html*/ `
            <div>
              <h1>Home Page</h1>
              <h2>${
                auth.user
                  ? "Welcome Back"
                  : "Plase Login To access The todo List page."
              }</h2>
              <button>${auth.user ? `LogOut` : `Login`}</button>
            </div>
        `;
  },
  Script({ self }) {
    const auth = useStore("auth");
    self.querySelector("button").addEventListener("click", () => {
      auth.user = !auth.user;
    });
  },
  ShadowRoot: false,
  useStore: ["auth"],
});
