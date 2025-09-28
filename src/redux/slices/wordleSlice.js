import {  createSlice } from "@reduxjs/toolkit";
import {Words} from "./data"

const initialState = {
  currentWord: "",
  attempts: Array(6).fill(""),
  evaluations: Array(6).fill(null),
  currentRow: 0,
  gameStatus: "playing",
  kbStatus: {},
};

const wordleSlice = createSlice({
  name: "wordle",
  initialState,
  reducers: {
    newGame(state) {
      state.currentWord = Words[Math.floor(Math.random() * Words.length)].toUpperCase();
      state.attempts = Array(6).fill("");
      state.evaluations = Array(6).fill(null);
      state.currentRow = 0;
      state.gameStatus = "playing";
      state.kbStatus = {};
    },
    setAttempt(state, { payload: { row, col, value } }) {
      const chars = state.attempts[row].split("");
      while (chars.length < 5) chars.push("");
      chars[col] = value; // update specific column
      state.attempts[row] = chars.join("").slice(0, 5);
    },
    submitRow(state, { payload }) {
      // Save row evaluation
      state.evaluations[payload.row] = payload.evalArr;
      // Update keyboard status
      state.kbStatus = payload.kbMap;
      // Check win/loss conditions
      if (state.attempts[payload.row] === state.currentWord) state.gameStatus = "won";
      else if (payload.row === 5) state.gameStatus = "lost";
      else state.currentRow += 1; // move to next row
    },
  },
});

export const { newGame, setAttempt, submitRow } = wordleSlice.actions;
export default wordleSlice.reducer;
