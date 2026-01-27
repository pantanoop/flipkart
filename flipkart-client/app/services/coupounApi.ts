import axios from "axios";

const API_URL = "http://localhost:5000";
export const coupounService = {
  async findCoupoun(data: any) {
    console.log(data, "api coupoun");
    const response = await axios.get(`${API_URL}/coupouns`, { params: data });
    return response.data;
  },
};
