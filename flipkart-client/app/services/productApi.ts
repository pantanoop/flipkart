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
    console.log("api hit", params);
    const response = await axios.get(`${API_URL}/products`, { params });
    return response.data;
  },

  async getProductById(id: number) {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return response.data;
  },

  async deleteProduct(productid: number) {
    // console.log("api func del", productid);
    const response = await axios.delete(`${API_URL}/products/${productid}`);
    return response.data;
  },
  async update(productid: number, data: FormData) {
    // console.log("api", productid, data);
    const response = await axios.put(`${API_URL}/products/${productid}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
  async banProduct(productid: number) {
    console.log(productid);
    const response = await axios.put(`${API_URL}/products/${productid}/ban`);
    return response.data;
  },

  async addWishlist(data: any) {
    const response = await axios.post(`${API_URL}/wishlist`, data);
    return response.data;
  },

  async getWishlist(userid: number) {
    const response = await axios.get(`${API_URL}/wishlist/${userid}`);
    return response.data;
  },
  async removeWishlist(productid: number, userid: number) {
    console.log("productid", productid, "userid", userid);
    const response = await axios.delete(
      `${API_URL}/wishlist/${productid}/${userid}`,
    );
    return response.data;
  },
};
