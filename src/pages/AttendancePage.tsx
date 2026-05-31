import { useState, useEffect, type FormEvent } from "react";
import { FiClock, FiPlus, FiLoader, FiCheckCircle, FiXCircle, FiX, FiFilter, FiRefreshCw, FiCalendar, FiUser } from "react-icons/fi";
import {
  getTodayAttendance,
  checkIn,
  checkOut,
  markAttendance,
  getEmployeeAttendance,
  getEmployeeAttendanceRange,
  type AttendanceRecord,
} from "../services/attendanceService";
import { getAllEmployees, type Employee } from "../services/employeeService";

export const AttendancePage = () => {
  // Today's Attendance State (Admin View)
  const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active User's Session
  const [currentSession, setCurrentSession] = useState<AttendanceRecord | null>(null);
  const [sessionLoading, setSessionLoading] = useState(false);

  // View Toggle: "today" or "history"
  const [activeViewTab, setActiveViewTab] = useState<"today" | "history">("today");

  // History Tracking State
  const [historyRecords, setHistoryRecords] = useState<AttendanceRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyEmployeeId, setHistoryEmployeeId] = useState<string>("");
  const [historyStartDate, setHistoryStartDate] = useState("");
  const [historyEndDate, setHistoryEndDate] = useState("");

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

      const email = localStorage.getItem("email");
      const myRecord = res.data.find(r => r.employee.user.email === email || r.id !== undefined);
      if (myRecord) {
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
        setHistoryEmployeeId(res.data[0].id?.toString() || "");
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

  const handleApplyHistoryFilter = async (e: FormEvent) => {
    e.preventDefault();
    if (!historyEmployeeId) return;

    try {
      setHistoryLoading(true);
      if (historyStartDate && historyEndDate) {
        const res = await getEmployeeAttendanceRange(parseInt(historyEmployeeId), historyStartDate, historyEndDate);
        setHistoryRecords(res.data);
      } else {
        const res = await getEmployeeAttendance(parseInt(historyEmployeeId));
        setHistoryRecords(res.data);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to fetch attendance history");
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleClearHistoryFilter = () => {
    if (employees.length > 0) {
      setHistoryEmployeeId(employees[0].id?.toString() || "");
    }
    setHistoryStartDate("");
    setHistoryEndDate("");
    setHistoryRecords([]);
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
            className="flex items-center space-x-2 border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors shadow-sm font-medium text-sm"
          >
            <FiPlus />
            <span>Mark Manually</span>
          </button>
        </div>
      </div>

      {/* Clock Box */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start space-x-4">
            <div className="p-3.5 bg-blue-50 text-blue-600 rounded-2xl">
              <FiClock size={28} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Clock Operations</h3>
              <p className="text-gray-500 text-sm mt-0.5">
                {currentSession && !currentSession.checkOutTime
                  ? `You checked in today at ${currentSession.checkInTime}.`
                  : "Start recording your working hours for today."}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {sessionLoading ? (
              <div className="px-6 py-3 flex items-center space-x-2 text-gray-500 text-sm">
                <FiLoader className="animate-spin" />
                <span>Processing...</span>
              </div>
            ) : currentSession && !currentSession.checkOutTime ? (
              <button
                onClick={handleCheckOut}
                className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors shadow-sm flex items-center space-x-2 text-sm"
              >
                <FiXCircle />
                <span>Check Out</span>
              </button>
            ) : (
              <button
                onClick={handleCheckIn}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-sm flex items-center space-x-2 text-sm"
              >
                <FiCheckCircle />
                <span>Check In</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation View Tabs */}
      <div className="flex border-b border-gray-100 mb-6 bg-white rounded-t-xl">
        <button
          onClick={() => setActiveViewTab("today")}
          className={`py-3 px-6 text-sm font-semibold border-b-2 transition-colors flex items-center space-x-2 ${
            activeViewTab === "today"
              ? "border-blue-500 text-blue-600 bg-blue-50/10"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <FiCalendar size={16} />
          <span>Today's Log</span>
        </button>
        <button
          onClick={() => setActiveViewTab("history")}
          className={`py-3 px-6 text-sm font-semibold border-b-2 transition-colors flex items-center space-x-2 ${
            activeViewTab === "history"
              ? "border-blue-500 text-blue-600 bg-blue-50/10"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <FiUser size={16} />
          <span>Employee History Lookup</span>
        </button>
      </div>

      {activeViewTab === "today" ? (
        <div className="bg-white rounded-b-xl border-x border-b border-gray-100 shadow-sm overflow-hidden">
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
      ) : (
        <div className="space-y-6">
          {/* History Search filter bar */}
          <form onSubmit={handleApplyHistoryFilter} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex flex-wrap items-end gap-4">
            <div className="min-w-[150px] flex-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Select Employee</label>
              <select
                value={historyEmployeeId}
                onChange={(e) => setHistoryEmployeeId(e.target.value)}
                required
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white"
              >
                <option value="">-- Choose Member --</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>{emp.user.fullName}</option>
                ))}
              </select>
            </div>

            <div className="min-w-[150px] flex-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Start Date</label>
              <input
                type="date"
                value={historyStartDate}
                onChange={(e) => setHistoryStartDate(e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
              />
            </div>

            <div className="min-w-[150px] flex-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">End Date</label>
              <input
                type="date"
                value={historyEndDate}
                onChange={(e) => setHistoryEndDate(e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
              />
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <button
                type="submit"
                disabled={historyLoading}
                className="flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 bg-gray-800 text-white hover:bg-gray-900 px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
              >
                {historyLoading ? <FiLoader className="animate-spin" /> : <FiFilter />}
                <span>Fetch History</span>
              </button>
              <button
                type="button"
                onClick={handleClearHistoryFilter}
                className="flex items-center justify-center space-x-1 border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-lg text-sm font-medium transition"
              >
                <FiRefreshCw size={14} />
                <span>Clear</span>
              </button>
            </div>
          </form>

          {/* History Search Roster */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {historyLoading ? (
              <div className="flex flex-col items-center justify-center min-h-[250px]">
                <FiLoader className="w-8 h-8 text-blue-600 animate-spin mb-2" />
                <p className="text-gray-500 text-sm">Searching historical logs...</p>
              </div>
            ) : historyRecords.length === 0 ? (
              <div className="p-12 text-center text-gray-400 text-sm">
                No history records loaded. Select an employee and click "Fetch History" to display logs.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Date
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
                    {historyRecords.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800 font-mono">
                          {record.date}
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
        </div>
      )}

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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium rounded-lg transition-colors text-sm"
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
