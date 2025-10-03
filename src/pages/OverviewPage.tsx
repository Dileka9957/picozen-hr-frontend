import {
  FiBriefcase,
  FiCalendar,
  FiClock,
  FiDollarSign,
  FiUsers,
} from "react-icons/fi";
import { StatsCard } from "../components/common/StatsCard";

export const OverviewPage = () => {
  const stats = [
    {
      title: "Total Employees",
      value: "1,234",
      change: "+12%",
      icon: FiUsers,
      color: "bg-blue-500",
    },
    {
      title: "Active Recruitments",
      value: "23",
      change: "+5%",
      icon: FiBriefcase,
      color: "bg-green-500",
    },
    {
      title: "Pending Leave Requests",
      value: "18",
      change: "-3%",
      icon: FiCalendar,
      color: "bg-yellow-500",
    },
    {
      title: "Monthly Payroll",
      value: "$2.4M",
      change: "+8%",
      icon: FiDollarSign,
      color: "bg-purple-500",
    },
  ];

  const recentEmployees = [
    {
      name: "Sarah Johnson",
      role: "Senior Developer",
      department: "Engineering",
      status: "Active",
      joined: "2024-09-15",
    },
    {
      name: "Michael Chen",
      role: "Product Manager",
      department: "Product",
      status: "Active",
      joined: "2024-09-20",
    },
    {
      name: "Emily Davis",
      role: "UX Designer",
      department: "Design",
      status: "Active",
      joined: "2024-09-25",
    },
    {
      name: "James Wilson",
      role: "Data Analyst",
      department: "Analytics",
      status: "Onboarding",
      joined: "2024-10-01",
    },
  ];

  const upcomingEvents = [
    { title: "Team Building Event", date: "2024-10-12", type: "Company Event" },
    {
      title: "Performance Review Period",
      date: "2024-10-20",
      type: "HR Process",
    },
    { title: "New Hire Orientation", date: "2024-10-08", type: "Training" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, idx) => (
          <StatsCard key={idx} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">
              Recent Employees
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentEmployees.map((emp, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                          {emp.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <span className="font-medium text-gray-800">
                          {emp.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {emp.role}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {emp.department}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          emp.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {emp.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Upcoming Events</h2>
          </div>
          <div className="p-6 space-y-4">
            {upcomingEvents.map((event, idx) => (
              <div
                key={idx}
                className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="bg-blue-100 p-2 rounded-lg">
                  <FiCalendar className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{event.title}</h4>
                  <p className="text-sm text-gray-500 mt-1">{event.type}</p>
                  <p className="text-xs text-gray-400 mt-1 flex items-center">
                    <FiClock className="mr-1" /> {event.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
