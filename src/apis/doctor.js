import http from "./http";

export const createDoctor = async (data) => {
  const response = await http.post("/doctor/create", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getDoctors = async (params) => {
  const response = await http.get("/doctor/all", { params });
  return response.data;
};

export const getDoctorById = async (id) => {
  const response = await http.get(`/doctor/${id}`);
  return response.data;
};

export const updateDoctor = async (id, data) => {
  const response = await http.put(`/doctor/update/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateDoctorStatus = async (id) => {
  const response = await http.patch(`/doctor/status/${id}`);
  return response.data;
};

export const deleteDoctor = async (id) => {
  const response = await http.delete(`/doctor/delete/${id}`);
  return response.data;
};
