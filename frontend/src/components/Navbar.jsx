import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{background:"#2563eb", padding:"1rem 2rem", display:"flex", gap:"1.5rem"}}>
      <Link to="/" style={{color:"white", fontWeight:"bold", textDecoration:"none"}}>JobPortal</Link>
      <Link to="/login" style={{color:"white", textDecoration:"none"}}>Login</Link>
      <Link to="/register" style={{color:"white", textDecoration:"none"}}>Register</Link>
      <Link to="/dashboard" style={{color:"white", textDecoration:"none"}}>Dashboard</Link>
    </nav>
  );
}
export default Navbar;