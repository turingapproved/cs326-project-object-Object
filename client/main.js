import { applyMarginTop } from "./utils.js";
import { App } from "./app.js";

const main = document.getElementById("main");
const home = document.getElementById("home");
const logout = document.getElementById("logout");

const app = App();
app.render(main);

applyMarginTop(main, "10%");

home.addEventListener('click', e => {
    e.preventDefault();
    app.home(main);
});

logout.addEventListener('click', e => {
    e.preventDefault();
    app.logout(main);
});