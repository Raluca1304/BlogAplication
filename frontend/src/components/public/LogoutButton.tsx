import React, { JSX } from "react";
import { NavLink, useNavigate } from "react-router";
import { authService } from "./authService";
import { Button } from "@/components/ui/button";

export function LogoutButton(): JSX.Element {
  const navigate = useNavigate();
  const userInfo = authService.getUserInfo();

  const handleLogout = (): void => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      authService.logout();
      navigate("/home");
    }
  };

  return (
    <div className="logout-section">
      {userInfo.isAuthenticated && (
        <div className="user-info">
        </div>
      )}
      <Button   
       className="logout-btn" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
} 