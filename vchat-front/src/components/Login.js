import React, { useState } from "react";
import { Link } from "react-router-dom";
import Register from "./Register";

function Login(props) {
  const [name, setName] = useState("");
  return (
    <div>
      <select
        onChange={(e) => {
          setName(e.target.value);
        }}
      >
        <option value="India">India</option>
        <option value="USA">USA</option>
      </select>
      <button onClick={props.saveName(name)} hidden />
    </div>
  );
}

export default Login;
