import { useState } from "react";
import { MnemonicContext } from "./mnemonicContext";

export const MnemonicProvider = ({children}: any) => {
  const [mnemonicState, setMnemonicState] = useState<string | null>(null);

  return (
    <MnemonicContext.Provider value={{ mnemonic: mnemonicState, setMnemonic: setMnemonicState } as any}>
      {children}
    </MnemonicContext.Provider>
  );
};

