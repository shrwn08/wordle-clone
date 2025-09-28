import { Button } from "react-bootstrap"; // Correct import
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap CSS is imported

const Header = () => {
  return (
    <div className="d-flex justify-content-between align-items-center px-4 py-3 mb-4 border-bottom">
      <h1
        className="display-4 fw-bold mb-0"
        style={{ color: "#333", letterSpacing: "2px", fontSize: "2rem" }}
      >
        WORDLE
      </h1>
      <div className="d-flex gap-2">
        <Button variant="outline-success">Sign In</Button>
        <Button variant="outline-success">Sign Up</Button>
      </div>
    </div>
  );
};

export default Header;
