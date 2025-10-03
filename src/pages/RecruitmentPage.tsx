import {
  FiBriefcase,
  FiCalendar,
  FiEdit,
  FiPlus,
  FiTrash2,
  FiUsers,
} from "react-icons/fi";
import { StatsCard } from "../components/common/StatsCard";
import { AiOutlineCheckCircle } from "react-icons/ai";

export const RecruitmentPage = () => {
  const jobPostings = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      applicants: 45,
      status: "Active",
    },
    {
      id: 2,
      title: "Product Designer",
      department: "Design",
      location: "New York",
      type: "Full-time",
      applicants: 32,
      status: "Active",
    },
    {
      id: 3,
      title: "Data Scientist",
      department: "Analytics",
      location: "San Francisco",
      type: "Full-time",
      applicants: 28,
      status: "Active",
    },
    {
      id: 4,
      title: "Marketing Specialist",
      department: "Marketing",
      location: "Remote",
      type: "Part-time",
      applicants: 19,
      status: "Closed",
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Recruitment</h1>
          <p className="text-gray-600 mt-1">
            Manage job postings and candidates
          </p>
        </div>
        <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <FiPlus />
          <span>Post New Job</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatsCard
          title="Active Jobs"
          value="23"
          change="+5%"
          icon={FiBriefcase}
          color="bg-blue-500"
        />
        <StatsCard
          title="Total Applicants"
          value="124"
          change="+15%"
          icon={FiUsers}
          color="bg-green-500"
        />
        <StatsCard
          title="Interviews Scheduled"
          value="8"
          change="+2%"
          icon={FiCalendar}
          color="bg-purple-500"
        />
        <StatsCard
          title="Offers Extended"
          value="3"
          change="+1%"
          icon={AiOutlineCheckCircle}
          color="bg-yellow-500"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            Active Job Postings
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Job Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Applicants
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
              {jobPostings.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {job.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {job.department}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {job.location}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {job.type}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {job.applicants}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        job.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <FiEdit />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
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
    </div>
  );
};
