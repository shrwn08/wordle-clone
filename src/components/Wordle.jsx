import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { newGame, setAttempt, submitRow } from "../redux/slices/wordleSlice";
import { Words } from "../redux/slices/data";
import { Button, Row, Col, Form } from "react-bootstrap";

const Wordle = () => {
  const dispatch = useDispatch();
  const {
    currentWord,
    attempts,
    evaluations,
    currentRow,
    gameStatus,
    kbStatus,
  } = useSelector((state) => state);
  const inputRefs = useRef([]);

    useEffect(() => {
    dispatch(newGame());
  }, [dispatch]);

  const idx = (r, c) => r * 5 + c; // convert row/col → flat index
  const scheduleFocus = (flatIndex) => requestAnimationFrame(() => inputRefs.current[flatIndex]?.focus());

   // Map tile status to Bootstrap classes
  const tileClasses = (status) => {
    switch (status) {
      case "correct": return "bg-success text-white border-success";
      case "present": return "bg-warning text-white border-warning";
      case "absent":  return "bg-secondary text-white border-secondary";
      default: return "bg-white border border-secondary";
    }
  };

   const handleChange = (row, col, value) => {
    if (gameStatus !== "playing" || row !== currentRow) return;
    dispatch(setAttempt ({ row, col, value: value.toUpperCase().slice(-1) }));
    scheduleFocus(idx(row, col + 1)); // move focus to next column
  };


  const evaluateGuess = (target, guess) => {
    const result = Array(5).fill("absent");
    const tArr = target.split(""), gArr = guess.split("");
    
    // Pass 1: correct letters
    for (let i=0;i<5;i++){if(gArr[i]===tArr[i]){result[i]="correct";tArr[i]=gArr[i]=null;}}
    
    // Pass 2: present letters
    const rem={}; tArr.forEach(l=>{if(l) rem[l]=(rem[l]||0)+1;});
    gArr.forEach((g,i)=>{if(g){if(rem[g]>0){result[i]="present";rem[g]-=1;}}});
    return result;
  };


  // Merge tile evaluation into keyboard map
  const updateKb = (prevMap, guess, evalArr) => {
    const map = { ...prevMap };
    evalArr.forEach((status, i) => {
      const l = guess[i];
      if (!l) return;
      if (!map[l] || (status==="correct") || (map[l]==="absent" && status==="present")) map[l] = status;
    });
    return map;
  };


  const submitCurrentRow = () => {
    const guess = attempts[currentRow];
    if (!Words.includes(guess.toLowerCase())) {
      alert("Invalid word entered!");
      return;
    }
    const evalArr = evaluateGuess(currentWord, guess);
    const kbMap = updateKb(kbStatus, guess, evalArr);
    dispatch(submitRow({ row: currentRow, evalArr, kbMap }));
    scheduleFocus(idx(currentRow + 1, 0));
  };

  const renderBoard = () => Array(6).fill(0).map((_, r) => (
    <Row key={r} className="mb-2 justify-content-center">
      {Array(5).fill(0).map((_, c) => {
        const value = attempts[r][c] || "";
        const status = evaluations[r] ? evaluations[r][c] : "";
        return (
          <Col xs="auto" key={c}>
            <Form.Control
              ref={(el)=>inputRefs.current[idx(r,c)]=el}
              type="text"
              maxLength={1}
              className={`text-center  fw-bold ${tileClasses(status)}`}
              style={{ width: "45px", height : "45px" }}
              value={value}
              disabled={r!==currentRow || gameStatus!=="playing"}
              onChange={e=>handleChange(r,c,e.target.value)}
              onKeyDown={e=>{
                if(e.key==="Enter") submitCurrentRow();
                if(e.key==="Backspace" && c>0) scheduleFocus(idx(r,c-1))
              }}
            />
          </Col>
        );
      })}
    </Row>
  ));

  
return (
    <div className="container text-center">
     

      {/* Display game result */}
      {gameStatus==="won" && <div className="text-success mb-2">🎉 You Won!</div>}
      {gameStatus==="lost" && <div className="text-danger mb-2">😞 Game Over. Word: {currentWord}</div>}

      {/* New Game Button */}
      <Button variant="primary" className="mb-4" onClick={()=>dispatch(newGame())}>New Game</Button>

      {/* Game Board */}
      {renderBoard()}

      {/* Submit Row Button */}
      <Button variant="success" className="mt-3" onClick={submitCurrentRow}>Submit Row</Button>
    </div>
  );
};


export default Wordle;
