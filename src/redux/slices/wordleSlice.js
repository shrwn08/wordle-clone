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

function wordleReducer(state, action) {
  switch (action.type) {
    case "NEW_GAME":
      return {
        ...initialState,
        currentWord: Words[Math.floor(Math.random() * Words.length)].toUpperCase(),
      };
    case "SET_ATTEMPT": {
      const { row, col, value } = action.payload;
      const chars = state.attempts[row].split("");
      while (chars.length < 5) chars.push("");
      chars[col] = value;
      const newAttempts = [...state.attempts];
      newAttempts[row] = chars.join("").slice(0, 5);
      return { ...state, attempts: newAttempts };
    }
    case "SUBMIT_ROW": {
      const { row, evalArr, kbMap } = action.payload;
      const newEvaluations = [...state.evaluations];
      newEvaluations[row] = evalArr;
      const won = state.attempts[row] === state.currentWord;
      const lost = row === 5 && !won;
      return {
        ...state,
        evaluations: newEvaluations,
        kbStatus: kbMap,
        gameStatus: won ? "won" : lost ? "lost" : "playing",
        currentRow: won || lost ? row : row + 1,
      };
    }
    default:
      return state;
  }
}

export const { newGame, setAttempt, submitRow } = wordleReducer.actions;
export default wordleReducer.reducer;
