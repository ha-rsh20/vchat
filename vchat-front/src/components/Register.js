import React from "react";

function Register(props) {
  return (
    <div>
      <span>{props.name}</span>
      <span>Name</span>
      <input type="text" />
      <span>Password</span>
      <input type="password" />
    </div>
  );
}

export default Register;
