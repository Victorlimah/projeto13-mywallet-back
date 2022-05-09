import cors from "cors";
import dotenv from "dotenv";
import express, { json } from "express";

import authRoutes from "./routes/authRoutes.js";
import transactionsRoutes from "./routes/transactionsRoutes.js";

const app = express();
dotenv.config();
app.use(json());
app.use(cors());

app.use(authRoutes);
app.use(transactionsRoutes);

const port = process.env.PORT;

app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
