import http from "./http";

export const getVideos = async (params) => {
  const response = await http.get("/video/all", { params });
  return response.data;
};

export const getVideoById = async (id) => {
  const response = await http.get(`/video/${id}`);
  return response.data;
};

export const createVideo = async (formData) => {
  const response = await http.post("/video/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateVideo = async (id, formData) => {
  const response = await http.put(`/video/update/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateVideoStatus = async (id) => {
  const response = await http.patch(`/video/status/${id}`);
  return response.data;
};

export const deleteVideo = async (id) => {
  const response = await http.delete(`/video/delete/${id}`);
  return response.data;
};
