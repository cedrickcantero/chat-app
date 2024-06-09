// apps/chat-client/src/axiosConfig.ts

import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': process.env.REACT_APP_API_URL,
  },
  withCredentials: true
});

export default instance;
