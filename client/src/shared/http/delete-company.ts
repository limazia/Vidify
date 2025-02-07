import { api } from "@/shared/lib/axios";

export interface DeleteCompanyRequest {
  company_id: string;
}

export async function deleteCompany({ company_id }: DeleteCompanyRequest) {
  await api.delete(`/api/company/${company_id}`);
}