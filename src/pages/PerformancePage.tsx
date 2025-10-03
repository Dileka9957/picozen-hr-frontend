import { FiAward, FiCalendar, FiPlus, FiTrendingUp } from "react-icons/fi";
import { StatsCard } from "../components/common/StatsCard";
import { AiOutlineCheckCircle } from "react-icons/ai";

export const PerformancePage = () => {
  const performanceData = [
    {
      id: 1,
      employee: "Sarah Johnson",
      department: "Engineering",
      lastReview: "2024-08-15",
      rating: 4.8,
      nextReview: "2025-02-15",
      status: "Excellent",
    },
    {
      id: 2,
      employee: "Michael Chen",
      department: "Product",
      lastReview: "2024-07-20",
      rating: 4.5,
      nextReview: "2025-01-20",
      status: "Very Good",
    },
    {
      id: 3,
      employee: "Emily Davis",
      department: "Design",
      lastReview: "2024-09-01",
      rating: 4.7,
      nextReview: "2025-03-01",
      status: "Excellent",
    },
    {
      id: 4,
      employee: "James Wilson",
      department: "Analytics",
      lastReview: "2024-06-10",
      rating: 4.2,
      nextReview: "2024-12-10",
      status: "Good",
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Performance Management
          </h1>
          <p className="text-gray-600 mt-1">
            Track and review employee performance
          </p>
        </div>
        <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <FiPlus />
          <span>Schedule Review</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatsCard
          title="Avg Rating"
          value="4.6"
          change="+0.3"
          icon={FiAward}
          color="bg-yellow-500"
        />
        <StatsCard
          title="Reviews Completed"
          value="156"
          change="+12"
          icon={AiOutlineCheckCircle}
          color="bg-green-500"
        />
        <StatsCard
          title="Upcoming Reviews"
          value="8"
          change="+2"
          icon={FiCalendar}
          color="bg-blue-500"
        />
        <StatsCard
          title="High Performers"
          value="45"
          change="+5%"
          icon={FiTrendingUp}
          color="bg-purple-500"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            Employee Performance Reviews
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
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Last Review
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Next Review
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
              {performanceData.map((perf) => (
                <tr
                  key={perf.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {perf.employee}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {perf.department}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {perf.lastReview}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <FiAward className="text-yellow-500 mr-2" />
                      <span className="font-semibold text-gray-800">
                        {perf.rating}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {perf.nextReview}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        perf.rating >= 4.5
                          ? "bg-green-100 text-green-800"
                          : perf.rating >= 4.0
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {perf.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View Details
                    </button>
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
