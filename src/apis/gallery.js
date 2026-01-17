import http from "./http";

export const getGalleries = async (params) => {
  const response = await http.get("/gallery/all", { params });
  return response.data;
};

export const getGalleryById = async (id) => {
  const response = await http.get(`/gallery/${id}`);
  return response.data;
};

export const createGallery = async (formData) => {
  const response = await http.post("/gallery/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateGallery = async (id, formData) => {
  const response = await http.put(`/gallery/update/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateGalleryStatus = async (id) => {
  const response = await http.patch(`/gallery/status/${id}`);
  return response.data;
};

export const deleteGallery = async (id) => {
  const response = await http.delete(`/gallery/delete/${id}`);
  return response.data;
};
