import api, { extractError } from "../api/api";
import type { ApiResponse } from "../types/auth-types";
import type { Employee } from "./employeeService";

export interface PayrollRecord {
  id?: number;
  employee: Employee;
  month: number;
  year: number;
  basicSalary: number;
  allowances: number;
  overtimeAmount: number;
  epfEmployee: number;
  epfEmployer: number;
  etfEmployer: number;
  apit: number;
  otherDeductions: number;
  netSalary: number;
  paid: boolean;
  generatedAt?: string;
  paidAt?: string;
}

export async function getMonthlyPayrolls(
  month: number,
  year: number,
): Promise<ApiResponse<PayrollRecord[]>> {
  try {
    const { data } = await api.get<ApiResponse<PayrollRecord[]>>(
      `/api/payroll/month-year?month=${month}&year=${year}`,
    );
    return data;
  } catch (err) {
    throw extractError(err);
  }
}

export async function generatePayroll(
  employeeId: number,
  month: number,
  year: number,
  allowances: number,
  overtimePay: number,
  otherDeductions: number,
): Promise<ApiResponse<PayrollRecord>> {
  try {
    const { data } = await api.post<ApiResponse<PayrollRecord>>(
      `/api/payroll/generate?employeeId=${employeeId}&month=${month}&year=${year}&allowances=${allowances}&overtimePay=${overtimePay}&otherDeductions=${otherDeductions}`,
    );
    return data;
  } catch (err) {
    throw extractError(err);
  }
}

export async function processPayment(id: number): Promise<ApiResponse<PayrollRecord>> {
  try {
    const { data } = await api.put<ApiResponse<PayrollRecord>>(`/api/payroll/${id}/process-payment`);
    return data;
  } catch (err) {
    throw extractError(err);
  }
}
