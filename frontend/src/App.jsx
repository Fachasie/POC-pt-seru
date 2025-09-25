import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { MdMenu } from "react-icons/md";
import AppRoutes from './routes/AppRoutes';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') ? localStorage.getItem('theme') : 'light');
  const navigate = useNavigate();

  const handleToggleTheme = (e) => {
    if (e.target.checked) {
        setTheme('light');
    } else {
        setTheme('dark');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    localStorage.setItem('theme', theme);
    const localTheme = localStorage.getItem('theme');
    document.querySelector('html').setAttribute('data-theme', localTheme);
  }, [theme])
  return (
    <>
      <div className="flex h-screen">
            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full bg-base-100 shadow-lg z-20 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} w-64`}
            >
                <div className="flex flex-col h-full p-4">
                    <button className="btn btn-sm mb-4" onClick={() => setSidebarOpen(false)}>
                        Close
                    </button>
                    <ul className="menu bg-base-100 rounded-box w-full">
                        <li><a>Job Order</a></li>
                        <li><a>Purchase</a></li>
                        <li><a>Inventory</a></li>
                        <li><a>Packing List</a></li>
                        <li><a>Dashboard</a></li>
                    </ul>
                </div>
            </div>

            {/* Main content Original*/}
            <div className="flex-1 flex flex-col">
                {/* Navbar */}
                <div className="navbar bg-base-100 shadow z-10">
                    <div className="flex-1">
                        <button className="btn m-1" onClick={() => setSidebarOpen(true)}>
                            <MdMenu />
                        </button>
                        <a className="btn btn-ghost text-xl">Plant</a>
                        <div className="dropdown dropdown-start">
                        <div tabIndex={0} role="button" className="btn m-1">Order</div>
                        <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                            <li><a>Item 1</a></li>
                            <li><a>Item 2</a></li>
                        </ul>
                        </div>
                        <div className="dropdown dropdown-start">
                        <div tabIndex={0} role="button" className="btn m-1">Surat Permintaan Barang</div>
                        <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                            <li><a>Item 1</a></li>
                            <li><a>Item 2</a></li>
                        </ul>
                        </div>
                    </div>
                    {/* Tambahkan Switch di sini */}
                        <label className="flex cursor-pointer gap-2 me-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>
                            <input 
                            type="checkbox" 
                            value="synthwave" 
                            className="toggle theme-controller" 
                            onChange={handleToggleTheme}
                            checked={theme === 'light'}
                            />
                        </label>
                    <div className="flex-none gap-2">
                            
                        
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                <div className="w-10 rounded-full">
                                    <img
                                        alt="Tailwind CSS Navbar component"
                                        src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                                </div>
                            </div>
                            <ul
                                tabIndex={0}
                                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                                <li>
                                    <a className="justify-between">
                                        Profile
                                        <span className="badge">New</span>
                                    </a>
                                </li>
                                <li><a>Settings</a></li>
                                <li onClick={handleLogout}><a>Logout</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                {/* Main Content Secondary Untuk TableList */}
                <div className="flex-1 p-4 transition-all duration-300" style={{ marginLeft: sidebarOpen ? '16rem' : '0' }}>
                 <AppRoutes />
                </div>
            </div>
        </div>
    </>
  )
}

export default App