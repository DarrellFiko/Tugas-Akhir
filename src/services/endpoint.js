// Base endpoints
export const ENDPOINTS = {
  BARANG: {
    GET_ALL: "/barang",
    LOAD: "/loadBarang",
    CREATE: "/barang",
    DELETE: (id) => `/barang/${id}`,
  },

  USER: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    PROFILE: "/user/profile",
  },

  // Example
  ORDER: {
    GET_ALL: "/orders",
    CREATE: "/orders",
    DELETE: (id) => `/orders/${id}`,
  },
};
  