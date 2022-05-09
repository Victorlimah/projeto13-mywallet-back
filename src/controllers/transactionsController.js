import db from "./../db/db.js";
import { ObjectId } from "mongodb";

export const readTransactions = async (req, res) => {
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

    let value = 0;
    let income = 0;
    let outcome = 0;

    transactions.forEach((transaction) => {
      let realValue = transaction.value
        .replace("R$", "")
        .replace(",", ".")
        .trim();

      if (realValue.includes("-")) {
        realValue = realValue.replace("-", "").trim();
        outcome += Number(realValue);
      } else income += Number(realValue);

      realValue = Number(realValue);
    });

    value = income - outcome;

    value = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    const balance = {
      inOut: income >= outcome ? "positive" : "negative",
      value,
    };

    return res.status(200).send({ transactions, balance, name: user.name });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

export const createTransaction = async (req, res) => {
  const { authorization } = req.headers;
  let { value, description, type } = req.body;

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

    //transformando o valor para moeda brl
    value = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    const transaction = {
      _id: new ObjectId(),
      user: user._id,
      value,
      description,
      date,
      type,
    };

    await db.collection("transactions").insertOne(transaction);
    return res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

export const deleteTransaction = async (req, res) => {
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

    const { id } = req.params;
    await db.collection("transactions").deleteOne({ _id: ObjectId(id) });
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};
