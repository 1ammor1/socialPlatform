import express from "express";
import bootstrap from "./src/app.controller.js";
import chalk from "chalk";
import dotenv from "dotenv";
dotenv.config();

const app = express();
bootstrap(app,express);
app.listen(3000, () => {
    console.log(chalk.blue.bgRed("Server is running on port 3000"));
});