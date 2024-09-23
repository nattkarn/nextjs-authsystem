"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar.jsx";
import { redirect, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

function ActivationPage({ params }) {
  const baseApiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const token = params.token;
  console.log("Token:", token);

  if (!token) {
    redirect("/");
  }

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [hasFetched, setHasFetched] = useState(false); // Track if fetch has been performed

  const router = useRouter();

  const fetchActivation = async (token) => {
    try {
      const response = await axios.get(
        `${baseApiUrl}/api/auth/local/activation?token=${token}`
      );

      // Handle successful response
      if (response.status === 200) {
        setSuccess(true);
        setMessage(
          response.data.message ||
            "Your account has been successfully activated!"
        );
      } else {
        setSuccess(false);
        setMessage(response.data.message || "Activation failed.");
      }
    } catch (error) {
      setSuccess(false);
      setMessage(
        error.response?.data?.message || "An error occurred during activation."
      );
    }
  };

  useEffect(() => {
    if (!hasFetched) {
      fetchActivation(token);
      setHasFetched(true); // Set fetch state to prevent further fetches
    }
  }, [token, hasFetched]); // Add `hasFetched` to dependency array

  return (
    <main>
      <Navbar />
      <section className="container mx-auto py-12 flex flex-col items-center justify-center bg-white rounded-lg shadow-lg px-8">
        <h3
          className={`text-4xl font-bold mb-6 text-center ${
            success ? "text-green-600" : "text-red-600"
          }`}
        >
          {success ? "Account Activated!" : "Activation Failed"}
        </h3>
        <hr className="my-4 w-full max-w-lg border-t-2 border-gray-300" />
        <p
          className={`text-lg text-center leading-relaxed ${
            success ? "text-gray-700" : "text-red-500"
          }`}
        >
          {message}
        </p>
        <hr className="my-4 w-full max-w-lg border-t-2 border-gray-300" />
        {success && (
          <div className="text-center space-y-4">
            <p className="text-base text-gray-700">
              You can now{" "}
              <Link
                href="/login"
                className="text-blue-600 hover:underline font-semibold"
              >
                login here
              </Link>
              .
            </p>
            <p className="text-base text-gray-700">
              For any assistance, feel free to contact our support team.
            </p>
          </div>
        )}
        {!success && (
          <div className="text-center space-y-4">
            <p className="text-base text-red-500">
              Please try activating your account again or contact support if the
              problem persists.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

export default ActivationPage;
