import http from './http';

export const getAdminProfile = async () => {
  const response = await http.get('/admin/get');
  return response.data;
};

export const updateAdminProfile = async (id, data) => {
  // If data contains a file (profilePhoto), use FormData
  let headers = {};
  if (data instanceof FormData) {
    headers = { 'Content-Type': 'multipart/form-data' };
  } else {
    headers = { 'Content-Type': 'application/json' };
  }

  const response = await http.put(`/admin/update/${id}`, data, { headers });
  return response.data;
};
