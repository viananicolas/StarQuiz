import axios from "axios";
const BASE_URL = "https://swapi.co/api/";

const instance = axios.create({
  baseURL: `${BASE_URL}`
});

export const getAllPeople = async page => {
  const result = await instance.get(`people/?page=${page}&format=json`);
  return result.data.results;
};
