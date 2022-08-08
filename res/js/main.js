import { applyMarginTop } from "./utils.js";
import { App } from "./app.js";

const main = document.getElementById("main");

const app = App();
app.render(main);

applyMarginTop(main, "10%");