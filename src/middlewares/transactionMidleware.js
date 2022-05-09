import joi from "joi";

export const createMidleware = async (req, res) => {
  const schema = joi.object({
    description: joi.string().required(),
    value: joi.number().required(),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) return res.status(422).send(error.details.map((e) => e.message));
  next();
};

export const deleteMidleware = async (req, res) => {
  const schema = joi.object({
    id: joi.string().required(),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) return res.status(422).send(error.details.map((e) => e.message));
  next();
};
