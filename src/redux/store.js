import { configureStore } from "@reduxjs/toolkit";
import wordleSlice from "./slices/wordleSlice"


export const store = configureStore({ reducer: wordleSlice });