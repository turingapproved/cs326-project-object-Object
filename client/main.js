import { applyMarginTop } from "../server/utils.js";
import { App } from "../server/app.js";

const main = document.getElementById("main");

const app = App();
app.render(main);

applyMarginTop(main, "10%");