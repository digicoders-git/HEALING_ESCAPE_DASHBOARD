import http from "./http";

export const adminLogin = async ({ email, password }) => {
  // console.log('Auth.js - Received params:', { adminId, password });
  
  try {
    const response = await http.post("/admin/login", {
      email,
      password,
    });
    
    console.log('Auth.js - API Response:', response);
    return response.data;
  } catch (error) {
    console.error('Auth.js - API Error:', error);
    throw error;
  }
};
