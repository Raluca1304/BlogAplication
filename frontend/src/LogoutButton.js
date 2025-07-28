import React from "react";
import { useNavigate } from "react-router";

export function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    navigate("/login");
  };

  return (
    <button className="logout-btn" onClick={handleLogout}>
      Logout
    </button>
  );
}
