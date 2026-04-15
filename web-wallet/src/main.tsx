import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard.tsx";
import Mnemonic from "./Mnemonic/page.tsx";

import { MnemonicProvider } from "./context/MnemonicProvider.tsx";



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <MnemonicProvider >
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/Mnemonic" element={<Mnemonic />} />
      </Routes>
    </MnemonicProvider>
    </BrowserRouter>
  </StrictMode>,
)
