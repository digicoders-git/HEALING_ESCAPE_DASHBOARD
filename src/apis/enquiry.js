import http from "./http";



export const getEnquiries = async (params) => {
  const response = await http.get("/enquiry/all", { params });
  return response.data;
};


export const getEnquiryById = async (id) => {
  const response = await http.get(`/enquiry/${id}`);
  return response.data;
};

export const updateEnquiry = async (id, data) => {
  const response = await http.put(`/enquiry/update/${id}`, data);
  return response.data;
};

export const deleteEnquiry = async (id) => {
  const response = await http.delete(`/enquiry/delete/${id}`);
  return response.data;
};
