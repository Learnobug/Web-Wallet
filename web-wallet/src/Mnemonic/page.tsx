import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Homepage from "../components/Homepage";
import { MnemonicContext } from "../context/mnemonicContext";
import { usemnemonic } from "../libs/constant";

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#0f0f0f",
    fontFamily: "'Segoe UI', sans-serif",
    padding: "40px 20px",
  },
  container: {
    maxWidth: "720px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "32px",
  },
  backBtn: {
    background: "transparent",
    border: "1px solid #333",
    color: "#aaa",
    borderRadius: "8px",
    padding: "8px 14px",
    cursor: "pointer",
    fontSize: "14px",
  },
  heading: {
    color: "#fff",
    fontSize: "22px",
    fontWeight: 700,
    margin: 0,
  },
  card: {
    background: "#1a1a1a",
    border: "1px solid #2a2a2a",
    borderRadius: "14px",
    padding: "28px",
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
  warningBox: {
    background: "#2a1a0a",
    border: "1px solid #7c4a00",
    borderRadius: "8px",
    padding: "12px 16px",
    color: "#f59e0b",
    fontSize: "13px",
    marginBottom: "20px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "10px",
  },
  wordChip: {
    background: "#111",
    border: "1px solid #2a2a2a",
    borderRadius: "8px",
    padding: "10px 12px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  wordIndex: {
    color: "#555",
    fontSize: "11px",
    minWidth: "18px",
  },
  wordText: {
    color: "#e2e8f0",
    fontSize: "14px",
    fontWeight: 500,
  },
  noMnemonic: {
    color: "#666",
    textAlign: "center" as const,
    padding: "40px",
  },
};

export default function Mnemonic() {
  const { mnemonic } = usemnemonic(MnemonicContext);
  const navigate = useNavigate();
  const [revealed, setRevealed] = useState(false);

  const words = mnemonic ? mnemonic.split(" ") : [];

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <button style={styles.backBtn} onClick={() => navigate("/")}>← Back</button>
          <h1 style={styles.heading}>Your Wallet</h1>
        </div>

        {mnemonic ? (
          <>
            <div style={styles.card}>
              <div style={styles.sectionTitle}>Secret Recovery Phrase</div>
              <div style={styles.warningBox}>
                ⚠️ Never share your seed phrase. Anyone with it has full access to your wallet.
              </div>

              {!revealed ? (
                <button
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: "#1f1535",
                    border: "1px dashed #4f46e5",
                    borderRadius: "8px",
                    color: "#a78bfa",
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                  onClick={() => setRevealed(true)}
                >
                  Click to reveal seed phrase
                </button>
              ) : (
                <div style={styles.grid}>
                  {words.map((word: string, i: number) => (
                    <div key={i} style={styles.wordChip}>
                      <span style={styles.wordIndex}>{i + 1}.</span>
                      <span style={styles.wordText}>{word}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Homepage />
          </>
        ) : (
          <div style={styles.card}>
            <p style={styles.noMnemonic}>No mnemonic found. Please go back and generate or import a wallet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
