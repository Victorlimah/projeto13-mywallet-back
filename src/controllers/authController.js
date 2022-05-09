import db from "./../db/db.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

export const singIn = async (req, res) => {
  const { email, password } = req.body;

  const user = await db.collection("users").findOne({ email });

  if (!user) return res.sendStatus(404);

  if (user && bcrypt.compareSync(password, user.password)) {
    const token = uuid();
    await db.collection("sessions").insertOne({
      token,
      user: user._id,
    });

    return res.status(200).send({ token });
  } else {
    return res.sendStatus(401);
  }
};

export const singUp = async (req, res) => {
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
};
