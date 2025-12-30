import React from "react";

import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  FileText,
  User,
  LogOut,
  GraduationCap,
  X,
  BarChart2,
  MessageCircle,
  Users,
  Settings,
  Bell,
  Bot,
} from "lucide-react";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { to: "/dashboard", icon: LayoutDashboard, text: "Dashboard" },
    { to: "/documents", icon: FileText, text: "Documents" },
    { to: "/profile", icon: User, text: "Profile" },
  ];

  // Potential future features
  const potentialLinks = [
    { to: "/analytics", icon: BarChart2, text: "Analytics" },
    { to: "/ai-tutor", icon: Bot, text: "AI Tutor" },
    { to: "/groups", icon: Users, text: "Study Groups" },
    { to: "/messages", icon: MessageCircle, text: "Messages" },
    { to: "/notifications", icon: Bell, text: "Notifications" },
    { to: "/settings", icon: Settings, text: "Settings" },
  ];
  return (
    <>
      <div
        className={`fixed inset-0 bg-black/30 z-40 md:hidden transition-opacity duration-300 
        ${isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={toggleSidebar}
        aria-hidden="true"
      ></div>

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white/90 border-indigo-100/60
            z-50 md:relative md:w-64 md:shrink-0 md:flex md:flex-col md:translate-x-0
            transition-transform  duration-300 ease-in-out shadow-lg 
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Logo and Close Button for mobile */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-indigo-100/60">
          <button
            type="button"
            onClick={() => {
              navigate("/dashboard");
              if (toggleSidebar) toggleSidebar();
            }}
            className="flex items-center gap-3"
          >
            <div
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 
                    flex items-center justify-center text-white shadow-md shadow-indigo-500/30"
            >
              <GraduationCap
                className="text-white"
                size={20}
                strokeWidth={2.5}
              />
            </div>
            <h1 className="text-sm md:text-base font-bold text-slate-900  tracking-tight">
              Q Study
            </h1>
          </button>
          <button
            onClick={toggleSidebar}
            className="md:hidden text-indigo-600 
                    hover:text-indigo-800"
            aria-label="Close Sidebar"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-6 space-y-1.5">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={toggleSidebar}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 text-sm rounded-xl text-sm font-semi-medium 
                            transition-all duration-200 ${
                              isActive
                                ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30"
                                : "text-indigo-700 hover:bg-indigo-50 hover:text-indigo-900"
                            }`
              }
            >
              {({ isActive }) => (
                <>
                  <link.icon
                    size={18}
                    strokeWidth={2.5}
                    className={`transition-transform duration-200 ${
                      isActive ? "" : "group-hover:translate-x-110"
                    }`}
                  />
                  {link.text}
                </>
              )}
            </NavLink>
          ))}

          {/* Divider for potential features */}
          <div className="my-6 border-t border-indigo-100/60" />
          <div className="text-xs font-semibold text-indigo-400 px-4 pb-2 pt-1 tracking-wide uppercase">
            More
          </div>
          {potentialLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={toggleSidebar}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 text-sm rounded-xl text-sm font-semi-medium 
                  transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30"
                      : "text-indigo-700 hover:bg-indigo-50 hover:text-indigo-900"
                  }`
              }
            >
              {({ isActive }) => (
                <>
                  <link.icon
                    size={18}
                    strokeWidth={2.5}
                    className={`transition-transform duration-200 ${
                      isActive ? "" : "group-hover:translate-x-110"
                    }`}
                  />
                  {link.text}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="px-3 py-4 border-t border-indigo-100/60">
          <button
            onClick={handleLogout}
            className="group flex items-center gap-3 w-full px-4 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-50 hover:text-pink-600 rounded-xl transition-all duration-200"
          >
            <LogOut
              size={18}
              strokeWidth={2.5}
              className="transition-transform duration-200 group-hover:scale-110"
            />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
