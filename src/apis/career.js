import http from "./http";

export const getCareers = async (params) => {
  const response = await http.get("/career/all", { params });
  return response.data;
};

export const getCareerById = async (id) => {
  const response = await http.get(`/career/${id}`);
  return response.data;
};

export const deleteCareer = async (id) => {
  const response = await http.delete(`/career/delete/${id}`);
  return response.data;
};
