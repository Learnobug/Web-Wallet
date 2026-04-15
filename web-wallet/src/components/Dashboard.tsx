import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usemnemonic } from "../libs/constant";
import { generateMnemonic, validateMnemonic } from "bip39";
import { MnemonicContext } from "../context/mnemonicContext";

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#0f0f0f",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Segoe UI', sans-serif",
  },
  card: {
    background: "#1a1a1a",
    border: "1px solid #2a2a2a",
    borderRadius: "16px",
    padding: "48px 40px",
    width: "100%",
    maxWidth: "440px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
  },
  logo: {
    textAlign: "center",
    marginBottom: "8px",
    fontSize: "32px",
  },
  title: {
    color: "#ffffff",
    fontSize: "24px",
    fontWeight: 700,
    textAlign: "center",
    margin: "0 0 8px",
  },
  subtitle: {
    color: "#666",
    fontSize: "14px",
    textAlign: "center",
    margin: "0 0 36px",
  },
  btnPrimary: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
    marginBottom: "12px",
    transition: "opacity 0.2s",
  },
  btnSecondary: {
    width: "100%",
    padding: "14px",
    background: "transparent",
    color: "#a78bfa",
    border: "1px solid #4f46e5",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
    marginBottom: "20px",
    transition: "background 0.2s",
  },
  importBox: {
    marginTop: "4px",
  },
  label: {
    color: "#999",
    fontSize: "13px",
    display: "block",
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    background: "#111",
    border: "1px solid #333",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    marginBottom: "12px",
  },
  btnSubmit: {
    width: "100%",
    padding: "12px",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
  },
};

export default function Dashboard() {
  const [passphrase, setpassphrase] = useState("");
  const [importPassphrase, setImportPassphrase] = useState(false);
  const navigate = useNavigate();
  const { setMnemonic: setmnemonic } = usemnemonic(MnemonicContext);

  const genrateMnemonic = () => {
    const mnemonic = generateMnemonic();
    if (!validateMnemonic(mnemonic)) {
      alert("Failed to generate a valid mnemonic. Please try again.");
      return;
    }
    setmnemonic(mnemonic);
    navigate("/Mnemonic");
  };

  const handlesubmit = () => {
    const norm = passphrase.trim().toLowerCase().replace(/\s+/g, " ");
    if (!validateMnemonic(norm)) {
      alert("Invalid mnemonic phrase");
      return;
    }
    setmnemonic(norm);
    navigate("/Mnemonic");
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>🔐</div>
        <h1 style={styles.title}>Web Wallet</h1>
        <p style={styles.subtitle}>Secure, non-custodial crypto wallet</p>

        <button style={styles.btnPrimary} onClick={genrateMnemonic}>
          Generate New Wallet
        </button>
        <button style={styles.btnSecondary} onClick={() => setImportPassphrase(true)}>
          Import Existing Wallet
        </button>

        {importPassphrase && (
          <div style={styles.importBox}>
            <label style={styles.label}>Enter your seed phrase</label>
            <textarea
              style={{ ...styles.input, height: "90px", resize: "vertical" }}
              value={passphrase}
              onChange={(e) => setpassphrase(e.target.value)}
              placeholder="word1 word2 word3 ... word12"
            />
            <button style={styles.btnSubmit} onClick={handlesubmit}>
              Import Wallet
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
