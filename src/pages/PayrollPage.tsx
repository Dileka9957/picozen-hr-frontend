import {
  FiDollarSign,
  FiDownload,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";
import { StatsCard } from "../components/common/StatsCard";
import { AiOutlineClockCircle } from "react-icons/ai";

export const PayrollPage = () => {
  const payrollData = [
    {
      id: 1,
      employee: "Sarah Johnson",
      position: "Senior Developer",
      salary: "$8,500",
      bonus: "$1,200",
      deductions: "$850",
      net: "$8,850",
      status: "Processed",
    },
    {
      id: 2,
      employee: "Michael Chen",
      position: "Product Manager",
      salary: "$9,200",
      bonus: "$1,500",
      deductions: "$920",
      net: "$9,780",
      status: "Processed",
    },
    {
      id: 3,
      employee: "Emily Davis",
      position: "UX Designer",
      salary: "$7,800",
      bonus: "$800",
      deductions: "$780",
      net: "$7,820",
      status: "Pending",
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Payroll Management
          </h1>
          <p className="text-gray-600 mt-1">
            Track and manage employee compensation
          </p>
        </div>
        <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <FiDownload />
          <span>Export Report</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatsCard
          title="Total Payroll"
          value="$2.4M"
          change="+8%"
          icon={FiDollarSign}
          color="bg-green-500"
        />
        <StatsCard
          title="Employees Paid"
          value="1,234"
          change="+2%"
          icon={FiUsers}
          color="bg-blue-500"
        />
        <StatsCard
          title="Avg Salary"
          value="$6,500"
          change="+3%"
          icon={FiTrendingUp}
          color="bg-purple-500"
        />
        <StatsCard
          title="Pending Payments"
          value="3"
          change="-1%"
          icon={AiOutlineClockCircle}
          color="bg-yellow-500"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            Current Month Payroll
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Base Salary
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Bonus
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Deductions
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Net Pay
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {payrollData.map((payroll) => (
                <tr
                  key={payroll.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {payroll.employee}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {payroll.position}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {payroll.salary}
                  </td>
                  <td className="px-6 py-4 text-sm text-green-600">
                    {payroll.bonus}
                  </td>
                  <td className="px-6 py-4 text-sm text-red-600">
                    {payroll.deductions}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                    {payroll.net}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        payroll.status === "Processed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {payroll.status}
                    </span>
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
