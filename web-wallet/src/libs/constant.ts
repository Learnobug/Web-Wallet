import React from "react";

export const usemnemonic = (MnemonicContext: React.Context<any>) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const context = React.useContext(MnemonicContext);
    if (context === undefined) {
        throw new Error("useMnemonic must be used within a MnemonicProvider");
    }
    return context;
}