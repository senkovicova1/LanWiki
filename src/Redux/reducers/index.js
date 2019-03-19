import { ADD_ARTICLE, LOGIN_USER } from "../constants/action-types";

const initialState = {
  articles: [],
  user: {},
};
function rootReducer(state = initialState, action) {
  if (action.type === ADD_ARTICLE) {
     return Object.assign({}, state, {
       articles: state.articles.concat(action.payload)
     });
   }
   if (action.type === LOGIN_USER) {
      return Object.assign({}, state, {
        user: action.payload
      });
    }
  return state;
};
export default rootReducer;
