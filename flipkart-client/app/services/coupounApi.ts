import axios from "axios";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const coupounService = {
  async findCoupoun(data: any) {
    console.log(data, "api coupoun");
    const response = await axios.get(`${API_BASE_URL}/coupouns`, {
      params: data,
    });
    return response.data;
  },
};
