/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("mode") === "signup") {
      setIsLogin(false);
    }
  }, []);

  const handleGoogleLogin = () => {
    console.log("Google login triggered");
  };

  const handleMicrosoftLogin = () => {
    console.log("Microsoft login triggered");
  };

  const handleEmailAuth = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Mocking a network request delay
    setTimeout(() => {
      setLoading(false);
      console.log("Auth submitted:", {
        isLogin,
        email,
        companyName,
        gstNumber,
      });
      // If using React Router, you would do: navigate('/dashboard')
      // window.location.href = "/dashboard";
    }, 1000);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-white text-neutral-900 antialiased selection:bg-emerald-600 selection:text-white">
      <div className="hidden lg:flex lg:w-[45%] h-full bg-neutral-950 p-16 flex-col justify-between relative overflow-hidden border-r border-neutral-900">
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-gradient-to-br from-neutral-950 via-neutral-950 to-emerald-950/30" />

        <div className="relative z-10">
          <h1 className="text-5xl lg:text-6xl font-bold tracking-tighter leading-[1.05] text-white max-w-lg mt-12">
            The immutable ledger for your compliance posture.
          </h1>
        </div>

        <div className="relative z-10 border-t border-neutral-800 pt-8">
          <div>
            <p
              className="text-[11px] text-emerald-500 uppercase tracking-widest font-bold mb-2"
              style={{ fontFamily: "'Geist Mono', monospace" }}
            >
              SYSTEM_STATUS
            </p>
            <p className="text-[14px] text-neutral-300 font-medium">
              All telemetry pipelines active.
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 h-full overflow-y-auto flex flex-col justify-between p-6 sm:p-12 lg:p-24 bg-white relative">
        {/* BACK TO WEBSITE BUTTON */}
        <div className="absolute top-6 left-6 sm:top-10 sm:left-10 z-10">
          <a
            href="/"
            className="flex items-center gap-2 text-[13px] font-bold text-neutral-500 hover:text-neutral-950 transition-colors bg-white px-3 py-2 rounded-lg hover:bg-neutral-50"
            style={{ textDecoration: "none" }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to website
          </a>
        </div>

        <div className="lg:hidden flex items-center gap-3 cursor-pointer mb-12 mt-10">
          <img
            src="/provenance.png"
            alt="Provenance Logo"
            className="h-8 filter invert"
          />
          <span className="text-[16px] font-bold tracking-widest uppercase">
            Provenance
          </span>
        </div>

        <div className="w-full max-w-[440px] mx-auto flex-1 flex flex-col justify-center">
          <div className="mb-10">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-950 mb-3">
              {isLogin ? "Welcome back" : "Initialize account"}
            </h2>
            <p className="text-[15px] text-neutral-500 font-light leading-relaxed">
              {isLogin
                ? "Enter your credentials to access your enterprise dashboard."
                : "Set up your workspace to begin syncing telemetry data."}
            </p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={handleGoogleLogin}
                className="flex items-center justify-center gap-3 px-6 py-3.5 bg-white border border-neutral-200 rounded-lg shadow-sm hover:bg-neutral-50 hover:border-neutral-300 transition-colors cursor-pointer group w-full"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                <span className="text-[13px] font-bold uppercase tracking-widest text-neutral-700 group-hover:text-neutral-950 transition-colors">
                  Google
                </span>
              </button>

              <button
                onClick={handleMicrosoftLogin}
                className="flex items-center justify-center gap-3 px-6 py-3.5 bg-white border border-neutral-200 rounded-lg shadow-sm hover:bg-neutral-50 hover:border-neutral-300 transition-colors cursor-pointer group w-full"
              >
                <svg className="w-5 h-5" viewBox="0 0 21 21">
                  <path d="M1 1h9v9H1z" fill="#F25022" />
                  <path d="M11 1h9v9h-9z" fill="#7FBA00" />
                  <path d="M1 11h9v9H1z" fill="#00A4EF" />
                  <path d="M11 11h9v9h-9z" fill="#FFB900" />
                </svg>
                <span className="text-[13px] font-bold uppercase tracking-widest text-neutral-700 group-hover:text-neutral-950 transition-colors">
                  Microsoft
                </span>
              </button>
            </div>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-neutral-200"></div>
              <span
                className="flex-shrink-0 mx-4 text-[10px] uppercase tracking-widest font-bold text-neutral-400"
                style={{ fontFamily: "'Geist Mono', monospace" }}
              >
                Or continue with email
              </span>
              <div className="flex-grow border-t border-neutral-200"></div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleEmailAuth}>
              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-widest ml-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Your Company Pvt Ltd"
                      required
                      className="w-full text-[14px] rounded-lg px-4 py-4 outline-none border border-neutral-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 bg-neutral-50/50 focus:bg-white text-neutral-950 placeholder-neutral-400 font-medium transition-all shadow-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-widest ml-1">
                      GST Number
                    </label>
                    <input
                      type="text"
                      value={gstNumber}
                      onChange={(e) => setGstNumber(e.target.value)}
                      placeholder="22AAAAA0000A1Z5"
                      required
                      className="w-full text-[14px] rounded-lg px-4 py-4 outline-none border border-neutral-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 bg-neutral-50/50 focus:bg-white text-neutral-950 placeholder-neutral-400 font-medium transition-all shadow-sm"
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-widest ml-1">
                  Work Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@enterprise.com"
                  required
                  className="w-full text-[14px] rounded-lg px-4 py-4 outline-none border border-neutral-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 bg-neutral-50/50 focus:bg-white text-neutral-950 placeholder-neutral-400 font-medium transition-all shadow-sm"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-widest">
                    Password
                  </label>
                  {isLogin && (
                    <a
                      href="#"
                      className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest cursor-pointer"
                      onClick={(e) => e.preventDefault()}
                    >
                      Forgot Password?
                    </a>
                  )}
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full text-[14px] rounded-lg px-4 py-4 outline-none border border-neutral-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 bg-neutral-50/50 focus:bg-white text-neutral-950 placeholder-neutral-400 font-medium transition-all shadow-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-neutral-950 text-white rounded-lg shadow-md text-[13px] font-bold px-4 py-4 hover:bg-neutral-800 transition-colors uppercase tracking-widest cursor-pointer mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Processing..."
                  : isLogin
                    ? "Sign In"
                    : "Create Workspace"}
              </button>
            </form>

            <div className="pt-4 text-center">
              <p className="text-[14px] text-neutral-500 font-light">
                {isLogin
                  ? "Don't have an account? "
                  : "Already have an account? "}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError(null);
                    const newUrl = new URL(window.location.href);
                    newUrl.searchParams.set(
                      "mode",
                      !isLogin ? "login" : "signup",
                    );
                    window.history.replaceState({}, "", newUrl);
                  }}
                  className="text-neutral-950 font-bold cursor-pointer"
                >
                  {isLogin ? "Create Workspace" : "Sign In"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
