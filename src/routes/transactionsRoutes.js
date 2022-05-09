import { Router } from "express";

import {
  createTransaction,
  deleteTransaction,
  readTransactions,
} from "../controllers/transactionsController.js";
import { tokenValidator } from "../middlewares/tokenMidleware.js";
import {
  createMidleware,
  deleteMidleware,
} from "../middlewares/transactionMidleware.js";

const transactionsRoutes = Router();

transactionsRoutes.get("/transactions", readTransactions);

transactionsRoutes.post("/transactions", createTransaction);

transactionsRoutes.delete("/transactions/:id", deleteTransaction);

export default transactionsRoutes;
