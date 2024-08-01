import { combineReducers } from "redux";
import { SigninSlice } from "./authSlice";

const userReducer = combineReducers({
    authReducer:SigninSlice.reducer
})

export default userReducer