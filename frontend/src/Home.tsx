import React from 'react';
import { NavLink } from 'react-router';

export function Home(): JSX.Element {
  return (
    <div className="home-page">
      <h2>Welcome to yours and many others Blog!</h2>
      <div className="home-images">
        {/* <img src="https://via.placeholder.com/200x120?text=Imagine+1" alt="Placeholder 1" />
        <img src="https://via.placeholder.com/200x120?text=Imagine+2" alt="Placeholder 2" />
        <img src="https://via.placeholder.com/200x120?text=Imagine+3" alt="Placeholder 3" /> */}
        <NavLink to="/posts">
          
        </NavLink>
      </div>
    </div>
  );
} 