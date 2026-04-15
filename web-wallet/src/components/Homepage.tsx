import { mnemonicToSeedSync, validateMnemonic } from "bip39";
import { useState } from "react";
import { Keypair } from "@solana/web3.js";
import type { wallet } from '../libs/types';
import { derivePath } from "ed25519-hd-key";
import { HDNodeWallet, SigningKey, getAddress, keccak256 } from "ethers";
import { usemnemonic } from "../libs/constant";
import { MnemonicContext } from "../context/mnemonicContext";
import axios from "axios";

const BACKEND_URL = "http://localhost:5000/";

function computeEthereumAddress(key: string | SigningKey): string {
  let pubkey: string;
  if (typeof key === "string") {
    pubkey = SigningKey.computePublicKey(key, false);
  } else {
    pubkey = key.publicKey;
  }
  return getAddress(keccak256("0x" + pubkey.substring(4)).substring(26));
}

function deriveEthereumPrivateKey(seed: Buffer, derivationPath: string): string {
  const hdNode = HDNodeWallet.fromSeed(seed);
  const child = hdNode.derivePath(derivationPath);
  return child.privateKey;
}

const styles: Record<string, React.CSSProperties> = {
  section: {
    marginTop: "4px",
  },
  addBtn: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
    marginBottom: "24px",
  },
  sectionTitle: {
    color: "#a78bfa",
    fontSize: "13px",
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    marginBottom: "16px",
  },
  accountCard: {
    background: "#111",
    border: "1px solid #2a2a2a",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "16px",
  },
  accountTitle: {
    color: "#fff",
    fontSize: "16px",
    fontWeight: 600,
    marginBottom: "16px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  chainSection: {
    marginBottom: "14px",
  },
  chainLabel: {
    color: "#666",
    fontSize: "12px",
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.06em",
    marginBottom: "8px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  keyRow: {
    background: "#1a1a1a",
    border: "1px solid #222",
    borderRadius: "8px",
    padding: "10px 14px",
    marginBottom: "6px",
  },
  keyLabel: {
    color: "#555",
    fontSize: "11px",
    marginBottom: "4px",
  },
  keyValue: {
    color: "#94a3b8",
    fontSize: "12px",
    fontFamily: "monospace",
    wordBreak: "break-all" as const,
  },
  secretKey: {
    color: "#f87171",
    fontSize: "12px",
    fontFamily: "monospace",
    wordBreak: "break-all" as const,
    transition: "filter 0.2s",
    cursor: "pointer",
  },
  secretHint: {
    color: "#555",
    fontSize: "11px",
    marginTop: "4px",
  },
  balanceRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginTop: "8px",
  },
  balanceBtn: {
    padding: "6px 14px",
    background: "transparent",
    border: "1px solid #4f46e5",
    borderRadius: "6px",
    color: "#a78bfa",
    fontSize: "12px",
    fontWeight: 600,
    cursor: "pointer",
  },
  balanceValue: {
    color: "#34d399",
    fontSize: "13px",
    fontWeight: 600,
    fontFamily: "monospace",
  },
  balanceLoading: {
    color: "#666",
    fontSize: "12px",
    fontStyle: "italic",
  },
  balanceError: {
    color: "#f87171",
    fontSize: "12px",
  },
};

function KeyRow({ label, value, secret }: { label: string; value: string; secret?: boolean }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <div style={styles.keyRow}>
      <div style={styles.keyLabel}>{label}</div>
      {secret ? (
        <>
          <div
            style={{ ...styles.secretKey, filter: revealed ? "none" : "blur(4px)" }}
            onClick={() => setRevealed(r => !r)}
          >
            {value}
          </div>
          <div style={styles.secretHint}>{revealed ? "Click to hide" : "Click to reveal"}</div>
        </>
      ) : (
        <div style={styles.keyValue}>{value}</div>
      )}
    </div>
  );
}

type BalanceState = { status: "idle" | "loading" | "error"; value: number | null };

function BalanceButton({ address, chain }: { address: string; chain: "ethereum" | "solana" }) {
  const [balance, setBalance] = useState<BalanceState>({ status: "idle", value: null });

  const fetchBalance = async () => {
    setBalance({ status: "loading", value: null });
    try {
      const endpoint = chain === "ethereum" ? "api/ethereum/get-balance" : "api/solana/get-balance";
      const response = await axios.get(`${BACKEND_URL}${endpoint}`, {
        params: { address },
      });
      setBalance({ status: "idle", value: response.data.balance });
    } catch {
      setBalance({ status: "error", value: null });
    }
  };

  return (
    <div style={styles.balanceRow}>
      <button style={styles.balanceBtn} onClick={fetchBalance} disabled={balance.status === "loading"}>
        {balance.status === "loading" ? "Fetching…" : "Get Balance"}
      </button>
      {balance.status === "idle" && balance.value !== null && (
        <span style={styles.balanceValue}>
          {balance.value} {chain === "ethereum" ? "ETH" : "SOL"}
        </span>
      )}
      {balance.status === "error" && (
        <span style={styles.balanceError}>Failed to fetch</span>
      )}
    </div>
  );
}

export default function Homepage() {
  const [walletData, setWalletData] = useState<wallet>({ accounts: [] });
  const { mnemonic } = usemnemonic(MnemonicContext);

  const normalized = mnemonic
    ? mnemonic.trim().toLowerCase().replace(/\s+/g, " ")
    : "";
  const seedHex =
    normalized && validateMnemonic(normalized)
      ? mnemonicToSeedSync(normalized).toString("hex")
      : "";

  const addAccount = () => {
    const i = walletData.accounts.length;
    const seedBuf = Buffer.from(seedHex, "hex");
    const ethPrivateKey = deriveEthereumPrivateKey(seedBuf, `m/44'/60'/${i}'/0'`);
    const ethAddress = computeEthereumAddress(ethPrivateKey);
    const derivedSeed = derivePath(`m/44'/501'/${i}'/0'`, seedHex).key;
    const kp = Keypair.fromSeed(derivedSeed);

    const newAccount: wallet["accounts"][number] = {
      ethereum: [{ publicKey: ethAddress, secretKey: ethPrivateKey.replace(/^0x/, "") }],
      solana: [{ publicKey: kp.publicKey.toBase58(), secretKey: Buffer.from(kp.secretKey).toString("hex") }],
    };

    setWalletData(prev => ({ accounts: [...prev.accounts, newAccount] }));
  };

  return (
    <div style={styles.section}>
      {normalized && (
        <button style={styles.addBtn} onClick={addAccount}>
          + Add Account
        </button>
      )}

      {walletData.accounts.length > 0 && (
        <>
          <div style={styles.sectionTitle}>Accounts</div>
          {walletData.accounts.map((account, index) => (
            <div key={index} style={styles.accountCard}>
              <div style={styles.accountTitle}>
                <span>👤</span> Account {index + 1}
              </div>

              {account.ethereum && (
                <div style={styles.chainSection}>
                  <div style={styles.chainLabel}>
                    <span>🔷</span> Ethereum
                  </div>
                  {account.ethereum.map((eth, j) => (
                    <div key={j}>
                      <KeyRow label="Public Key" value={eth.publicKey} />
                      <KeyRow label="Private Key" value={eth.secretKey} secret />
                      <BalanceButton address={eth.publicKey} chain="ethereum" />
                    </div>
                  ))}
                </div>
              )}

              {account.solana && (
                <div style={styles.chainSection}>
                  <div style={styles.chainLabel}>
                    <span>🟣</span> Solana
                  </div>
                  {account.solana.map((sol, j) => (
                    <div key={j}>
                      <KeyRow label="Public Key" value={sol.publicKey} />
                      <KeyRow label="Private Key" value={sol.secretKey} secret />
                      <BalanceButton address={sol.publicKey} chain="solana" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
