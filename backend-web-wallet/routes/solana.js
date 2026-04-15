import { Router } from "express";
import axios from "axios";
import { SolanaRPC } from "../config/constant.js";

const SolanaRouter = Router();

SolanaRouter.get("/get-balance", (req, res) => {
    const { address } = req.query;

    axios.post(SolanaRPC, {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "getBalance",
        "params": [address]
    }).then((response) => {
        const lamports = response.data.result.value;
        const solBalance = lamports / (10 ** 9);
        res.json({ balance: solBalance });
    }).catch((error) => {
        console.error("Error fetching balance:", error);
        res.status(500).json({ error: "Failed to fetch balance" });
    });
});

export default SolanaRouter;
