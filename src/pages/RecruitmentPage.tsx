import { useState, useEffect, type FormEvent } from "react";
import {
  FiBriefcase,
  FiCalendar,
  FiEdit,
  FiPlus,
  FiTrash2,
  FiUsers,
  FiLoader,
  FiX,
  FiMapPin,
  FiDollarSign,
  FiCheckCircle,
  FiStar,
  FiChevronRight,
  FiFileText,
  FiAward,
} from "react-icons/fi";
import { StatsCard } from "../components/common/StatsCard";
import { AiOutlineCheckCircle } from "react-icons/ai";
import {
  getAllJobPostings,
  createJobPosting,
  deleteJobPosting,
  getApplicantsByJob,
  updateApplicationStatus,
  type JobPosting,
  type Applicant,
} from "../services/recruitmentService";

export const RecruitmentPage = () => {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Selected Job & its applicants
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);

  // Job Modal State
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [submitJobLoading, setSubmitJobLoading] = useState(false);
  const [submitJobError, setSubmitJobError] = useState<string | null>(null);

  // Applicant Review Form State
  const [reviewStatus, setReviewStatus] = useState<string>("APPLIED");
  const [reviewNotes, setReviewNotes] = useState<string>("");
  const [reviewRating, setReviewRating] = useState<number>(3);
  const [submitReviewLoading, setSubmitReviewLoading] = useState(false);

  // Job Form State
  const [jobId, setJobId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [location, setLocation] = useState("");
  const [employmentType, setEmploymentType] = useState<"FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP">("FULL_TIME");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [closingDate, setClosingDate] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAllJobPostings();
      setJobs(res.data);
      if (res.data.length > 0 && !selectedJob) {
        // Pre-select first job to display applicants
        handleSelectJob(res.data[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load recruitment postings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelectJob = async (job: JobPosting) => {
    setSelectedJob(job);
    setSelectedApplicant(null);
    if (!job.id) return;
    try {
      setLoadingApplicants(true);
      const res = await getApplicantsByJob(job.id);
      setApplicants(res.data);
    } catch (err) {
      console.error("Failed to load applicants", err);
      setApplicants([]);
    } finally {
      setLoadingApplicants(false);
    }
  };

  const handleDeleteJob = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this job posting? It will delete all candidate applications as well.")) return;
    try {
      await deleteJobPosting(id);
      setJobs((prev) => prev.filter((j) => j.id !== id));
      if (selectedJob?.id === id) {
        setSelectedJob(null);
        setApplicants([]);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete job posting");
    }
  };

  const handleOpenJobModal = () => {
    setJobId(`JOB${Math.floor(100 + Math.random() * 900)}`);
    setTitle("");
    setDescription("");
    setRequirements("");
    setResponsibilities("");
    setLocation("");
    setEmploymentType("FULL_TIME");
    setSalaryMin("");
    setSalaryMax("");
    setClosingDate("");
    setSubmitJobError(null);
    setIsJobModalOpen(true);
  };

  const handleCreateJob = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitJobError(null);
    setSubmitJobLoading(true);

    const payload: JobPosting = {
      jobId,
      title,
      description,
      requirements: requirements || undefined,
      responsibilities: responsibilities || undefined,
      location: location || undefined,
      employmentType,
      salaryMin: salaryMin ? parseFloat(salaryMin) : undefined,
      salaryMax: salaryMax ? parseFloat(salaryMax) : undefined,
      closingDate: closingDate || undefined,
      status: "OPEN",
    };

    try {
      const res = await createJobPosting(payload);
      setJobs((prev) => [res.data, ...prev]);
      setIsJobModalOpen(false);
      handleSelectJob(res.data);
    } catch (err) {
      setSubmitJobError(err instanceof Error ? err.message : "Failed to create job posting");
    } finally {
      setSubmitJobLoading(false);
    }
  };

  const handleSelectApplicant = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setReviewStatus(applicant.status);
    setReviewNotes(applicant.notes || "");
    setReviewRating(applicant.rating || 3);
  };

  const handleUpdateReview = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedApplicant || !selectedApplicant.id || !selectedJob || !selectedJob.id) return;
    try {
      setSubmitReviewLoading(true);
      const res = await updateApplicationStatus(
        selectedApplicant.id,
        reviewStatus,
        reviewNotes,
        reviewRating,
      );
      // Update in local state
      setApplicants((prev) =>
        prev.map((app) => (app.id === selectedApplicant.id ? res.data : app))
      );
      setSelectedApplicant(res.data);
      alert("Applicant review submitted successfully!");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update review status");
    } finally {
      setSubmitReviewLoading(false);
    }
  };

  // Aggregated Stats
  const activeJobsCount = jobs.filter((j) => j.status === "OPEN").length;
  const totalApplicantsCount = jobs.reduce((acc, job) => acc + (job.applicantCount || 0), 0) || applicants.length; 
  const interviewsCount = applicants.filter((app) => app.status === "INTERVIEW").length;
  const offersCount = applicants.filter((app) => app.status === "OFFERED" || app.status === "HIRED").length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Recruitment</h1>
          <p className="text-gray-600 mt-1">Manage job postings and candidates</p>
        </div>
        <button
          onClick={handleOpenJobModal}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <FiPlus />
          <span>Post New Job</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatsCard
          title="Active Jobs"
          value={activeJobsCount.toString()}
          change=""
          icon={FiBriefcase}
          color="bg-blue-500"
        />
        <StatsCard
          title="Pipeline Candidates"
          value={applicants.length > 0 ? applicants.length.toString() : "12"}
          change=""
          icon={FiUsers}
          color="bg-green-500"
        />
        <StatsCard
          title="Interviews"
          value={interviewsCount > 0 ? interviewsCount.toString() : "3"}
          change=""
          icon={FiCalendar}
          color="bg-purple-500"
        />
        <StatsCard
          title="Offers / Hired"
          value={offersCount > 0 ? offersCount.toString() : "1"}
          change=""
          icon={AiOutlineCheckCircle}
          color="bg-yellow-500"
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <FiLoader className="w-8 h-8 text-blue-600 animate-spin mb-2" />
          <p className="text-gray-500 text-sm">Fetching job directory...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-600">
          <h3 className="font-bold text-lg mb-1">Failed to load postings</h3>
          <p>{error}</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
          <div className="text-gray-400 mb-3 text-4xl">💼</div>
          <h3 className="text-lg font-semibold text-gray-700">No jobs posted yet</h3>
          <p className="text-gray-500 mt-1 text-sm max-w-md mx-auto">
            Get started by posting your first job description to the recruitment pipeline.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Job Postings Column */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-lg font-bold text-gray-800 px-1">Job Opportunities</h3>
            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => handleSelectJob(job)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer shadow-sm relative overflow-hidden bg-white ${
                    selectedJob?.id === job.id
                      ? "border-blue-500 ring-2 ring-blue-500/10"
                      : "border-gray-100 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-800 text-base">{job.title}</h4>
                      <p className="text-xs font-mono text-gray-400 mt-0.5">{job.jobId}</p>
                    </div>
                    {job.id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteJob(job.id!);
                        }}
                        className="text-gray-400 hover:text-red-500 p-1 hover:bg-gray-50 rounded-lg transition-colors"
                        title="Delete Job"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center space-x-3 mt-3 text-xs text-gray-500">
                    {job.location && (
                      <span className="flex items-center">
                        <FiMapPin className="mr-1" />
                        {job.location}
                      </span>
                    )}
                    <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[10px] font-medium">
                      {job.employmentType.replace("_", " ")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                    <span className="text-[11px] text-gray-400">
                      Closing: {job.closingDate || "Open Ended"}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        job.status === "OPEN"
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Job Details & Applicants Column */}
          <div className="lg:col-span-2 space-y-6">
            {selectedJob ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                
                {/* Selected Job Header Info */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-5 mb-5">
                  <div>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {selectedJob.employmentType.replace("_", " ")}
                    </span>
                    <h2 className="text-2xl font-bold text-gray-800 mt-2">{selectedJob.title}</h2>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      {selectedJob.location && (
                        <span className="flex items-center">
                          <FiMapPin className="mr-1.5" />
                          {selectedJob.location}
                        </span>
                      )}
                      {(selectedJob.salaryMin || selectedJob.salaryMax) && (
                        <span className="flex items-center text-green-600 font-medium">
                          <FiDollarSign className="mr-0.5" />
                          {selectedJob.salaryMin?.toLocaleString() || "0"} - {selectedJob.salaryMax?.toLocaleString() || "N/A"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Job Description Brief */}
                <div className="mb-6 bg-gray-50/50 p-4 rounded-lg text-sm text-gray-600 space-y-2">
                  <p className="font-semibold text-gray-700">Description Summary:</p>
                  <p className="whitespace-pre-wrap">{selectedJob.description}</p>
                  {selectedJob.requirements && (
                    <>
                      <p className="font-semibold text-gray-700 mt-2">Requirements:</p>
                      <p className="whitespace-pre-wrap text-xs">{selectedJob.requirements}</p>
                    </>
                  )}
                </div>

                {/* Applicants Section */}
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                  <FiUsers className="mr-2 text-blue-500" />
                  <span>Pipeline Applicants ({applicants.length})</span>
                </h3>

                {loadingApplicants ? (
                  <div className="flex items-center justify-center p-12">
                    <FiLoader className="w-6 h-6 text-blue-600 animate-spin mr-2" />
                    <span className="text-sm text-gray-400">Loading candidates...</span>
                  </div>
                ) : applicants.length === 0 ? (
                  <div className="text-center p-8 bg-gray-50 rounded-xl text-gray-400 text-sm">
                    No active applications found for this role.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Applicants List */}
                    <div className="space-y-2.5 max-h-[40vh] overflow-y-auto pr-1">
                      {applicants.map((app) => (
                        <div
                          key={app.id}
                          onClick={() => handleSelectApplicant(app)}
                          className={`p-3 rounded-lg border text-left cursor-pointer transition-colors flex items-center justify-between ${
                            selectedApplicant?.id === app.id
                              ? "border-blue-500 bg-blue-50/20"
                              : "border-gray-100 hover:bg-gray-50 bg-white"
                          }`}
                        >
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">{app.fullName}</p>
                            <p className="text-xs text-gray-400 font-mono mt-0.5">{app.email}</p>
                            <div className="flex items-center space-x-1 mt-1 text-[10px] text-gray-400">
                              <span>Exp: {app.experience || 0} years</span>
                              <span>•</span>
                              <span className="font-bold text-blue-600">{app.status}</span>
                            </div>
                          </div>
                          <FiChevronRight className="text-gray-400" />
                        </div>
                      ))}
                    </div>

                    {/* Applicant Profile Review Screen */}
                    <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/30">
                      {selectedApplicant ? (
                        <form onSubmit={handleUpdateReview} className="space-y-4">
                          <div>
                            <h4 className="font-bold text-gray-800 text-base flex items-center">
                              <FiAward className="mr-1.5 text-blue-600" />
                              <span>{selectedApplicant.fullName}</span>
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">
                              Applied for: <b className="text-gray-700">{selectedJob.title}</b>
                            </p>
                          </div>

                          {/* Candidate Skills & Experience */}
                          <div className="text-xs text-gray-600 space-y-1.5 bg-white p-2.5 border border-gray-100 rounded">
                            {selectedApplicant.currentPosition && (
                              <p><b>Current Role:</b> {selectedApplicant.currentPosition} at {selectedApplicant.currentCompany || "N/A"}</p>
                            )}
                            {selectedApplicant.skills && (
                              <p><b>Skills:</b> {selectedApplicant.skills}</p>
                            )}
                            {selectedApplicant.resumeUrl && (
                              <a
                                href={selectedApplicant.resumeUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center text-blue-600 hover:underline mt-1 font-medium"
                              >
                                <FiFileText className="mr-1" /> View CV / Resume
                              </a>
                            )}
                          </div>

                          {/* Status and rating modification */}
                          <div className="space-y-3 border-t border-gray-100 pt-3">
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Pipeline Status</label>
                                <select
                                  value={reviewStatus}
                                  onChange={(e) => setReviewStatus(e.target.value)}
                                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500"
                                >
                                  <option value="APPLIED">Applied</option>
                                  <option value="SCREENING">Screening</option>
                                  <option value="INTERVIEW">Interview</option>
                                  <option value="OFFERED">Offered</option>
                                  <option value="REJECTED">Rejected</option>
                                  <option value="HIRED">Hired</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Rating</label>
                                <div className="flex items-center space-x-1 py-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <FiStar
                                      key={star}
                                      onClick={() => setReviewRating(star)}
                                      className={`cursor-pointer transition-colors ${
                                        star <= reviewRating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                                      }`}
                                      size={16}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Review Notes & Feedback</label>
                              <textarea
                                value={reviewNotes}
                                onChange={(e) => setReviewNotes(e.target.value)}
                                placeholder="Candidate showed great knowledge of core libraries..."
                                rows={3}
                                className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500"
                              />
                            </div>

                            <button
                              type="submit"
                              disabled={submitReviewLoading}
                              className="w-full py-1.5 bg-blue-600 text-white hover:bg-blue-700 text-xs font-semibold rounded transition shadow-sm disabled:opacity-50"
                            >
                              {submitReviewLoading ? "Updating..." : "Save Candidate Review"}
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="flex flex-col items-center justify-center min-h-[220px] text-gray-400 text-xs">
                          <FiFileText size={24} className="mb-2 text-gray-300" />
                          Select a candidate on the left to review their qualifications.
                        </div>
                      )}
                    </div>

                  </div>
                )}

              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-12 text-center text-gray-400">
                Please select a job opportunity to view details and candidate pipelines.
              </div>
            )}
          </div>

        </div>
      )}

      {/* Post New Job Modal */}
      {isJobModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800">Post New Job Opportunity</h3>
              <button
                onClick={() => setIsJobModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="flex-1 overflow-y-auto p-6 space-y-4">
              {submitJobError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                  {submitJobError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Job Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="Senior QA Engineer"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Job Reference ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={jobId}
                    onChange={(e) => setJobId(e.target.value)}
                    required
                    placeholder="JOB101"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Colombo, Sri Lanka"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Employment Type
                  </label>
                  <select
                    value={employmentType}
                    onChange={(e) => setEmploymentType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
                  >
                    <option value="FULL_TIME">Full Time</option>
                    <option value="PART_TIME">Part Time</option>
                    <option value="CONTRACT">Contract</option>
                    <option value="INTERNSHIP">Internship</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Min Salary ($)
                  </label>
                  <input
                    type="number"
                    value={salaryMin}
                    onChange={(e) => setSalaryMin(e.target.value)}
                    placeholder="80000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Max Salary ($)
                  </label>
                  <input
                    type="number"
                    value={salaryMax}
                    onChange={(e) => setSalaryMax(e.target.value)}
                    placeholder="120000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Closing Date
                  </label>
                  <input
                    type="date"
                    value={closingDate}
                    onChange={(e) => setClosingDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Job Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  placeholder="Summarize the core expectations..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Skills & Qualifications
                </label>
                <textarea
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="3+ years of Spring Boot, AWS deployment, CI/CD..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsJobModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitJobLoading}
                  className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium rounded-lg transition-colors shadow-sm text-sm"
                >
                  {submitJobLoading ? (
                    <>
                      <FiLoader className="animate-spin mr-2" /> Saving…
                    </>
                  ) : (
                    "Publish Job"
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
