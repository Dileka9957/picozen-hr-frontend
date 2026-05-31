import { useState, type FormEvent, type ChangeEvent } from "react";
import { useAuth } from "../../hooks/useAuth";
import { FiLoader } from "react-icons/fi";
import type { RegisterRequest } from "../../types/auth-types";
import { PLAN_OPTIONS } from "../../const/auth-const";

const INITIAL: RegisterRequest = {
  companyName: "",
  registrationNumber: "",
  email: "",
  password: "",
  fullName: "",
  phoneNumber: "",
  address: "",
  city: "",
  country: "",
  planType: "BASIC",
};

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";

export function RegisterForm({ onSwitch }: { onSwitch: () => void }) {
  const { register } = useAuth();
  const [form, setForm] = useState<RegisterRequest>(INITIAL);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(form);
      alert("Registration successful! Please log in with your new credentials.");
      onSwitch();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Create account
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        Get started with HR Portal
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-4 max-h-[60vh] overflow-y-auto pr-1"
      >
        {/* Required */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="Company Name" required>
            <input
              name="companyName"
              value={form.companyName}
              onChange={handleChange}
              required
              placeholder="Acme Inc."
              className={inputClass}
            />
          </Field>
          <Field label="Full Name" required>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
              placeholder="John Doe"
              className={inputClass}
            />
          </Field>
        </div>

        <Field label="Email" required>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="you@company.com"
            className={inputClass}
          />
        </Field>

        <Field label="Password" required>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="new-password"
            placeholder="••••••••"
            className={inputClass}
          />
        </Field>

        <Field label="Plan" required>
          <select
            name="planType"
            value={form.planType}
            onChange={handleChange}
            className={inputClass}
          >
            {PLAN_OPTIONS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </Field>

        {/* Optional */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="Registration No.">
            <input
              name="registrationNumber"
              value={form.registrationNumber}
              onChange={handleChange}
              placeholder="Optional"
              className={inputClass}
            />
          </Field>
          <Field label="Phone">
            <input
              type="tel"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              placeholder="Optional"
              className={inputClass}
            />
          </Field>
        </div>

        <Field label="Address">
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Optional"
            className={inputClass}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="City">
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="Optional"
              className={inputClass}
            />
          </Field>
          <Field label="Country">
            <input
              name="country"
              value={form.country}
              onChange={handleChange}
              placeholder="Optional"
              className={inputClass}
            />
          </Field>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium rounded-lg transition-colors"
        >
          {loading ? (
            <>
              <FiLoader className="animate-spin mr-2" /> Registering…
            </>
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Already have an account?{" "}
        <button
          onClick={onSwitch}
          className="text-blue-600 hover:underline font-medium"
        >
          Sign In
        </button>
      </p>
    </div>
  );
}
