import { BrowserRouter, Routes, Route } from "react-router-dom";

import Provenance from "./pages/Provenance.jsx";
import Auth from "./pages/Auth.jsx";
import Home from "./pages/Home.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Provenance />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}