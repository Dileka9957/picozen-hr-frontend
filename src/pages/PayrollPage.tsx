import { useState, useEffect, type FormEvent } from "react";
import { FiDollarSign, FiPlus, FiLoader, FiCheck, FiX } from "react-icons/fi";
import {
  getMonthlyPayrolls,
  generatePayroll,
  processPayment,
  type PayrollRecord,
} from "../services/payrollService";
import { getAllEmployees, type Employee } from "../services/employeeService";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const PayrollPage = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // 1-indexed

  // Filters
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  // States
  const [payrolls, setPayrolls] = useState<PayrollRecord[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal Dialog Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Form State
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [allowances, setAllowances] = useState("0");
  const [overtimePay, setOvertimePay] = useState("0");
  const [otherDeductions, setOtherDeductions] = useState("0");

  const loadPayrolls = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getMonthlyPayrolls(selectedMonth, selectedYear);
      setPayrolls(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load payroll records");
    } finally {
      setLoading(false);
    }
  };

  const loadEmployees = async () => {
    try {
      const res = await getAllEmployees();
      setEmployees(res.data);
      if (res.data.length > 0) {
        setSelectedEmployeeId(res.data[0].id?.toString() || "");
      }
    } catch (err) {
      console.error("Failed to load employee list for dropdown selection", err);
    }
  };

  useEffect(() => {
    loadPayrolls();
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    loadEmployees();
  }, []);

  const handlePay = async (id: number) => {
    if (!window.confirm("Confirm bank transfer and complete payment?")) return;
    try {
      await processPayment(id);
      await loadPayrolls();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to process payment");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitLoading(true);

    try {
      await generatePayroll(
        parseInt(selectedEmployeeId),
        selectedMonth,
        selectedYear,
        parseFloat(allowances || "0"),
        parseFloat(overtimePay || "0"),
        parseFloat(otherDeductions || "0")
      );
      setIsModalOpen(false);
      setAllowances("0");
      setOvertimePay("0");
      setOtherDeductions("0");
      await loadPayrolls();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to generate payroll");
    } finally {
      setSubmitLoading(false);
    }
  };

  // Metrics
  const totalPayrollValue = payrolls.reduce((acc, curr) => acc + curr.netSalary, 0);
  const paidCount = payrolls.filter(p => p.paid).length;
  const pendingCount = payrolls.filter(p => !p.paid).length;

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Payroll Management</h1>
          <p className="text-gray-600 mt-1">Track and manage employee compensation and taxes</p>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {MONTHS.map((m, idx) => (
              <option key={idx} value={idx + 1}>{m}</option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[currentYear - 2, currentYear - 1, currentYear, currentYear + 1].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
          >
            <FiPlus />
            <span>Generate Run</span>
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <FiDollarSign size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Net Salary</p>
            <p className="text-2xl font-bold text-gray-800">${totalPayrollValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg">
            <FiCheck size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Completed Payments</p>
            <p className="text-2xl font-bold text-gray-800">{paidCount} Employees</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg">
            <FiX size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Pending Approvals</p>
            <p className="text-2xl font-bold text-gray-800">{pendingCount} Records</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <FiLoader className="w-8 h-8 text-blue-600 animate-spin mb-2" />
          <p className="text-gray-500 text-sm">Loading monthly pay books...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-600">
          <h3 className="font-bold text-lg mb-1">Failed to load payrolls</h3>
          <p>{error}</p>
        </div>
      ) : payrolls.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
          <div className="text-gray-400 mb-3 text-4xl">💵</div>
          <h3 className="text-lg font-semibold text-gray-700">No payroll runs for this month</h3>
          <p className="text-gray-500 mt-1 text-sm max-w-md mx-auto">
            Switch months or click "Generate Run" to build salary profiles.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Base Salary
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Allowances
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    EPF (8%)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    APIT Tax
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Net Pay
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {payrolls.map((payroll) => (
                  <tr key={payroll.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">
                      {payroll.employee.user.fullName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      ${payroll.basicSalary.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                      +${payroll.allowances.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500">
                      -${payroll.epfEmployee.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500">
                      -${payroll.apit.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-800">
                      ${payroll.netSalary.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          payroll.paid
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-yellow-50 text-yellow-700 border border-yellow-200"
                        }`}
                      >
                        {payroll.paid ? "Paid" : "Pending Approval"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {!payroll.paid && (
                        <button
                          onClick={() => payroll.id && handlePay(payroll.id)}
                          className="px-3 py-1 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                        >
                          Complete Payment
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800">Generate Salary Run</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {submitError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                  {submitError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Select Employee <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedEmployeeId}
                  onChange={(e) => setSelectedEmployeeId(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.user.fullName} ({emp.designation})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Allowances ($)
                </label>
                <input
                  type="number"
                  value={allowances}
                  onChange={(e) => setAllowances(e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Overtime Pay ($)
                </label>
                <input
                  type="number"
                  value={overtimePay}
                  onChange={(e) => setOvertimePay(e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Other Deductions ($)
                </label>
                <input
                  type="number"
                  value={otherDeductions}
                  onChange={(e) => setOtherDeductions(e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium rounded-lg transition-colors shadow-sm"
                >
                  {submitLoading ? (
                    <>
                      <FiLoader className="animate-spin mr-2" /> Generating…
                    </>
                  ) : (
                    "Generate Profile"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
