import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { newGame, setAttempt, submitRow } from "../redux/slices/wordleSlice";
import { Words } from "../redux/slices/data";
import { Button, Row, Col, Form } from "react-bootstrap";
import VirtualKeyboard from "./Game/Keyboard";

const Wordle = () => {
  const dispatch = useDispatch();

  const currentWord = useSelector((state) => state.wordle.currentWord);
  const attempts = useSelector((state) => state.wordle.attempts);
  const evaluations = useSelector((state) => state.wordle.evaluations);
  const currentRow = useSelector((state) =>state.wordle.currentRow);
  const gameStatus = useSelector((state) => state.wordle.gameStatus);
  const kbStatus = useSelector((state) => state.wordle.kbStatus);

  const inputRefs = useRef([]);

  useEffect(() => {
    dispatch(newGame());
    requestAnimationFrame(() => inputRefs.current[0]?.focus());
  }, [dispatch]);

  const idx = (r, c) => r * 5 + c; // flat index
  const scheduleFocus = (flatIndex) =>
    requestAnimationFrame(() => inputRefs.current[flatIndex]?.focus());

  const tileClasses = (status) => {
    switch (status) {
      case "correct":
        return "bg-success text-white border-success";
      case "present":
        return "bg-warning text-dark border-warning";
      case "absent":
        return "bg-secondary text-white border-secondary";
      default:
        return "bg-white border border-secondary";
    }
  };

  const rowToChars = (rowStr = "") => {
    const chars = rowStr.split("");
    while (chars.length < 5) chars.push("");
    return chars.slice(0, 5);
  };

  const handleChange = (row, col, value) => {
    if (gameStatus !== "playing" || row !== currentRow) return;
    const v = value.toUpperCase().slice(-1);
    dispatch(setAttempt({ row, col, value: v }));
    scheduleFocus(idx(row, col + 1));
  };

  const evaluateGuess = (target, guess) => {
    const result = Array(5).fill("absent");
    const tArr = target.split("");
    const gArr = guess.split("");

    for (let i = 0; i < 5; i++) {
      if (gArr[i] === tArr[i]) {
        result[i] = "correct";
        tArr[i] = gArr[i] = null;
      }
    }

    const rem = {};
    for (let i = 0; i < 5; i++) {
      const l = tArr[i];
      if (l) rem[l] = (rem[l] || 0) + 1;
    }
    for (let i = 0; i < 5; i++) {
      const g = gArr[i];
      if (g && rem[g] > 0) {
        result[i] = "present";
        rem[g] -= 1;
      }
    }
    return result;
  };

  const updateKb = (prevMap = {}, guess, evalArr) => {
    const map = { ...prevMap };
    const G = guess.toUpperCase();
    for (let i = 0; i < evalArr.length; i++) {
      const status = evalArr[i];
      const l = G[i];
      if (!l) continue;
      const prev = map[l];
      if (prev === "correct") continue;
      if (status === "correct") {
        map[l] = "correct";
        continue;
      }
      if (status === "present") {
        if (prev !== "present") map[l] = "present";
        continue;
      }
      if (!prev) map[l] = "absent";
    }
    return map;
  };

  const submitCurrentRow = () => {
    if (gameStatus !== "playing") return;
    const rowStr = (attempts[currentRow] || "").toUpperCase();
    const chars = rowToChars(rowStr);
    const guess = chars.join("");
    if (guess.length !== 5 || guess.includes("") || !Words.includes(guess.toLowerCase())) {
      alert("Invalid word entered!");
      return;
    }

    const evalArr = evaluateGuess(currentWord.toUpperCase(), guess);
    const kbMap = updateKb(kbStatus, guess, evalArr);
    dispatch(submitRow({ row: currentRow, evalArr, kbMap }));
    scheduleFocus(idx(currentRow + 1, 0));
  };

  const handleVirtualKey = (key) => {
    if (gameStatus !== "playing") return;

    if (key === "ENTER") {
      submitCurrentRow();
      return;
    }
    if (key === "BKSP") {
      const rowStr = attempts[currentRow] || "";
      const chars = rowToChars(rowStr);
      let lastIdx = -1;
      for (let i = 4; i >= 0; i--) if (chars[i]) { lastIdx = i; break; }
      if (lastIdx >= 0) {
        dispatch(setAttempt({ row: currentRow, col: lastIdx, value: "" }));
        scheduleFocus(idx(currentRow, lastIdx));
      } else {
        scheduleFocus(idx(currentRow, 0));
      }
      return;
    }

    const letter = key.length === 1 ? key.toUpperCase() : null;
    if (!letter) return;
    const rowStr = attempts[currentRow] || "";
    const chars = rowToChars(rowStr);
    const firstEmpty = chars.findIndex((ch) => !ch);
    const col = firstEmpty === -1 ? 4 : firstEmpty;
    dispatch(setAttempt({ row: currentRow, col, value: letter }));
    scheduleFocus(idx(currentRow, Math.min(4, col + 1)));
  };

  const renderBoard = () =>
    Array.from({ length: 6 }).map((_, r) => {
      const rowStr = attempts[r] || "";
      const chars = rowToChars(rowStr);
      return (
        <Row key={r} className="mb-2 justify-content-center">
          {Array.from({ length: 5 }).map((_, c) => {
            const value = chars[c] || "";
            const status = evaluations[r] ? evaluations[r][c] : "";
            return (
              <Col xs="auto" key={c}>
                <Form.Control
                  ref={(el) => (inputRefs.current[idx(r, c)] = el)}
                  type="text"
                  maxLength={1}
                  className={`text-center  fw-bold ${tileClasses(status)}`}
                  style={{ width: "45px", height: "45px" }}
                  value={value}
                  disabled={r !== currentRow || gameStatus !== "playing"}
                  onChange={(e) => handleChange(r, c, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") submitCurrentRow();
                    if (e.key === "Backspace") {
                      if (value) {
                        dispatch(setAttempt({ row: r, col: c, value: "" }));
                      } else if (c > 0) {
                        dispatch(setAttempt({ row: r, col: c - 1, value: "" }));
                        scheduleFocus(idx(r, c - 1));
                      }
                    }
                    if (e.key === "ArrowLeft" && c > 0) scheduleFocus(idx(r, c - 1));
                    if (e.key === "ArrowRight" && c < 4) scheduleFocus(idx(r, c + 1));
                  }}
                />
              </Col>
            );
          })}
        </Row>
      );
    });

  return (
    <div className="container d-flex flex-column sm:flex-row">
      <div className="text-center">
        {gameStatus === "won" && <div className="text-success mb-2">🎉 You Won!</div>}
        {gameStatus === "lost" && <div className="text-danger mb-2">😞 Game Over. Word: {currentWord}</div>}

        <Button variant="primary" className="mb-4" onClick={() => dispatch(newGame())}>
          New Game
        </Button>

        {renderBoard()}

        <Button variant="success" className="mt-3" onClick={submitCurrentRow}>
          Submit Row
        </Button>
      </div>

      <VirtualKeyboard onKeyPress={handleVirtualKey} kbStatus={kbStatus} />
    </div>
  );
};

export default Wordle;
