import React from "react"
import { useAuth } from "../../context/AuthContext"
import { Bell, User, Menu } from "lucide-react"

const Header = ({ toggleSidebar }) => {
    const { user } = useAuth();

    return (
        <header className="sticky top-0 z-40 w-full h-16 bg-white/90 backdrop-blur-xl border-b border-indigo-100/60">
            <div className="flex items-center justify-between h-full px-6 ">

                {/* Mobile Menu Button */}
                <button
                    onClick={toggleSidebar}
                    className="md:hidden inline-flex items-center justify-center w-10 h-10 text-indigo-600 
                    hover:bg-indigo-50 rounded-xl transition-all duration-200"
                    aria-label="Toggle Sidebar"
                >
                    <Menu size={24} />
                </button>

                <div className=" hidden md:block"></div>

                <div className="flex items-center gap-3">
                    <button className="relative inline-flex items-center justify-center w-10
                    w-10 h-10 text-indigo-600 hover:text-indigo-700
                    hover:bg-indigo-50 rounded-xl transition-all duration-200 group">
                        <Bell size={20} strokeWidth={2} className="group-hover:scale-110 transition-transform duration-200" />

                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cyan-500 rounded-full ring-2 ring-white"></span>
                    </button>

                    {/* User Profile */}
                    <div className="flex items-center gap-3 pl-3 border-l border-indigo-100/60">
                        <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl hover:bg-indigo-50/50 
                        transition-colors duration-200">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 
                            flex items-center justify-center text-white shadow-md shadow-indigo-500/30 group-hover:shadow-lg 
                            group-hover:shadow-indigo-500/40 transition-all duration-200 ">
                                <User size={18} strokeWidth={2.5} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-900">
                                    {user?.name || 'User'}
                                </p>
                                <p className="text-xs text-indigo-600/70">
                                    {user?.email || 'user@example.com'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header