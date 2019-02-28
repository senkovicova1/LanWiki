import { ADD_ARTICLE, LOGIN_USER } from "../constants/action-types";

export function addArticle(payload) {
  return { type: ADD_ARTICLE, payload }
};

export function loginUser(payload) {
  return { type: LOGIN_USER, payload }
};
