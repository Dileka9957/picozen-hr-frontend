import { useState, useEffect } from "react";
import { AiOutlineCheckCircle, AiOutlineClockCircle, AiOutlineCloseCircle } from "react-icons/ai";
import { FiLoader, FiCheck, FiX } from "react-icons/fi";
import {
  getPendingLeaves,
  approveLeave,
  rejectLeave,
  type LeaveRequest,
} from "../services/leaveService";

export const LeavePage = () => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Leave Management</h1>
          <p className="text-gray-600 mt-1">Review and manage leave requests</p>
        </div>
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
                      Pending Request
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
    </div>
  );
};
