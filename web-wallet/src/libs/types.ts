
type currency = "ethereum" | "solana" | "blockchain"
type info = {
    publicKey: string,
    secretKey: string,
    balance?: number
}

type accounts = {
    [key in currency]?: info[]
}




export type wallet = {

    accounts: accounts[]
}
