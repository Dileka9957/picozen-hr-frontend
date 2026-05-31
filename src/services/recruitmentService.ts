import api, { extractError } from "../api/api";
import type { ApiResponse } from "../types/auth-types";

export interface JobPosting {
  id?: number;
  jobId: string;
  title: string;
  description: string;
  requirements?: string;
  responsibilities?: string;
  location?: string;
  employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";
  salaryMin?: number;
  salaryMax?: number;
  postedDate?: string;
  closingDate?: string;
  status: "OPEN" | "CLOSED" | "FILLED";
  applicantCount?: number; // Optional metadata
}

export interface Applicant {
  id?: number;
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  coverLetter?: string;
  resumeUrl?: string;
  experience?: number;
  currentCompany?: string;
  currentPosition?: string;
  skills?: string;
  education?: string;
  status: "APPLIED" | "SCREENING" | "INTERVIEW" | "OFFERED" | "REJECTED" | "HIRED";
  notes?: string;
  rating?: number;
  appliedAt?: string;
}

export async function getAllJobPostings(): Promise<ApiResponse<JobPosting[]>> {
  try {
    const { data } = await api.get<ApiResponse<JobPosting[]>>("/api/recruitment/jobs");
    return data;
  } catch (err) {
    throw extractError(err);
  }
}

export async function createJobPosting(job: JobPosting): Promise<ApiResponse<JobPosting>> {
  try {
    const { data } = await api.post<ApiResponse<JobPosting>>("/api/recruitment/jobs", job);
    return data;
  } catch (err) {
    throw extractError(err);
  }
}

export async function deleteJobPosting(id: number): Promise<ApiResponse<void>> {
  try {
    const { data } = await api.delete<ApiResponse<void>>(`/api/recruitment/jobs/${id}`);
    return data;
  } catch (err) {
    throw extractError(err);
  }
}

export async function getApplicantsByJob(jobId: number): Promise<ApiResponse<Applicant[]>> {
  try {
    const { data } = await api.get<ApiResponse<Applicant[]>>(`/api/recruitment/jobs/${jobId}/applicants`);
    return data;
  } catch (err) {
    throw extractError(err);
  }
}

export async function updateApplicationStatus(
  id: number,
  status: string,
  notes?: string,
  rating?: number,
): Promise<ApiResponse<Applicant>> {
  try {
    let url = `/api/recruitment/applicants/${id}/status?status=${encodeURIComponent(status)}`;
    if (notes !== undefined) {
      url += `&notes=${encodeURIComponent(notes)}`;
    }
    if (rating !== undefined) {
      url += `&rating=${rating}`;
    }
    const { data } = await api.put<ApiResponse<Applicant>>(url);
    return data;
  } catch (err) {
    throw extractError(err);
  }
}
