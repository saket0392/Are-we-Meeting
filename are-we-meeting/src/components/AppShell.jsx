import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function BrandMark() {
  return (
    <Link to="/" className="flex items-center gap-3">
      <div className="min-w-0">
        <div 
          className="text-[1.5rem] font-extrabold leading-none tracking-[-0.06em] text-white sm:text-[1.8rem]" 
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
  
  // 100% foolproof check for desktop size
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  
  const navigate = useNavigate();
  const location = useLocation();
  const hasToken = Boolean(localStorage.getItem("token"));

  // Listen for screen resizing to swap menus instantly
  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 768;
      setIsDesktop(desktop);
      if (desktop) setIsMenuOpen(false); // Force close dropdown if expanded to desktop
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close menu automatically on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsMenuOpen(false);
    navigate("/auth?mode=login");
  };

  return (
    <div className="app-shell min-h-screen">
      <div className="app-grid absolute inset-0 pointer-events-none" />

      <header className="fixed top-0 left-0 right-0 z-[100] w-full pt-4 sm:pt-6">
        <div className="container-shell px-4 sm:px-6">
          <div className="glass-panel w-full px-8 py-4 min-h-[90px] flex items-center justify-between relative" style={{ marginTop: '10px' }}>
            
            <BrandMark />
            
            {/* --- STRICT DESKTOP OR MOBILE RENDERING --- */}
            {isDesktop ? (
              
              /* DESKTOP VIEW */
              <div className="flex items-center gap-4">
                {hasToken ? (
                  <>
                    <div className="flex items-center gap-2 mr-4">
                      <Link to="/" className="secondary-button px-4 py-2 rounded-2xl text-slate-300 hover:text-white transition"style={{marginRight:'10px'}}>Home</Link>
                      <Link to="/create" className="secondary-button px-4 py-2 rounded-2xl text-slate-300 hover:text-white transition" style={{marginRight:'10px'}}>Create</Link>
                      <Link to="/availability" className="secondary-button px-4 py-2 rounded-2xl text-slate-300 hover:text-white transition" style={{marginRight:'10px'}}>Availability</Link>
                    </div>
                    <button onClick={handleLogout} className="secondary-button" style={{marginRight:'10px'}}>Logout</button>
                  </>
                ) : (
                  <div className="flex items-center gap-3">
                    <Link to="/demo" className="primary-button px-4 py-2 rounded-2xl border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 transition text-sm font-bold" style={{marginRight:'10px'}}>Try Demo</Link>
                    <Link to="/auth?mode=login" className="ghost-button text-sm" style={{marginRight:'10px'}}>Login</Link>
                    <Link to="/auth?mode=register" className="primary-button text-sm" style={{marginRight:'10px'}}>Sign Up</Link>
                  </div>
                )}
              </div>

            ) : (

              /* MOBILE VIEW: Toggle Button */
              <div className="flex items-center">
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="primary-button flex items-center gap-1 p-2 text-slate-300 hover:text-white transition focus:outline-none"
                >
                  Menu
                </button>
              </div>

            )}

            {/* --- MOBILE DROPDOWN PANEL --- */}
            {(!isDesktop && isMenuOpen) && (
              <div className="absolute top-[calc(100%+12px)] left-0 right-0 glass-panel p-6 flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-200 shadow-2xl">
                {hasToken ? (
                  <>
                    <Link to="/" className="secondary-button w-full text-center text-slate-300 hover:text-cyan-400 py-3 mb-2" style={{marginBottom:'10px'}}>Home</Link>
                    <Link to="/create" className="secondary-button w-full text-center text-slate-300 hover:text-cyan-400 py-3 mb-2" style={{marginBottom:'10px'}}>Create</Link>
                    <Link to="/availability" className="secondary-button w-full text-center text-slate-300 hover:text-cyan-400 py-3 mb-2" style={{marginBottom:'10px'}}>Availability</Link>
                    <button onClick={handleLogout} className="primary-button w-full text-center text-red-400 py-3 font-bold" style={{marginBottom:'10px'}}>Logout</button>
                  </>
                ) : (
                  <>
                    <Link to="/demo" className="primary-button w-full text-center text-cyan-400 font-bold py-3 mb-2" style={{marginBottom:'10px'}}>Try Demo</Link>
                    <Link to="/auth?mode=login" className="secondary-button w-full text-center text-slate-300 py-3 mb-2"  style={{marginBottom:'10px'}}>Login</Link>
                    <Link to="/auth?mode=register" className="primary-button w-full text-center text-slate-300 py-3 font-bold"  style={{marginBottom:'10px'}}>Sign Up</Link>
                  </>
                )}
              </div>
            )}
            
          </div>
        </div>
      </header>

      <div className="container-shell pt-[110px] sm:pt-[130px]">
        <main className="relative z-10 pb-20">
          <div className="page-frame">{children}</div>
        </main>
      </div>
    </div>
  );
}