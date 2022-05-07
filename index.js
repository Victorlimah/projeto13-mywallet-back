import cors from "cors";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import express, { json } from "express";
import { MongoClient, ObjectId } from "mongodb";
import { v4 as uuid } from "uuid";

const app = express();
dotenv.config();
app.use(json());
app.use(cors());

const mongoClient = new MongoClient(process.env.MONGO_URL);
mongoClient.connect().then((client) => {
  console.log("Connected successfully to MongoDB server");
});
let db = mongoClient.db("mywallet");

app.post("/sing-in", async (req, res) => {
  const { email, password } = req.body;

  const user = await db.collection("users").findOne({ email });

  if (!user) return res.sendStatus(404);

  if (user && bcrypt.compareSync(password, user.password)) {
    // o usuario existe e a senha esta correta
    const token = uuid();
    await db.collection("sessions").insertOne({
      token,
      user: user._id,
    });

    return res.status(200).send(token);
  } else {
    // o usuario nao existe ou a senha esta incorreta
    return res.sendStatus(401);
  }
});

app.post("/sing-up", async (req, res) => {
  const { name, email, password, confirmPassword } = req.body.user;

  if (password !== confirmPassword) return res.sendStatus(401);

  try {
    const user = await db.collection("users").findOne({ email });
    if (user) return res.sendStatus(401);

    const hash = bcrypt.hashSync(password, 10);
    const userData = {
      name,
      email,
      password: hash,
    };

    await db.collection("users").insertOne(userData);
    return res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

app.get("/transactions", async (req, res) => {
  const { authorization } = req.headers;
  let token = authorization?.replace("Bearer ", "");

  if (!token) return res.sendStatus(401);

  const session = await db.collection("sessions").findOne({ token });
  if (!session) return res.sendStatus(401);

  try {
    const user = await db
      .collection("users")
      .findOne({ _id: ObjectId(session.user) });
    if (!user) return res.sendStatus(401);

    const transactions = await db
      .collection("transactions")
      .find({ user: user._id })
      .toArray();

    const value = transactions.reduce((acc, curr) => acc + curr.value, 0);

    const balance = { inOut: value >= 0 ? "positive" : "negative", value };

    return res.status(200).send({ transactions, balance, name: user.name });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

app.post("/transactions", async (req, res) => {
  const { authorization } = req.headers;
  const { value, description } = req.body;

  let token = authorization?.replace("Bearer ", "");

  if (!token) return res.sendStatus(401);

  const session = await db.collection("sessions").findOne({ token });
  if (!session) return res.sendStatus(401);

  try {
    const user = await db
      .collection("users")
      .findOne({ _id: ObjectId(session.user) });
    if (!user) return res.sendStatus(401);

    const date = new Date().toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    });

    const transaction = {
      _id: new ObjectId(),
      user: user._id,
      value,
      description,
      date,
    };

    await db.collection("transactions").insertOne(transaction);
    return res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

app.listen(5000, () => console.log("Servidor rodando na porta 5000"));
