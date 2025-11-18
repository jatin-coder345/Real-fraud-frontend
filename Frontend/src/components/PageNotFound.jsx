import React from "react";
import { useNavigate } from "react-router-dom";
import "./PageNotFound.css";

function PageNotFound() {
  const navigate = useNavigate();

  return (
    <div className="page404-container">
      <div className="page404-content">
        <div className="page404-icon">✖</div>
        <h1>Page not found</h1>
        <p>Error 404. Check the address and try again.</p>
        <button onClick={() => navigate("/home")}>Return home</button>
      </div>
    </div>
  );
}

export default PageNotFound;
