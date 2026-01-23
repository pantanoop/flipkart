// import axios from "axios";

// const API_URL = "http://localhost:5000";

// export const productService = {
//   async getProducts(params: {
//     page?: number;
//     limit?: number;
//     category?: string;
//     subcategory?: string;
//   }) {
//     const response = await axios.get(`${API_URL}/products`, {
//       params,
//     });
//     return response.data;
//   },

//   async getProductById(id: number) {
//     const response = await axios.get(`${API_URL}/products/${id}`);
//     return response.data;
//   },

//   async addProduct(data: {
//     productname: string;
//     price: number;
//     category: string;
//     subcategory: string;
//     description?: string;
//     photoUrl?: string;
//     sellerid: number;
//   }) {
//     const response = await axios.post(`${API_URL}/products`, data);
//     return response.data;
//   },

//   async updateProduct(
//     productid: number,
//     data: {
//       productname?: string;
//       price?: number;
//       category?: string;
//       subcategory?: string;
//       description?: string;
//       photoUrl?: string;
//       rating?: number;
//     },
//   ) {
//     const response = await axios.put(`${API_URL}/products/${productid}`, data);
//     return response.data;
//   },

//   async deleteProduct(productid: number) {
//     const response = await axios.delete(`${API_URL}/products/${productid}`);
//     return response.data;
//   },
// };

import axios from "axios";

const API_URL = "http://localhost:5000";

export const productService = {
  async addProduct(formData: FormData) {
    const response = await axios.post(`${API_URL}/products`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  async getProducts(params: any) {
    const response = await axios.get(`${API_URL}/products`, { params });
    return response.data;
  },

  async getProductById(id: number) {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return response.data;
  },

  async deleteProduct(productid: number) {
    const response = await axios.delete(`${API_URL}/products/${productid}`);
    return response.data;
  },
};
