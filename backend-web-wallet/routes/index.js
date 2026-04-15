
import { Router } from "express";
import SolanaRouter from "./solana.js";
import EthereumRouter from "./ethereum.js";
const router = Router();

router.use("/solana", SolanaRouter);

router.use("/ethereum", EthereumRouter);

export default router;