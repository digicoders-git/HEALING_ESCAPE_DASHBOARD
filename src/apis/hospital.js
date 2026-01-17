import http from "./http";

export const createHospital = async (data) => {
  const response = await http.post("/hospital/create", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getHospitals = async (params) => {
  const response = await http.get("/hospital/all", { params });
  return response.data;
};

export const getHospitalById = async (id) => {
  const response = await http.get(`/hospital/${id}`);
  return response.data;
};

export const updateHospital = async (id, data) => {
  const response = await http.put(`/hospital/update/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateHospitalStatus = async (id) => {
  const response = await http.patch(`/hospital/status/${id}`);
  return response.data;
};

export const deleteHospital = async (id) => {
  const response = await http.delete(`/hospital/delete/${id}`);
  return response.data;
};
