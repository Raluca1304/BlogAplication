import React, { JSX } from 'react';
import { NavLink } from 'react-router';

export function Home(): JSX.Element {
  return (
    <div className="home-page">
      <h2>Welcome to our Blog!</h2>
      <div className="home-images">
        <NavLink to="/admin/home">
        </NavLink>
      </div>
    </div>
  );
}