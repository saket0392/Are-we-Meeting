import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function BrandMark() {
  return (
    <Link to="/" className="flex items-center gap-3">
      <div className="min-w-0">
        <div 
          className="text-[1.3rem] font-extrabold leading-none tracking-[-0.06em] text-white sm:text-[1.8rem]" 
          style={{ fontFamily: '"Space Grotesk", sans-serif' }}
        >
          Are We Meeting
        </div>
      </div>
    </Link>
  );
}

export default function AppShell({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const hasToken = Boolean(localStorage.getItem("token"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsMenuOpen(false);
    navigate("/auth?mode=login");
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="app-shell min-h-screen">
      <div className="app-grid absolute inset-0 pointer-events-none" />

      <header className="fixed top-0 left-0 right-0 z-[100] w-full pt-4 sm:pt-6 px-4">
        <div className="container-shell max-w-7xl mx-auto">
          {/* Main Navbar Panel */}
          <div className="glass-panel w-full px-6 py-4 min-h-[80px] sm:min-h-[90px] flex items-center justify-between relative">
            
            <BrandMark />

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              {hasToken ? (
                <>
                  <div className="flex items-center gap-2 mr-4">
                    <Link to="/" className="secondary-button px-4 py-2 rounded-2xl text-slate-300 hover:text-white transition">
                      Home
                    </Link>
                    <Link to="/create" className="secondary-button px-4 py-2 rounded-2xl text-slate-300 hover:text-white transition">
                      Create
                    </Link>
                    <Link to="/availability" className="secondary-button px-4 py-2 rounded-2xl text-slate-300 hover:text-white transition">
                      Availability
                    </Link>
                  </div>
                  <button onClick={handleLogout} className="secondary-button px-4 py-2">
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <Link 
                    to="/demo" 
                    className="primary-button px-4 py-2 rounded-2xl border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 transition text-sm font-bold"
                  >
                    Try Demo
                  </Link>
                  <Link to="/auth?mode=login" className="ghost-button text-sm">
                    Login
                  </Link>
                  <Link to="/auth?mode=register" className="primary-button text-sm">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Toggle Button */}
            <button 
              onClick={toggleMenu}
              className="md:hidden p-2 text-slate-300 hover:text-white transition"
              aria-label="Toggle Menu"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>

            {/* Mobile Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute top-[calc(100%+10px)] left-0 right-0 glass-panel md:hidden p-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-200">
                {hasToken ? (
                  <>
                    <Link to="/" onClick={closeMenu} className="text-slate-300 hover:text-cyan-400 text-lg py-2 border-b border-white/5">Home</Link>
                    <Link to="/create" onClick={closeMenu} className="text-slate-300 hover:text-cyan-400 text-lg py-2 border-b border-white/5">Create Meeting</Link>
                    <Link to="/availability" onClick={closeMenu} className="text-slate-300 hover:text-cyan-400 text-lg py-2 border-b border-white/5">My Availability</Link>
                    <button 
                      onClick={handleLogout}
                      className="text-red-400 text-left text-lg py-2"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/demo" onClick={closeMenu} className="text-cyan-400 font-bold py-2 border-b border-white/5">Try Demo</Link>
                    <Link to="/auth?mode=login" onClick={closeMenu} className="text-slate-300 py-2 border-b border-white/5">Login</Link>
                    <Link to="/auth?mode=register" onClick={closeMenu} className="text-slate-300 py-2">Sign Up</Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="container-shell pt-[120px] sm:pt-[130px]">
        <main className="relative z-10 pb-20">
          <div className="page-frame">{children}</div>
        </main>
      </div>
    </div>
  );
}