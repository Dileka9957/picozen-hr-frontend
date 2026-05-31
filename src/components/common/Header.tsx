import { FiBell, FiMenu, FiSearch } from "react-icons/fi";
import type { HeaderProps } from "../../types/components-types";
import { useAuth } from "../../hooks/useAuth";

export const Header = ({ setSidebarOpen }: HeaderProps) => {
  const { user } = useAuth();
  const displayName = user?.fullName || "HR Manager";
  const displayEmail = user?.email || "hr@picozen.tech";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "HR";

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
            <FiMenu className="text-2xl text-gray-600" />
          </button>
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <FiBell className="text-xl" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold" title={displayName}>
              {initials}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{displayName}</p>
              <p className="text-xs text-gray-500">{displayEmail}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
