import http from "./http";

export const getFreeConsultations = async (params) => {
  const response = await http.get("/free-consultation/all", { params });
  return response.data;
};

export const getFreeConsultationById = async (id) => {
  const response = await http.get(`/free-consultation/${id}`);
  return response.data;
};

export const updateFreeConsultation = async (id, data) => {
  const response = await http.put(`/free-consultation/update/${id}`, data);
  return response.data;
};

export const deleteFreeConsultation = async (id) => {
  const response = await http.delete(`/free-consultation/delete/${id}`);
  return response.data;
};

export const createLead = async (data) => {
  const response = await http.post("/free-consultation/admin/create", data);
  return response.data;
};

export const assignLeads = async (data) => {
  const response = await http.post("/lead/assign", data);
  return response.data;
};

export const unassignLeads = async (data) => {
  const response = await http.post("/lead/unassign", data);
  return response.data;
};

export const getUnassignedLeads = async (params) => {
  const response = await http.get("/lead/unassigned", { params });
  return response.data;
};

export const getLeadsByEmployee = async (employeeId, params) => {
  const response = await http.get(`/lead/by-employee/${employeeId}`, { params });
  return response.data;
};

export const addFollowUp = async (data) => {
  const response = await http.post("/followup/add", data);
  return response.data;
};

export const markFollowUpDone = async (id) => {
  const response = await http.patch(`/followup/done/${id}`);
  return response.data;
};

export const getAllFollowUps = async (params) => {
  const response = await http.get("/followup/all", { params });
  return response.data;
};
