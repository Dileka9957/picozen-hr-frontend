import { AiOutlineCheckCircle, AiOutlineClockCircle } from "react-icons/ai";

export const LeavePage = () => {
  const leaveRequests = [
    {
      id: 1,
      employee: "Alice Brown",
      type: "Annual Leave",
      days: 5,
      from: "2024-10-10",
      to: "2024-10-14",
      status: "Pending",
    },
    {
      id: 2,
      employee: "Robert Martinez",
      type: "Sick Leave",
      days: 2,
      from: "2024-10-05",
      to: "2024-10-06",
      status: "Approved",
    },
    {
      id: 3,
      employee: "Lisa Anderson",
      type: "Personal Leave",
      days: 3,
      from: "2024-10-15",
      to: "2024-10-17",
      status: "Pending",
    },
    {
      id: 4,
      employee: "John Smith",
      type: "Annual Leave",
      days: 7,
      from: "2024-10-20",
      to: "2024-10-26",
      status: "Rejected",
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Leave Management</h1>
          <p className="text-gray-600 mt-1">Review and manage leave requests</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Leave Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  From
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  To
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {leaveRequests.map((request) => (
                <tr
                  key={request.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {request.employee}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {request.type}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {request.days} days
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {request.from}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {request.to}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        request.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : request.status === "Approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {request.status === "Pending" && (
                        <AiOutlineClockCircle className="mr-1" />
                      )}
                      {request.status === "Approved" && (
                        <AiOutlineCheckCircle className="mr-1" />
                      )}
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {request.status === "Pending" && (
                      <div className="flex space-x-2">
                        <button className="px-3 py-1 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600 transition-colors">
                          Approve
                        </button>
                        <button className="px-3 py-1 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 transition-colors">
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
