import React from "react";
import { Button } from "react-bootstrap";


const KEYBOARD_ROWS = [
  ["Q","W","E","R","T","Y","U","I","O","P"],
  ["A","S","D","F","G","H","J","K","L"],
  ["ENTER","Z","X","C","V","B","N","M","BKSP"],
];

const tileClasses = (status) => {
  switch (status) {
    case "correct": return "bg-success text-white";
    case "present": return "bg-warning text-white";
    case "absent":  return "bg-secondary text-white";
    default:        return "bg-light";
  }
};

const VirtualKeyboard = ({ onKeyPress = () => {}, kbStatus = {} }) => {
  const renderKey = (k) => {
    const isSpecial = k === "ENTER" || k === "BKSP";
    const statusClass = k.length === 1 ? tileClasses(kbStatus[k]) : "";
    const style = {
      minWidth: isSpecial ? "74px" : "42px",
      height: "48px",
      margin: "4px",
      borderRadius: "6px",
      fontWeight: 700,
      letterSpacing: "1px",
    };

    return (
      <Button
        key={k}
        variant="light"
        className={`d-inline-flex align-items-center justify-content-center ${statusClass}`}
        style={style}
        onClick={() => onKeyPress(k)}
      >
        {k === "BKSP" ? "⌫" : k}
      </Button>
    );
  };

  return (
    <div className="w-100 mt-3">
      {KEYBOARD_ROWS.map((row, i) => (
        <div key={i} className="d-flex justify-content-center mb-1">
          {row.map(renderKey)}
        </div>
      ))}
    </div>
  );
};

export default VirtualKeyboard;
