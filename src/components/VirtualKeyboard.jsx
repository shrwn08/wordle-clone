import React from "react";
import { Button } from "react-bootstrap";

/**
 * VirtualKeyboard
 * Props:
 *  - onKeyPress(key: string) => void
 *  - kbStatus: { [LETTER: string]: "correct" | "present" | "absent" }
 */

const KEYBOARD_ROWS = [
  ["Q","W","E","R","T","Y","U","I","O","P"],
  ["A","S","D","F","G","H","J","K","L"],
  ["ENTER","Z","X","C","V","B","N","M","BKSP"],
];

const tileClasses = (status) => {
  switch (status) {
    case "correct": return "bg-success text-white";    // green
    case "present": return "bg-warning text-dark";     // yellow
    case "absent":  return "bg-secondary text-white";  // gray
    default:        return "bg-light";                 // neutral
  }
};

const VirtualKeyboard = ({ onKeyPress = () => {}, kbStatus = {} }) => {
  const renderKey = (k) => {
    const isLetter = k.length === 1;
    const status = isLetter ? kbStatus[k.toUpperCase()] : undefined;
    const statusClass = status ? tileClasses(status) : "";
    const isSpecial = k === "ENTER" || k === "BKSP";

    const style = {
      minWidth: isSpecial ? "84px" : "44px",
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
        className={`d-inline-flex align-items-center justify-content-center ${statusClass} fw-bold`}
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
