import { useState, useEffect, type FormEvent } from "react";
import { FiEdit, FiMail, FiPhone, FiPlus, FiTrash2, FiLoader, FiX, FiInfo, FiCreditCard } from "react-icons/fi";
import {
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  type Employee,
} from "../services/employeeService";

export const EmployeesPage = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [designation, setDesignation] = useState("");
  const [basicSalary, setBasicSalary] = useState("");

  // Optional/Advanced Form Fields
  const [address, setAddress] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("MALE");
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [epfNumber, setEpfNumber] = useState("");
  const [etfNumber, setEtfNumber] = useState("");

  // Tabs within the form for cleaner UI
  const [activeFormTab, setActiveFormTab] = useState<"basic" | "additional">("basic");

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAllEmployees();
      setEmployees(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      await deleteEmployee(id);
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete employee");
    }
  };

  const resetForm = () => {
    setFullName("");
    setEmail("");
    setPassword("");
    setPhoneNumber("");
    setEmployeeId("");
    setDesignation("");
    setBasicSalary("");
    setAddress("");
    setDateOfBirth("");
    setGender("MALE");
    setEmergencyContactName("");
    setEmergencyContact("");
    setBankName("");
    setBankAccountNumber("");
    setEpfNumber("");
    setEtfNumber("");
    setSubmitError(null);
    setActiveFormTab("basic");
  };

  const handleAddClick = () => {
    setEditingEmployee(null);
    resetForm();
    setIsModalOpen(true);
  };

  const handleEditClick = (emp: Employee) => {
    setEditingEmployee(emp);
    setFullName(emp.user.fullName);
    setPhoneNumber(emp.user.phoneNumber || "");
    setEmployeeId(emp.employeeId);
    setDesignation(emp.designation);
    setBasicSalary(emp.basicSalary ? emp.basicSalary.toString() : "");
    setAddress(emp.address || "");
    setDateOfBirth(emp.dateOfBirth || "");
    setGender(emp.gender || "MALE");
    setEmergencyContactName(emp.emergencyContactName || "");
    setEmergencyContact(emp.emergencyContact || "");
    setBankName(emp.bankName || "");
    setBankAccountNumber(emp.bankAccountNumber || "");
    setEpfNumber(emp.epfNumber || "");
    setEtfNumber(emp.etfNumber || "");
    setSubmitError(null);
    setActiveFormTab("basic");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitLoading(true);

    const payload: Employee = {
      employeeId,
      designation,
      basicSalary: basicSalary ? parseFloat(basicSalary) : undefined,
      address: address || undefined,
      dateOfBirth: dateOfBirth || undefined,
      gender: gender || undefined,
      emergencyContactName: emergencyContactName || undefined,
      emergencyContact: emergencyContact || undefined,
      bankName: bankName || undefined,
      bankAccountNumber: bankAccountNumber || undefined,
      epfNumber: epfNumber || undefined,
      etfNumber: etfNumber || undefined,
      user: {
        fullName,
        phoneNumber: phoneNumber || undefined,
      },
    };

    try {
      if (editingEmployee && editingEmployee.id) {
        await updateEmployee(editingEmployee.id, payload);
      } else {
        await createEmployee(payload, email, password);
      }
      setIsModalOpen(false);
      resetForm();
      await loadEmployees();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to save employee");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Employees</h1>
          <p className="text-gray-600 mt-1">Manage your workforce catalog and profiles</p>
        </div>
        <button
          onClick={handleAddClick}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <FiPlus />
          <span>Add Employee</span>
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <FiLoader className="w-8 h-8 text-blue-600 animate-spin mb-2" />
          <p className="text-gray-500 text-sm">Fetching team directory...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-600">
          <h3 className="font-bold text-lg mb-1">Failed to load workforce</h3>
          <p>{error}</p>
        </div>
      ) : employees.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
          <div className="text-gray-400 mb-3 text-4xl">👥</div>
          <h3 className="text-lg font-semibold text-gray-700">No employees yet</h3>
          <p className="text-gray-500 mt-1 text-sm max-w-md mx-auto">
            Get started by adding your first employee to the database catalog.
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
                    Employee ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Designation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Basic Salary
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold mr-3 shadow-sm">
                          {emp.user.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join("")
                            .toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{emp.user.fullName}</p>
                          <div className="flex flex-col space-y-0.5">
                            {emp.user.email && (
                              <span className="inline-flex items-center text-xs text-gray-400">
                                <FiMail className="mr-1" size={10} />
                                {emp.user.email}
                              </span>
                            )}
                            {emp.user.phoneNumber && (
                              <span className="inline-flex items-center text-xs text-gray-400">
                                <FiPhone className="mr-1" size={10} />
                                {emp.user.phoneNumber}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                      {emp.employeeId}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {emp.designation}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {emp.basicSalary ? `$${emp.basicSalary.toLocaleString()}` : "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          emp.active
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {emp.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditClick(emp)}
                          className="text-blue-500 hover:text-blue-700 p-1.5 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Employee"
                        >
                          <FiEdit />
                        </button>
                        <button
                          onClick={() => emp.id && handleDelete(emp.id)}
                          className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Employee"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
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
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800">
                {editingEmployee ? "Edit Employee Details" : "Add New Employee"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Form tab headers */}
            <div className="flex border-b border-gray-100 px-6 bg-gray-50/50">
              <button
                type="button"
                onClick={() => setActiveFormTab("basic")}
                className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors flex items-center space-x-2 ${
                  activeFormTab === "basic"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <FiInfo size={16} />
                <span>Basic Info</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveFormTab("additional")}
                className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors flex items-center space-x-2 ${
                  activeFormTab === "additional"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <FiCreditCard size={16} />
                <span>Personal & Bank (Optional)</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              {submitError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                  {submitError}
                </div>
              )}

              {activeFormTab === "basic" ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      placeholder="Jane Smith"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
                    />
                  </div>

                  {!editingEmployee && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          placeholder="jane@company.com"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Password <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          placeholder="••••••••"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Employee ID <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={employeeId}
                        onChange={(e) => setEmployeeId(e.target.value)}
                        required
                        disabled={!!editingEmployee}
                        placeholder="EMP001"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm disabled:bg-gray-50 disabled:text-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+94771234568"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Designation <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        required
                        placeholder="Software Engineer"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Basic Salary
                      </label>
                      <input
                        type="number"
                        value={basicSalary}
                        onChange={(e) => setBasicSalary(e.target.value)}
                        placeholder="150000"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Gender
                      </label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
                      >
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Residential Address
                    </label>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="123 Main St, Colombo"
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Emergency Contact Name
                      </label>
                      <input
                        type="text"
                        value={emergencyContactName}
                        onChange={(e) => setEmergencyContactName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Emergency Phone Number
                      </label>
                      <input
                        type="tel"
                        value={emergencyContact}
                        onChange={(e) => setEmergencyContact(e.target.value)}
                        placeholder="+94771234569"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
                      />
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-4">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Bank & Payroll Statutory info</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Bank Name
                        </label>
                        <input
                          type="text"
                          value={bankName}
                          onChange={(e) => setBankName(e.target.value)}
                          placeholder="Bank of Ceylon"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Bank Account Number
                        </label>
                        <input
                          type="text"
                          value={bankAccountNumber}
                          onChange={(e) => setBankAccountNumber(e.target.value)}
                          placeholder="123456789"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        EPF Number
                      </label>
                      <input
                        type="text"
                        value={epfNumber}
                        onChange={(e) => setEpfNumber(e.target.value)}
                        placeholder="EPF001"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        ETF Number
                      </label>
                      <input
                        type="text"
                        value={etfNumber}
                        onChange={(e) => setEtfNumber(e.target.value)}
                        placeholder="ETF001"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium rounded-lg transition-colors shadow-sm text-sm"
                >
                  {submitLoading ? (
                    <>
                      <FiLoader className="animate-spin mr-2" /> Saving…
                    </>
                  ) : (
                    "Save Employee"
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
