import {
  FiDownload,
  FiEdit,
  FiFileText,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";
import { StatsCard } from "../components/common/StatsCard";

export const DocumentsPage = () => {
  const documents = [
    {
      id: 1,
      name: "Employee Handbook 2024",
      type: "Policy",
      size: "2.5 MB",
      uploadedBy: "HR Admin",
      date: "2024-01-15",
      category: "Company Policies",
    },
    {
      id: 2,
      name: "Benefits Guide",
      type: "Guide",
      size: "1.8 MB",
      uploadedBy: "HR Manager",
      date: "2024-02-20",
      category: "Benefits",
    },
    {
      id: 3,
      name: "Code of Conduct",
      type: "Policy",
      size: "980 KB",
      uploadedBy: "HR Admin",
      date: "2024-01-10",
      category: "Company Policies",
    },
    {
      id: 4,
      name: "Remote Work Policy",
      type: "Policy",
      size: "750 KB",
      uploadedBy: "HR Manager",
      date: "2024-03-05",
      category: "Work Policies",
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Documents</h1>
          <p className="text-gray-600 mt-1">
            Manage company documents and policies
          </p>
        </div>
        <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <FiPlus />
          <span>Upload Document</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatsCard
          title="Total Documents"
          value="156"
          change="+8"
          icon={FiFileText}
          color="bg-blue-500"
        />
        <StatsCard
          title="Policies"
          value="45"
          change="+3"
          icon={FiFileText}
          color="bg-green-500"
        />
        <StatsCard
          title="Templates"
          value="32"
          change="+5"
          icon={FiFileText}
          color="bg-purple-500"
        />
        <StatsCard
          title="Recent Uploads"
          value="12"
          change="+12"
          icon={FiFileText}
          color="bg-yellow-500"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Recent Documents</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Document Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Uploaded By
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <FiFileText className="text-blue-500 mr-3 text-xl" />
                      <span className="font-medium text-gray-800">
                        {doc.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {doc.category}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {doc.type}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {doc.size}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {doc.uploadedBy}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {doc.date}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <FiDownload />
                      </button>
                      <button className="text-green-600 hover:text-green-800">
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
