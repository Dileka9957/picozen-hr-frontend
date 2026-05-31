import { useState } from "react";
import { HiOutlineUserGroup } from "react-icons/hi";
import { RegisterForm } from "../components/auth/RegisterForm";
import { LoginForm } from "../components/auth/LoginForm";

export function AuthPage() {
  const [view, setView] = useState<"login" | "register">("login");

  return (
    <div className="min-h-screen w-full bg-gray-100 dark:bg-gray-900 flex">
      {/* Left branding panel — hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-900 flex-col items-center justify-center p-12 text-white">
        <HiOutlineUserGroup className="text-7xl text-blue-500 mb-6" />
        <h1 className="text-4xl font-bold mb-4">HR Portal</h1>
        <p className="text-gray-400 text-center text-lg max-w-sm">
          Manage your workforce, payroll, recruitment, and more — all in one
          place.
        </p>
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center justify-center space-x-2 mb-8">
            <HiOutlineUserGroup className="text-4xl text-blue-500" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              HR Portal
            </span>
          </div>

          {view === "login" ? (
            <LoginForm onSwitch={() => setView("register")} />
          ) : (
            <RegisterForm onSwitch={() => setView("login")} />
          )}
        </div>
      </div>
    </div>
  );
}
