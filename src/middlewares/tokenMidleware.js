import db from "../db/db.js";
import joi from "joi";

export const tokenValidator = async (req, res, next) => {
  const schema = joi.object({
    authorization: joi
      .string()
      .pattern(/^Bearer\s[a-f0-9-]{36}$/)
      .required(),
  });

  const { error } = schema.validate(req.headers, { abortEarly: false });
  if (error) return res.sendStatus(401);

  const token = req.headers.authorization.split(" ")[1];
  try {
    const session = await db
      .collection("sessions")
      .findOne({ token, loggedIn: true });

    if (!session) return res.status(498).send("Token inválido ou expirado");
    res.locals.userId = session.userId;
    next();
  } catch (err) {
    res.sendStatus(500);
  }
};
