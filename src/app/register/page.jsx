"use client";

import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import axios from "axios";

function RegisterPage() {
  const baseApiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("name", name);
    console.log("username", username);
    console.log("email", email);
    console.log("password", password);
    console.log("confirmPassword", confirmPassword)
    
    

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!username || !name || !email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    try {
      // Check if email already exists
      const checkUser = await axios.post(
        `${baseApiUrl}/api/auth/check-user`,
        {
          email: "nattkarn.p@hotmail.com",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("checkUser:", checkUser);

      if (checkUser.data && checkUser.status === 200) {
        setError("Email already exists");
        return;
      }

      const response = await axios.post(
        `${baseApiUrl}/api/auth/local/register`,
        {
          username: username,
          email: email,
          password: password,
          provider: "local",
          name: name,
          roleId: 1,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response:", response.data); // Log the response data
      
      if (response.status === 201) {
        setSuccess("User created");
        router.push("/thankyou");
        return;
      }
    } catch (error) {
      setError(error.message);
      return;
    }
  };

  //   Html Session
  return (
    <div>
      <Navbar />
      <div className="container mx-auto py-5 flex items-center justify-center">
        <form action="" onSubmit={handleSubmit}>
          <h3 className="text-3xl bold text-center">Register Page</h3>
          <hr className="my-3" />
          <input
            onChange={(e) => setUsername(e.target.value)}
            className="block bg-gray-300 p-2 my-2 rounded-md justify-center mx-auto text-black"
            type="text"
            name="username"
            placeholder="Enter your username"
          />
          <input
            onChange={(e) => setName(e.target.value)}
            className="block bg-gray-300 p-2 my-2 rounded-md justify-center mx-auto text-black"
            type="text"
            name="name"
            placeholder="Enter your name"
          />
          <input
            onChange={(e) => setEmail(e.target.value)}
            className="block bg-gray-300 p-2 my-2 rounded-md justify-center mx-auto text-black"
            type="email"
            name="email"
            placeholder="Enter your Email"
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            className="block bg-gray-300 p-2 my-2 rounded-md justify-center mx-auto text-black"
            type="password"
            name="password"
            placeholder="Enter your password"
          />
          <input
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="block bg-gray-300 p-2 my-2 rounded-md justify-center mx-auto text-black"
            type="password"
            name="password"
            placeholder="Confirm your password"
          />

          {error && <p className="text-red-500 text-center">{error}</p>}
          {success && <p className="text-green-500 text-center">{success}</p>}

          <button
            className="bg-green-500 p-2 my-2 rounded-md text-white mx-auto flex gap-2"
            type="submit"
          >
            Sign Up
          </button>
          <hr className="my-3" />
          <p>
            You have an account go to{" "}
            <Link className="text-blue-600 hover:underline" href="/login">
              Sign In
            </Link>
          </p>
        </form>
        <hr className="my-3" />
      </div>
    </div>
  );
}

export default RegisterPage;
