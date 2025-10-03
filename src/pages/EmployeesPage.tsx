import { FiEdit, FiMail, FiPhone, FiPlus, FiTrash2 } from "react-icons/fi";

export const EmployeesPage = () => {
  const employees = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Senior Developer",
      department: "Engineering",
      email: "sarah.j@company.com",
      phone: "+1 234-567-8901",
      status: "Active",
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Product Manager",
      department: "Product",
      email: "michael.c@company.com",
      phone: "+1 234-567-8902",
      status: "Active",
    },
    {
      id: 3,
      name: "Emily Davis",
      role: "UX Designer",
      department: "Design",
      email: "emily.d@company.com",
      phone: "+1 234-567-8903",
      status: "Active",
    },
    {
      id: 4,
      name: "James Wilson",
      role: "Data Analyst",
      department: "Analytics",
      email: "james.w@company.com",
      phone: "+1 234-567-8904",
      status: "Onboarding",
    },
    {
      id: 5,
      name: "Lisa Anderson",
      role: "HR Specialist",
      department: "HR",
      email: "lisa.a@company.com",
      phone: "+1 234-567-8905",
      status: "Active",
    },
    {
      id: 6,
      name: "Robert Martinez",
      role: "Marketing Manager",
      department: "Marketing",
      email: "robert.m@company.com",
      phone: "+1 234-567-8906",
      status: "Active",
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Employees</h1>
          <p className="text-gray-600 mt-1">Manage your workforce</p>
        </div>
        <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <FiPlus />
          <span>Add Employee</span>
        </button>
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
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Contact
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
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                        {emp.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{emp.name}</p>
                        <p className="text-xs text-gray-500">{emp.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {emp.role}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {emp.department}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <button className="text-blue-600 hover:text-blue-800">
                        <FiMail />
                      </button>
                      <button className="text-blue-600 hover:text-blue-800">
                        <FiPhone />
                      </button>
                    </div>
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
