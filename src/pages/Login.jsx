import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { isTokenValid } from "../utils/auth";
const Login = () => {

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

 

useEffect(() => {

  if (isTokenValid()) {
    navigate("/dashboard");
  }

}, [navigate]);

 const handleLogin = async () => {
  try {

    const res = await axios.post("http://localhost:5000/auth/login", {
      email,
      password,
      rememberMe
    });


    if (!email.includes("@")) {
  alert("Please enter a valid email");
  return;
}

if (!password) {
  alert("Password is required");
  return;
}
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("userId", res.data.userId);
    localStorage.setItem("userName", res.data.name);

    alert("Login successful");

    navigate("/dashboard");

  } catch (err) {
    alert(err.response?.data?.message || "Login failed");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center px-4
bg-[radial-gradient(circle_at_1px_1px,#d1d5db_1px,transparent_0)] bg-[size:40px_40px]">

      <div className="w-full max-w-sm bg-gradient-to-b from-slate-800 to-slate-900 shadow-xl p-8 text-white">

        <div className="flex justify-center mb-4">
          <img src="/assets/logo.png" alt="Logo" className="h-14" />
        </div>

        <h2 className="text-center text-xl font-semibold mb-6">
          Login
        </h2>

        <label className="text-sm block mb-1">Email</label>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 mb-4 rounded bg-white text-black"
        />

       <label className="text-sm block mb-1">Password</label>

<div className="relative mb-3">

  <input
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="w-full px-3 py-2 pr-10 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#e68c11]"
  />

  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
  >
    {showPassword ? (
      <EyeSlashIcon className="h-5 w-5" />
    ) : (
      <EyeIcon className="h-5 w-5" />
    )}
  </button>

</div>

        <div className="flex items-center mb-6">

          <input
            type="checkbox"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
            className="mr-2"
          />

          <span className="text-sm">Remember me</span>

        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-[#e68c11] hover:bg-[#393434] transition py-2 rounded font-semibold"
        >
          Login
        </button>

        <p className="text-center text-sm mt-4">

          Don’t have an account?{" "}

          <Link
            to="/signup"
            className="text-[#e68c11] hover:underline"
          >
            Register here
          </Link>

        </p>

      </div>

    </div>
  );
};

export default Login;