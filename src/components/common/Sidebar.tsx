import { useState } from "react";
import {
  FiAward,
  FiBriefcase,
  FiCalendar,
  FiDollarSign,
  FiFileText,
  FiLogOut,
  FiSettings,
  FiTrendingUp,
  FiUsers,
  FiX,
} from "react-icons/fi";
import { HiOutlineUserGroup } from "react-icons/hi";

export const Sidebar = () => {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <aside
      className={`${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } fixed lg:translate-x-0 lg:static inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transition-transform duration-300 ease-in-out`}
    >
      <div className="flex items-center justify-between p-6 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <HiOutlineUserGroup className="text-3xl text-blue-500" />
          <span className="text-xl font-bold">HR Portal</span>
        </div>
        <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
          <FiX className="text-2xl" />
        </button>
      </div>

      <nav className="p-4 space-y-2">
        {[
          { id: "overview", label: "Overview", icon: FiTrendingUp },
          { id: "employees", label: "Employees", icon: FiUsers },
          { id: "recruitment", label: "Recruitment", icon: FiBriefcase },
          { id: "leave", label: "Leave Management", icon: FiCalendar },
          { id: "payroll", label: "Payroll", icon: FiDollarSign },
          { id: "performance", label: "Performance", icon: FiAward },
          { id: "documents", label: "Documents", icon: FiFileText },
          { id: "settings", label: "Settings", icon: FiSettings },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedTab(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              selectedTab === item.id
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-800"
            }`}
          >
            <item.icon className="text-xl" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="absolute bottom-0 w-64 p-4 border-t border-gray-800">
        <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
          <FiLogOut className="text-xl" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
