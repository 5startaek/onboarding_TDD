import express from "express";

export const app = express();
export const server = app.listen(3000, () => {
  console.log("server opened! port: 3000");
});
app.get("/", (req, res) => {
  res.send("<div> !HELLO WORLD! </div>");
});
