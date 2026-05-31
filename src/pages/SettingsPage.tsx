import { useState, useEffect } from "react";
import { FiDownload, FiFileText, FiTrash2, FiAward, FiCheck, FiInfo, FiLoader } from "react-icons/fi";
import { getMySubscription, type Subscription } from "../services/subscriptionService";
import { useAuth } from "../hooks/useAuth";

export const SettingsPage = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loadingSub, setLoadingSub] = useState(true);

  useEffect(() => {
    const fetchSub = async () => {
      try {
        setLoadingSub(true);
        const res = await getMySubscription();
        setSubscription(res.data);
      } catch (err) {
        console.error("Failed to load subscription details", err);
      } finally {
        setLoadingSub(false);
      }
    };
    fetchSub();
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your HR system preferences and check subscriptions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Subscription & Billing Info Panel */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <FiAward className="text-yellow-500 mr-2" />
              <span>Subscription & Billing</span>
            </h3>

            {loadingSub ? (
              <div className="flex items-center justify-center p-6">
                <FiLoader className="w-5 h-5 text-blue-600 animate-spin mr-2" />
                <span className="text-xs text-gray-400">Loading plan metadata...</span>
              </div>
            ) : subscription ? (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-blue-500 uppercase tracking-wider">Active Plan</p>
                    <h4 className="text-xl font-bold text-gray-800 mt-0.5">{subscription.plan.name}</h4>
                  </div>
                  <span className="px-3 py-1 bg-blue-600 text-white font-bold text-xs rounded-full uppercase tracking-wider">
                    {subscription.plan.planType}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                  <div className="bg-gray-50 p-2.5 rounded border border-gray-100">
                    <p className="font-semibold text-gray-500 uppercase tracking-wider text-[9px]">Capacity</p>
                    <p className="font-bold text-gray-700 text-sm mt-0.5">{subscription.plan.maxEmployees} Employees</p>
                  </div>
                  <div className="bg-gray-50 p-2.5 rounded border border-gray-100">
                    <p className="font-semibold text-gray-500 uppercase tracking-wider text-[9px]">Plan Period</p>
                    <p className="font-bold text-gray-700 text-sm mt-0.5">{subscription.plan.durationInDays} Days</p>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-3">
                  <h5 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Licensed Modules</h5>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    {subscription.plan.attendanceModule && <span className="flex items-center text-green-700"><FiCheck size={12} className="mr-1" /> Attendance</span>}
                    {subscription.plan.leaveModule && <span className="flex items-center text-green-700"><FiCheck size={12} className="mr-1" /> Leave Request</span>}
                    {subscription.plan.payrollModule && <span className="flex items-center text-green-700"><FiCheck size={12} className="mr-1" /> Payroll Systems</span>}
                    {subscription.plan.locationTrackerModule && <span className="flex items-center text-green-700"><FiCheck size={12} className="mr-1" /> Dispatch Trails</span>}
                    {subscription.plan.recruitmentModule && <span className="flex items-center text-green-700"><FiCheck size={12} className="mr-1" /> Hiring Pipeline</span>}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-yellow-50 text-yellow-700 border border-yellow-100 rounded-lg text-xs flex items-center">
                <FiInfo className="mr-2" size={16} />
                No active billing record identified for your business profile.
              </div>
            )}
          </div>
        </div>

        {/* Company Info Panel */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Company Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name
              </label>
              <input
                type="text"
                defaultValue={user?.companyName || "Picozen Tech"}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Email
              </label>
              <input
                type="email"
                defaultValue={user?.email || "info@picozen.com"}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                defaultValue="+94 77-123-4567"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
              Save Changes
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            System Preferences
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <p className="font-medium text-gray-800 text-sm">Email Notifications</p>
                <p className="text-xs text-gray-500">Receive email updates</p>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition" />
              </button>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <p className="font-medium text-gray-800 text-sm">Leave Auto-Approval</p>
                <p className="text-xs text-gray-500">Automatically approve leave requests</p>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300">
                <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition animate-pulse" />
              </button>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-gray-800 text-sm">Performance Reminders</p>
                <p className="text-xs text-gray-500">Send review reminders</p>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition" />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Data Management
          </h3>
          <div className="space-y-4">
            <button className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
              <FiDownload />
              <span>Export All Data</span>
            </button>
            <button className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
              <FiFileText />
              <span>Generate Report</span>
            </button>
            <button className="w-full flex items-center justify-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
              <FiTrash2 />
              <span>Clear Cache</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
