import API from "./api";

export const convertQuantity = async (data) => {
  const response = await API.post("/convert", data);
  return response.data;
};
export const getHistory = async () => {
  const res = await API.get("/history");
  return res.data;
};