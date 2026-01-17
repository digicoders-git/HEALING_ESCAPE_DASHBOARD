import http from "./http";

export const createSpeciality = async (data) => {
  const response = await http.post("/speciality/create", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getSpecialities = async (params) => {
  const response = await http.get("/speciality/all", { params });
  return response.data;
};

export const getSpecialityById = async (id) => {
  const response = await http.get(`/speciality/${id}`);
  return response.data;
};

export const updateSpecialityStatus = async (id) => {
  const response = await http.patch(`/speciality/status/${id}`);
  return response.data;
};

export const deleteSpeciality = async (id) => {
  const response = await http.delete(`/speciality/delete/${id}`);
  return response.data;
};

export const updateSpeciality = async (id, data) => {
  const response = await http.put(`/speciality/update/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
