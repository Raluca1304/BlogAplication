import React, { JSX } from "react";
import { NavLink, useNavigate } from "react-router";
import { authService } from "./authService";

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
        <div className="user-info" style={{ marginBottom: '10px', fontSize: '0.9em', color: '#ccc' }}>
          {/* <button className="profile-btn" onClick={() => window.location.href = '/profile'}>
            <div> Your profile </div>
          </button> */}
          {/* <NavLink to="/profile">
            <div> Your profile </div>
            {/* <div> Username: {userInfo.username}</div>
            <div> Your role: {userInfo.role?.replace('ROLE_', '')}</div> */}
          {/* </NavLink> */}
          {/* <div> Username: {userInfo.username}</div>
          <div> Your role: {userInfo.role?.replace('ROLE_', '')}</div> */}
        </div>
      )}
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
} 