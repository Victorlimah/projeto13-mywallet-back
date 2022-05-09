import { MongoClient } from "mongodb";
import dotenv from "dotenv";

const url =
  "mongodb+srv://vic:123@mywallet.jq1jx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
dotenv.config();
let db = null;

console.log("vai conectar");
console.log(process.env.MONGO_URL);
console.log(process.env.DB_NAME);

try {
  //mudar para o url do mongodb depois
  const mongoClient = new MongoClient(url);
  await mongoClient.connect().then(() => console.log("Conectado ao MongoDB"));
  db = mongoClient.db("mywallet");
} catch (error) {
  console.log(error);
}

export default db;
