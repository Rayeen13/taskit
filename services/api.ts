import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const api = axios.create({
  baseURL: "http://10.123.84.142:8000/api",
  timeout: 8000,
});

// 🔐 attach token automatically
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("TOKEN");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
