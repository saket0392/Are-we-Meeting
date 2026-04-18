import { Link, useLocation, useNavigate } from "react-router-dom";

function BrandMark() {
  return (
    <Link to="/" className="flex items-center gap-3">
      <div className="min-w-0">
        <div className="text-[1.5rem] font-extrabold leading-none tracking-[-0.06em] text-white sm:text-[1.8rem]" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
          Are We Meeting
        </div>
      </div>
    </Link>
  );
}

export default function AppShell({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  

  const hasToken = Boolean(localStorage.getItem("token"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth?mode=login");
  };

  return (
    <div className="app-shell min-h-screen">
      <div className="app-grid absolute inset-0 pointer-events-none" />

      <header className="fixed top-0 left-0 right-0 z-[100] w-full pt-4 sm:pt-6">
        <div className="container-shell">
          <div className="glass-panel w-full px-8 py-4 min-h-[90px] flex items-center justify-between" style={{ marginTop: '10px' }}>
            
            <BrandMark />
            
            <div className="flex items-center gap-4">
              {hasToken ? (
                
                <>
                  <div className=" items-center gap-2 mr-4">
                    <Link to="/" className="secondary-button px-4 py-2 rounded-2xl text-slate-300 hover:text-white transition" style={{marginRight:'10px'}}>
                      Home
                    </Link>
                    <Link to="/create" className="secondary-button px-4 py-2 rounded-2xl text-slate-300 hover:text-white transition" style={{marginRight:'10px'}}>
                      Create
                    </Link>
                    <Link to="/availability" className="secondary-button px-4 py-2 rounded-2xl text-slate-300 hover:text-white transition" style={{marginRight:'10px'}}>
                      Availability
                    </Link>
                  </div>
                  <button onClick={handleLogout} className="secondary-button">
                    Logout
                  </button>
                </>
              // ... inside the (!hasToken) section of AppShell.jsx

              ) : (
                
                <div className="flex items-center gap-3">
                  {/* NEW DEMO BUTTON */}
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
                          
                        </div>
                      </div>
                    </header>

      <div className="container-shell pt-[110px]">
        <main className="relative z-10 pb-20">
          <div className="page-frame">{children}</div>
        </main>
      </div>
    </div>
  );
}