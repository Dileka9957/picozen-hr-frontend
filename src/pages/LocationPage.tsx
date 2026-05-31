import { useState, useEffect, type FormEvent } from "react";
import { FiMapPin, FiLoader, FiPlus, FiTrash2, FiX, FiCompass, FiFilter, FiRefreshCw } from "react-icons/fi";
import {
  getAllLocations,
  trackLocation,
  deleteLocation,
  getLocationsByEmployee,
  getLocationsByEmployeeAndRange,
  type LocationRecord,
} from "../services/locationService";
import { getAllEmployees, type Employee } from "../services/employeeService";

export const LocationPage = () => {
  const [locations, setLocations] = useState<LocationRecord[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simulation Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Simulation Form State
  const [simSelectedEmployeeId, setSimSelectedEmployeeId] = useState("");
  const [latitude, setLatitude] = useState("6.9271"); // Colombo default
  const [longitude, setLongitude] = useState("79.8612");
  const [address, setAddress] = useState("Picozen Headquarters, Colombo");
  const [activityType, setActivityType] = useState("FIELD_VISIT");

  // Filtering State
  const [filterEmployeeId, setFilterEmployeeId] = useState<string>("ALL");
  const [filterStartTime, setFilterStartTime] = useState("");
  const [filterEndTime, setFilterEndTime] = useState("");
  const [filterLoading, setFilterLoading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAllLocations();
      setLocations(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load location tracks");
    } finally {
      setLoading(false);
    }
  };

  const loadEmployees = async () => {
    try {
      const res = await getAllEmployees();
      setEmployees(res.data);
      if (res.data.length > 0) {
        setSimSelectedEmployeeId(res.data[0].id?.toString() || "");
      }
    } catch (err) {
      console.error("Failed to load employees list", err);
    }
  };

  useEffect(() => {
    loadData();
    loadEmployees();
  }, []);

  const handleApplyFilter = async (e: FormEvent) => {
    e.preventDefault();
    if (filterEmployeeId === "ALL") {
      await loadData();
      return;
    }
    
    try {
      setFilterLoading(true);
      setError(null);
      const empIdNum = parseInt(filterEmployeeId);
      
      if (filterStartTime && filterEndTime) {
        // Convert local input datetimes to ISO strings for backend
        const startISO = new Date(filterStartTime).toISOString().split('.')[0]; // YYYY-MM-DDTHH:mm:ss
        const endISO = new Date(filterEndTime).toISOString().split('.')[0];
        const res = await getLocationsByEmployeeAndRange(empIdNum, startISO, endISO);
        setLocations(res.data);
      } else {
        const res = await getLocationsByEmployee(empIdNum);
        setLocations(res.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to filter location records");
    } finally {
      setFilterLoading(false);
    }
  };

  const handleClearFilter = async () => {
    setFilterEmployeeId("ALL");
    setFilterStartTime("");
    setFilterEndTime("");
    await loadData();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Remove this location log?")) return;
    try {
      await deleteLocation(id);
      setLocations((prev) => prev.filter((loc) => loc.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete log");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitLoading(true);

    try {
      await trackLocation(
        parseInt(simSelectedEmployeeId),
        parseFloat(latitude),
        parseFloat(longitude),
        address,
        activityType
      );
      setIsModalOpen(false);
      setAddress("Picozen Headquarters, Colombo");
      await loadData();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to track coordinates");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Location Tracker</h1>
          <p className="text-gray-600 mt-1">Monitor field coordinates, sales visits, and dynamic dispatch routes</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium text-sm"
        >
          <FiCompass />
          <span>Simulate GPS Ping</span>
        </button>
      </div>

      {/* Advanced Filtering Form */}
      <form onSubmit={handleApplyFilter} className="bg-white rounded-xl border border-gray-100 p-4 mb-6 shadow-sm flex flex-wrap items-end gap-4">
        <div className="min-w-[150px] flex-1">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Filter Agent</label>
          <select
            value={filterEmployeeId}
            onChange={(e) => setFilterEmployeeId(e.target.value)}
            className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white"
          >
            <option value="ALL">Show All Agents</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>{emp.user.fullName}</option>
            ))}
          </select>
        </div>

        <div className="min-w-[180px] flex-1">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Start Date & Time</label>
          <input
            type="datetime-local"
            value={filterStartTime}
            onChange={(e) => setFilterStartTime(e.target.value)}
            className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
          />
        </div>

        <div className="min-w-[180px] flex-1">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">End Date & Time</label>
          <input
            type="datetime-local"
            value={filterEndTime}
            onChange={(e) => setFilterEndTime(e.target.value)}
            className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <button
            type="submit"
            disabled={filterLoading}
            className="flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 bg-gray-800 text-white hover:bg-gray-900 px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
          >
            {filterLoading ? <FiLoader className="animate-spin" /> : <FiFilter />}
            <span>Filter</span>
          </button>
          <button
            type="button"
            onClick={handleClearFilter}
            className="flex items-center justify-center space-x-1 border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-lg text-sm font-medium transition"
          >
            <FiRefreshCw size={14} />
            <span>Reset</span>
          </button>
        </div>
      </form>

      {/* Visual Simulation Roster */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Mock Map / GPS Display */}
        <div className="lg:col-span-2 bg-slate-950 rounded-xl overflow-hidden shadow-sm relative min-h-[400px] flex items-center justify-center border border-slate-800">
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>
          
          <div className="text-center z-10 px-6">
            <FiMapPin className="w-16 h-16 text-blue-500 animate-bounce mx-auto mb-4" />
            <h3 className="text-white text-xl font-bold">Field Dispatch Map</h3>
            <p className="text-slate-400 text-sm mt-1 max-w-md mx-auto">
              Real-time tracker actively listening to GPS coordinate updates. Telemetry updates and routes are generated dynamically below.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3 max-h-[150px] overflow-y-auto">
              {locations.slice(0, 5).map((loc, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-slate-900 border border-slate-800 text-blue-400 rounded-lg text-xs font-mono"
                >
                  📍 {loc.employee.user.fullName} ({loc.latitude}, {loc.longitude})
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Coordinates Roster */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 overflow-hidden flex flex-col max-h-[460px]">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-50 pb-2">Active Telemetry Logs ({locations.length})</h2>

          {loading || filterLoading ? (
            <div className="flex flex-col items-center justify-center flex-1">
              <FiLoader className="w-8 h-8 text-blue-600 animate-spin mb-2" />
              <p className="text-gray-500 text-sm">Synchronizing logs...</p>
            </div>
          ) : error ? (
            <div className="text-red-500 text-sm p-4 text-center">{error}</div>
          ) : locations.length === 0 ? (
            <div className="text-gray-400 text-center py-12 text-sm flex-1 flex items-center justify-center">
              No matching field logs found for current filter.
            </div>
          ) : (
            <div className="space-y-4 overflow-y-auto flex-1 pr-1">
              {locations.map((loc) => (
                <div
                  key={loc.id}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-100 relative group"
                >
                  <button
                    onClick={() => loc.id && handleDelete(loc.id)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg"
                    title="Delete log"
                  >
                    <FiTrash2 size={14} />
                  </button>

                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-gray-800 text-sm">{loc.employee.user.fullName}</span>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-[10px] font-bold">
                      {loc.activityType}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 font-medium mb-1.5">{loc.address}</p>
                  <div className="flex items-center justify-between text-[10px] font-mono text-gray-400">
                    <span>Lat: {loc.latitude} | Lng: {loc.longitude}</span>
                    <span>{loc.timestamp ? new Date(loc.timestamp).toLocaleString() : ""}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Simulator Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800">Simulate GPS Dispatch Ping</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {submitError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                  {submitError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Select Field Agent <span className="text-red-500">*</span>
                </label>
                <select
                  value={simSelectedEmployeeId}
                  onChange={(e) => setSimSelectedEmployeeId(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.user.fullName} ({emp.designation})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Latitude <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Longitude <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Simulated Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Activity Context <span className="text-red-500">*</span>
                </label>
                <select
                  value={activityType}
                  onChange={(e) => setActivityType(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                >
                  <option value="FIELD_VISIT">FIELD_VISIT</option>
                  <option value="CHECK_IN">CHECK_IN</option>
                  <option value="CHECK_OUT">CHECK_OUT</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium rounded-lg transition-colors text-sm"
                >
                  {submitLoading ? (
                    <>
                      <FiLoader className="animate-spin mr-2" /> Dispatching…
                    </>
                  ) : (
                    "Transmit Ping"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
