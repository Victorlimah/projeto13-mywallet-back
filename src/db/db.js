import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();
let db = null;

try {
  //mudar para o url do mongodb depois
  const mongoClient = new MongoClient(process.env.MONGO_URI);
  await mongoClient.connect().then(() => console.log("Conectado ao MongoDB"));
  db = mongoClient.db(process.env.DB_NAME);
} catch (error) {
  console.log(error);
}

export default db;
