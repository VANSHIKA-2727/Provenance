import { BrowserRouter, Routes, Route } from "react-router-dom";

import Provenance from "./pages/Landing.jsx";
import Auth from "./pages/Auth.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Provenance />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </BrowserRouter>
  );
}
