import joi from "joi";

export const validateLogin = async (req, res, next) => {
  const schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) return res.status(422).send(error.details.map((e) => e.message));
  next();
};

export const validateRegister = async (req, res, next) => {
  const schema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
    confirmPassword: joi.string().required(),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) return res.status(422).send(error.details.map((e) => e.message));
  next();
};
