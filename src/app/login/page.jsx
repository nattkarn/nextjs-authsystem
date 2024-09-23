"use client";

import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie"; // Import js-cookie

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();



  const handleSubmit = async (e) => {
    e.preventDefault();


    if (!email || !password) {
      setError("All fields are required");
      return;
    }


    try{

      const response = await signIn("credentials", {
        redirect: false,
        email,
        password
      });

      // Handle errors from NextAuth
      if (!response.ok) {
        setError(response.error || "Invalid email or password.");
        return;
      }

      const getToken = await axios.post(
        'http://localhost:5000/api/auth/local/login',
        {
          email: email,
          password: password,
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
        }
      );
  
      

      // Check if the response from the NestJS API contains a token
      if (getToken.data && getToken.data.jwt) {
        console.log('getToken:', getToken.data);
        // Set the token in a cookie named 'Token'
        Cookies.set("Token", getToken.data.jwt, { expires: 7 }); // Set the token cookie with a 7-day expiration
      }

      if(response.ok){
        router.push("/profile");

      }



    }catch(error){
      console.log(error)
    }

  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto py-5 flex items-center justify-center">
        <form action="" onSubmit={handleSubmit}>
          <h3 className="text-3xl bold text-center">Login Page</h3>
          <hr className="my-3" />
          <input
            onChange={(e) => setEmail(e.target.value)}
            className="block bg-gray-300 p-2 my-2 rounded-md justify-center mx-auto text-black"
            type="text"
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
          {error && <p className="text-red-500">{error}</p>}
          <button
            className="bg-green-500 p-2 my-2 rounded-md text-white mx-auto flex gap-2 "
            type="submit"
          >
            Sign In
          </button>

          {/* Google Sign in Button */}
          <button
            type="button"
            onClick={() => signIn("google")}
            className="w-fit mx-auto flex gap-2 bg-white border border-gray-300 text-gray-700 py-2 rounded px-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 488 512"
              width="20"
              height="20"
            >
              <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
            </svg>
            Sign in with Google
          </button>

          <hr className="my-3" />
          <p>
            Already have an account?{" "}
            <Link
              className="text-blue-600 hover:underline"
              href="/register"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
