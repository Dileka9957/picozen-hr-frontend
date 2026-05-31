import { useState, useEffect, type FormEvent } from "react";
import { AiOutlineClockCircle } from "react-icons/ai";
import { FiLoader, FiCheck, FiX, FiPlus, FiSend } from "react-icons/fi";
import {
  getPendingLeaves,
  approveLeave,
  rejectLeave,
  applyLeave,
  type LeaveRequest,
} from "../services/leaveService";

export const LeavePage = () => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Apply Leave Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Form State
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [numberOfDays, setNumberOfDays] = useState("1");
  const [reason, setReason] = useState("");
  const [leaveType, setLeaveType] = useState("Annual Leave");

  const loadLeaves = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getPendingLeaves();
      setLeaveRequests(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load leave requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  const handleApprove = async (id: number) => {
    const remarks = window.prompt("Enter approval remarks (optional):", "Approved");
    if (remarks === null) return; // cancelled

    try {
      await approveLeave(id, remarks);
      // Remove from pending list
      setLeaveRequests((prev) => prev.filter((req) => req.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to approve leave request");
    }
  };

  const handleReject = async (id: number) => {
    const remarks = window.prompt("Enter rejection remarks (required):", "");
    if (remarks === null) return; // cancelled
    if (remarks.trim() === "") {
      alert("Remarks are required to reject leave");
      return;
    }

    try {
      await rejectLeave(id, remarks);
      // Remove from pending list
      setLeaveRequests((prev) => prev.filter((req) => req.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to reject leave request");
    }
  };

  const handleOpenModal = () => {
    setStartDate("");
    setEndDate("");
    setNumberOfDays("1");
    setReason("");
    setLeaveType("Annual Leave");
    setSubmitError(null);
    setIsModalOpen(true);
  };

  const handleSubmitLeave = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitLoading(true);

    const payload: Partial<LeaveRequest> = {
      startDate,
      endDate,
      numberOfDays: parseInt(numberOfDays) || 1,
      reason,
      status: "PENDING",
      // Leave type is mapped inside reason/metadata or comments since Leave entity has simple parameters
    };

    try {
      await applyLeave(payload);
      setIsModalOpen(false);
      alert("Leave request submitted successfully!");
      await loadLeaves();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to submit leave request");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Leave Management</h1>
          <p className="text-gray-600 mt-1">Review, apply, and manage leave requests</p>
        </div>
        <button
          onClick={handleOpenModal}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <FiPlus />
          <span>Apply for Leave</span>
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <FiLoader className="w-8 h-8 text-blue-600 animate-spin mb-2" />
          <p className="text-gray-500 text-sm">Loading leave applications...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-600">
          <h3 className="font-bold text-lg mb-1">Failed to load leave requests</h3>
          <p>{error}</p>
        </div>
      ) : leaveRequests.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
          <div className="text-green-500 mb-3 text-4xl">🎉</div>
          <h3 className="text-lg font-semibold text-gray-700">All caught up!</h3>
          <p className="text-gray-500 mt-1 text-sm max-w-md mx-auto">
            There are no pending leave applications requiring approval at this time.
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
                    Leave Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    From
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Reason
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
                {leaveRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-800 whitespace-nowrap">
                      {request.employee.user.fullName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                      Leave Request
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                      {request.numberOfDays} days
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap font-mono">
                      {request.startDate}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap font-mono">
                      {request.endDate}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {request.reason || "No reason specified"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
                        <AiOutlineClockCircle className="mr-1" />
                        Pending
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => request.id && handleApprove(request.id)}
                          className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                        >
                          <FiCheck size={12} />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => request.id && handleReject(request.id)}
                          className="flex items-center space-x-1 px-3 py-1 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                        >
                          <FiX size={12} />
                          <span>Reject</span>
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

      {/* Apply Leave Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800">Apply for Leave</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitLeave} className="p-6 space-y-4">
              {submitError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                  {submitError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Leave Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
                >
                  <option value="Annual Leave">Annual Leave</option>
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Unpaid Leave">Unpaid Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Number of Days <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={numberOfDays}
                  onChange={(e) => setNumberOfDays(e.target.value)}
                  required
                  placeholder="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Reason for Leave <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                  placeholder="Family vacation / medical checkup..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
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
                  {submitLoading ? "Submitting..." : "Apply"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
