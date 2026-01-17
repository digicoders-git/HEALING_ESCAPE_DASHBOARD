import http from "./http";



export const getEnquiries = async (params = {}) => {
  const queryParams = new URLSearchParams();

  if (params.search) queryParams.append("search", params.search); // ✅ VERY IMPORTANT
  if (params.country) queryParams.append("country", params.country);
  if (params.preferredCity) queryParams.append("preferredCity", params.preferredCity);
  // if (params.page) queryParams.append("page", params.page);
  // if (params.limit) queryParams.append("limit", params.limit);

  const url = `/enquiry/all${queryParams.toString() ? "?" + queryParams.toString() : ""}`;
  console.log("Making API call to:", url);

  const response = await http.get(url);
  console.log(response.data)
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
