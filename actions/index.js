import axios from "axios";
const BASE_URL = "https://swapi.co/api/";
import { AsyncStorage } from "react-native";

const instance = axios.create({
  baseURL: `${BASE_URL}`
});

export const getAllPeople = async page => {
  const result = await instance.get(`people/?page=${page}&format=json`);
  return result.data.results;
};

export const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return value;
  } catch (error) {}
};

export const retrieveData = async key => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return JSON.parse(value);
    }
    return [];
  } catch (error) {}
};
