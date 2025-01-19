import axios from "axios";

export const makeRequest = axios.create({
    baseURL: "http://localhost:4000",
    withCredentials: true,
});