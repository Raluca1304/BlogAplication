import React from "react";
import { useNavigate } from "react-router";

export function LogoutButton(): JSX.Element {
  const navigate = useNavigate();

  const handleLogout = (): void => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <button className="logout-btn" onClick={handleLogout}>
      Logout
    </button>
  );
} 