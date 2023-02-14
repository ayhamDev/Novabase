import { CreateBrowserRouter, CreateStore } from "./Soft.esm.js";
import MainLayout from "./layouts/main.js";
import Home from "./pages/Home.js";
import todo from "./pages/todo.js";

CreateStore("auth", {
  user: false,
});
CreateStore("todolist", {
  todos: [],
});

CreateBrowserRouter({
  exact: "/",
  _404: "/",
  layout: MainLayout(),
  Routes: [
    {
      path: "/",
      title: "Home Page",
      page: "home",
      render: Home(),
    },
    {
      path: "/todo",
      title: "todo Page",
      page: "todo",
      render: todo(),
    },
  ],
});
