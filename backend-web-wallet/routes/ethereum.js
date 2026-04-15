import { Router } from "express";
import { EtherumRPC } from "../config/constant.js";
import axios from "axios";

const EthereumRouter = Router();

EthereumRouter.get("/get-balance", (req, res) => {
    const { address } = req.query;

    axios.post(EtherumRPC, {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "eth_getBalance",
        "params": [address, "latest"]
    }).then((response) => {
        const hexBalance = response.data.result;
        const ethBalance = parseInt(hexBalance, 16) / (10 ** 18);
        res.json({ balance: ethBalance });
    }).catch((error) => {
        console.error("Error fetching balance:", error);
        res.status(500).json({ error: "Failed to fetch balance" });
    });
});

export default EthereumRouter;
