import { useState, useEffect, type FormEvent } from "react";
import { FiClock, FiPlus, FiLoader, FiCheckCircle, FiXCircle, FiX } from "react-icons/fi";
import {
  getTodayAttendance,
  checkIn,
  checkOut,
  markAttendance,
  type AttendanceRecord,
} from "../services/attendanceService";
import { getAllEmployees, type Employee } from "../services/employeeService";

export const AttendancePage = () => {
  // Today's Attendance State (Admin View)
  const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Current User's Check-In Session
  const [currentSession, setCurrentSession] = useState<AttendanceRecord | null>(null);
  const [sessionLoading, setSessionLoading] = useState(false);

  // Manual Log Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Form State
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [manualDate, setManualDate] = useState(new Date().toISOString().split("T")[0]);
  const [manualCheckIn, setManualCheckIn] = useState("09:00");
  const [manualCheckOut, setManualCheckOut] = useState("17:00");
  const [manualStatus, setManualStatus] = useState("PRESENT");
  const [manualRemarks, setManualRemarks] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getTodayAttendance();
      setTodayAttendance(res.data);

      // Check if logged in user already checked in today
      const email = localStorage.getItem("email"); // If stored during login
      const myRecord = res.data.find(r => r.employee.user.email === email || r.id !== undefined); // default fallback
      if (myRecord) {
        // If myRecord has checkInTime but no checkOutTime, it is active
        setCurrentSession(myRecord);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load today's attendance logs");
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
      console.error("Failed to load employee list", err);
    }
  };

  useEffect(() => {
    loadData();
    loadEmployees();
  }, []);

  const handleCheckIn = async () => {
    setSessionLoading(true);
    try {
      const res = await checkIn("Checked in via web portal");
      setCurrentSession(res.data);
      await loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to check in");
    } finally {
      setSessionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!currentSession?.id) return;
    setSessionLoading(true);
    try {
      await checkOut(currentSession.id);
      setCurrentSession(null);
      await loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to check out");
    } finally {
      setSessionLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitLoading(true);

    try {
      await markAttendance(
        parseInt(selectedEmployeeId),
        manualDate,
        manualCheckIn + ":00",
        manualCheckOut + ":00",
        manualStatus,
        manualRemarks
      );
      setIsModalOpen(false);
      setManualRemarks("");
      await loadData();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to log attendance");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Time & Attendance</h1>
          <p className="text-gray-600 mt-1">Record check-ins, check-outs, and review timesheets</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors shadow-sm font-medium"
          >
            <FiPlus />
            <span>Mark Manually</span>
          </button>
        </div>
      </div>

      {/* Check In Action Box */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start space-x-4">
            <div className="p-3.5 bg-blue-50 text-blue-600 rounded-2xl">
              <FiClock size={28} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Check In / Check Out</h3>
              <p className="text-gray-500 text-sm mt-0.5">
                {currentSession && !currentSession.checkOutTime
                  ? `You checked in today at ${currentSession.checkInTime}. Don't forget to check out!`
                  : "Start recording your working hours for today."}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {sessionLoading ? (
              <div className="px-6 py-3 flex items-center space-x-2 text-gray-500">
                <FiLoader className="animate-spin" />
                <span>Processing...</span>
              </div>
            ) : currentSession && !currentSession.checkOutTime ? (
              <button
                onClick={handleCheckOut}
                className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors shadow-sm flex items-center space-x-2"
              >
                <FiXCircle />
                <span>Check Out</span>
              </button>
            ) : (
              <button
                onClick={handleCheckIn}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-sm flex items-center space-x-2"
              >
                <FiCheckCircle />
                <span>Check In</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Today's Attendance Logs</h2>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[250px]">
            <FiLoader className="w-8 h-8 text-blue-600 animate-spin mb-2" />
            <p className="text-gray-500 text-sm">Loading daily sheet...</p>
          </div>
        ) : error ? (
          <div className="p-6 text-red-600 text-sm">{error}</div>
        ) : todayAttendance.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-sm">
            No check-in entries logged today yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Check In
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Check Out
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Overtime
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Remarks
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {todayAttendance.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">
                      {record.employee.user.fullName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                      {record.checkInTime || "--:--:--"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                      {record.checkOutTime || "--:--:--"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {record.overtimeMinutes ? `${record.overtimeMinutes} mins` : "0 mins"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          record.status === "PRESENT"
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : record.status === "LATE"
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">
                      {record.remarks || "--"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Manual Mark Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800">Log Manual Entry</h3>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.user.fullName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={manualDate}
                  onChange={(e) => setManualDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Check In Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={manualCheckIn}
                    onChange={(e) => setManualCheckIn(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Check Out Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={manualCheckOut}
                    onChange={(e) => setManualCheckOut(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Attendance Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={manualStatus}
                  onChange={(e) => setManualStatus(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="PRESENT">PRESENT</option>
                  <option value="LATE">LATE</option>
                  <option value="ABSENT">ABSENT</option>
                  <option value="ON_LEAVE">ON_LEAVE</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Remarks / Notes
                </label>
                <input
                  type="text"
                  value={manualRemarks}
                  onChange={(e) => setManualRemarks(e.target.value)}
                  placeholder="On-time arrival"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium rounded-lg transition-colors"
                >
                  {submitLoading ? (
                    <>
                      <FiLoader className="animate-spin mr-2" /> Saving…
                    </>
                  ) : (
                    "Save Log"
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
