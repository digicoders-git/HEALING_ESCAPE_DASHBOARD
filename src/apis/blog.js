import http from "./http";

export const getBlogs = async (params) => {
  const response = await http.get("/blog/all", { params });
  return response.data;
};

export const getBlogById = async (id) => {
  const response = await http.get(`/blog/${id}`);
  return response.data;
};

export const createBlog = async (formData) => {
  const response = await http.post("/blog/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateBlog = async (id, formData) => {
  const response = await http.put(`/blog/update/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateBlogStatus = async (id) => {
  const response = await http.patch(`/blog/status/${id}`);
  return response.data;
};

export const deleteBlog = async (id) => {
  const response = await http.delete(`/blog/delete/${id}`);
  return response.data;
};
