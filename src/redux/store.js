import { configureStore } from "@reduxjs/toolkit";
import wordleReducer from "./slices/wordleSlice";
export const store = configureStore({ reducer: { wordle: wordleReducer } });