import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
const API_URL = import.meta.env.VITE_API_URL;
const Signup = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      const res = await axios.post(`${API_URL}/auth/signup`, {
        name,
        email,
        password
      });

      alert(res.data.message);
      navigate("/login");

    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4
bg-[radial-gradient(circle_at_1px_1px,#d1d5db_1px,transparent_0)] bg-[size:40px_40px]">
      <div className="w-full max-w-sm bg-gradient-to-b from-slate-800 to-slate-900 shadow-xl p-8 text-white">

        <div className="flex justify-center mb-4">
          <img src="/assets/logo.png" alt="UnsaidTalks Logo" className="h-14" />
        </div>

        <h2 className="text-center text-xl font-semibold mb-1">
          Create new account
        </h2>

        <p className="text-center text-sm text-gray-300 mb-6">
          Already have an account?{" "}
          <Link to="/login" className="text-[#e68c11] hover:underline">
            Sign in
          </Link>
        </p>

        {/* NAME */}
        <label className="text-sm mb-1 block">Full Name</label>
        <div className="relative mb-4">
          <UserIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full pl-10 pr-3 py-2 rounded bg-white text-black outline-none"
          />
        </div>

        {/* EMAIL */}
        <label className="text-sm mb-1 block">Email</label>
        <div className="relative mb-4">
          <EnvelopeIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-3 py-2 rounded bg-white text-black outline-none"
          />
        </div>

        {/* PASSWORD */}
        <label className="text-sm mb-1 block">Password</label>
        <div className="relative mb-6">
          <LockClosedIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-10 py-2 rounded bg-white text-black outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        <button
          onClick={handleSignup}
          className="w-full bg-[#e68c11] hover:bg-[#d07b0e] transition text-white font-semibold py-2 rounded"
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default Signup;