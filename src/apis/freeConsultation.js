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
