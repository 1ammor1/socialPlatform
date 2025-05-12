import express from "express";
import bootstrap from "./src/app.controller.js";
import chalk from "chalk";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const start = async () => {
  await bootstrap(app, express);
};

start();

export default app;
