import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get("access_token");
    
    if (accessToken) {
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: hashParams.get("refresh_token")
      });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      window.location.href = "/auth";
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      style={{ 
        fontFamily: "'DM Sans', sans-serif", 
        background: "#fafafa", 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        padding: "24px" 
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=DM+Mono:wght@400;500&display=swap');
        
        * { box-sizing: border-box; }
        
        .fade-up { 
          opacity: 0; 
          transform: translateY(20px); 
          transition: opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1), transform 0.6s cubic-bezier(0.22, 1, 0.36, 1); 
        }
        
        .fade-up.visible { 
          opacity: 1; 
          transform: none; 
        }
        
        .mono { 
          font-family: 'DM Mono', monospace; 
        }
        
        .auth-input { 
          font-family: 'DM Sans', sans-serif; 
          font-size: 14px; 
          padding: 12px 16px; 
          border: 1px solid #e5e5e5; 
          border-radius: 6px; 
          outline: none; 
          background: #fafafa; 
          color: #0a0a0a; 
          transition: border-color 0.2s, background 0.2s; 
          width: 100%; 
        }
        
        .auth-input::placeholder { color: #a3a3a3; }
        .auth-input:focus { border-color: #059669; background: #fff; }
        
        .btn-dark { 
          display: inline-flex; 
          align-items: center; 
          justify-content: center; 
          background: #0a0a0a; 
          color: #fff; 
          font-size: 13px; 
          font-weight: 500; 
          padding: 12px 24px; 
          border-radius: 6px; 
          border: none; 
          cursor: pointer; 
          text-decoration: none; 
          transition: background 0.2s, transform 0.15s; 
          width: 100%; 
        }
        
        .btn-dark:hover:not(:disabled) { background: #1a1a1a; }
        .btn-dark:active:not(:disabled) { transform: scale(0.98); }
        .btn-dark:disabled { opacity: 0.7; cursor: not-allowed; }
      `}</style>

      <div 
        className={`fade-up ${mounted ? "visible" : ""}`} 
        style={{ 
          background: "#fff", 
          borderRadius: "14px", 
          border: "1px solid #e5e5e5", 
          padding: "40px", 
          width: "100%", 
          maxWidth: "400px", 
          boxShadow: "0 4px 24px rgba(0,0,0,0.03)" 
        }}
      >
        <div style={{ marginBottom: "32px", textAlign: "center" }}>
          <p 
            className="mono" 
            style={{ 
              fontSize: "11px", 
              fontWeight: 500, 
              color: "#059669", 
              letterSpacing: "0.1em", 
              textTransform: "uppercase", 
              marginBottom: "12px" 
            }}
          >
            System Security
          </p>
          <h2 
            style={{ 
              fontSize: "28px", 
              fontWeight: 600, 
              letterSpacing: "-0.02em", 
              color: "#0a0a0a", 
              margin: 0 
            }}
          >
            Reset Password
          </h2>
        </div>

        {error && (
          <div 
            className="mono" 
            style={{ 
              fontSize: "11px", 
              background: "#fff", 
              color: "#dc2626", 
              padding: "12px", 
              borderRadius: "6px", 
              border: "1px solid #fecaca", 
              marginBottom: "24px", 
              textAlign: "center",
              letterSpacing: "0.02em"
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "24px" }}>
            <label 
              className="mono" 
              style={{ 
                display: "block", 
                fontSize: "11px", 
                fontWeight: 500, 
                color: "#737373", 
                letterSpacing: "0.06em", 
                textTransform: "uppercase", 
                marginBottom: "8px" 
              }}
            >
              New Credential
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="auth-input"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="btn-dark"
          >
            {loading ? "Updating Record..." : "Confirm Update"}
          </button>
        </form>
      </div>
    </div>
  );
}