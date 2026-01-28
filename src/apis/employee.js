import http from "./http";

export const createEmployee = async (data) => {
  const response = await http.post("/employee/create", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getEmployees = async (params) => {
  const response = await http.get("/employee/all", { params });
  return response.data;
};

export const getEmployeeById = async (id) => {
  const response = await http.get(`/employee/get/${id}`);
  return response.data;
};

export const updateEmployee = async (id, data) => {
  const response = await http.put(`/employee/update/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteEmployee = async (id) => {
  const response = await http.delete(`/employee/delete/${id}`);
  return response.data;
};

export const toggleEmployeeStatus = async (id) => {
  const response = await http.patch(`/employee/toggle-status/${id}`);
  return response.data;
};
