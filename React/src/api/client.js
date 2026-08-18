import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.PROD ? '/api/v1' : 'http://localhost:8000/api/v1',
  withCredentials: true,
  timeout: 15000, 
  headers: {
    'Content-Type': 'application/json',
  }
})

