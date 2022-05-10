import express from "express";
import { createOrder } from "./classes/Order.js";

export const app = express();
export const server = app.listen(3000, () => {
  console.log("server opened! port: 3000");
});
app.get("/", (req, res) => {
  res.send("<div> !HELLO WORLD! </div>");
});

app.get("/order", (req, res) => {
  res.send(createOrder("Aron", "010-1234-5678", "mouse", 1));
  // res.send("<div> dd </div>");
});
