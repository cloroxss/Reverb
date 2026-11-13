import axios from "axios";

export const SUPABASE_URL = "https://kcnhlbpwzywzsjhumbjp.supabase.co";
const SUPABASE_KEY = "sb_publishable_sNJO99mjHnP5DooKNhGVFA_2XCXZtCt";

const api = axios.create({
  baseURL: `${SUPABASE_URL}/rest/v1`,
  headers: {
    apikey: SUPABASE_KEY,
    Authorization: "Bearer " + SUPABASE_KEY,
    "Content-Type": "application/json",
  },
});

export default api;
