// import { MongoClient } from "mongodb";
// const dbUrl = "mongodb://localhost:27017";
// const orderCollection = "order";
//
// const client = new MongoClient(dbUrl, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
//
// export let db;
//
// export const connect = async (dbName) => {
//   const conn = await client.connect();
//   db = conn.db(dbName);
//   return client;
// };
// export const insertOrder = async (order) => {
//   const doc = {
//     userName: order.userName,
//     userPhone: order.userPhone,
//     productName: order.productName,
//     orderNum: order.orderNum,
//     purchasedDate: order.purchasedDate,
//     state: order.state,
//   };
//   return await db.collection(orderCollection).insertOne(doc);
// };
