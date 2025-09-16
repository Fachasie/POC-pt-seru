import TableList from "./components/TableList"
import { useState } from "react"
import { MdMenu } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import Pagination from "./components/Pagination";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
                        <li><a>Pscking List</a></li>
                        <li><a>Dashboard</a></li>
                    </ul>
                </div>
            </div>

            {/* Main content */}
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
                    <div className="flex-none gap-2">
                            <button className="btn m-1">
                                <IoNotifications />
                            </button>
                        <div className="form-control">
                            <input type="text" placeholder="Search" className="input input-bordered w-48 md:w-auto" />
                        </div>
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
                                <li><a>Logout</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                {/* Main Content */}
                <div className="flex-1 p-4 transition-all duration-300" style={{ marginLeft: sidebarOpen ? '16rem' : '0' }}>
                    {/* masukan konten utama disini */}
                    <h1 className="text-center fw-bold">List Job Orders</h1>
                    <TableList />
                    <div className="flex justify-center mt-6"><Pagination /></div>
                    
                </div>
            </div>
        </div>
    </>
  )
}

export default App
