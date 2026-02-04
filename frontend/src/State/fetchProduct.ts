import { api } from "../config/Api";

export const fetchProduct = async () => {
    try {
        const response = await api.get("/products"); // ✅ relative path
        console.log("response : ", response);
    } catch (error) {
        console.log(error);
    }
};