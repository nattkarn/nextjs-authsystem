"use client";

import React from "react";
import Navbar from "../components/Navbar.jsx";

function WelcomePage() {
  return (
    <main>
      <Navbar />
      <section className="container mx-auto py-12 flex flex-col items-center justify-center bg-gray-50 rounded-lg shadow-md px-8">
        <h3 className="text-4xl font-bold mb-6 text-gray-800 text-center">
          Welcome, and Thank You for Registering!
        </h3>
        <hr className="my-4 w-full max-w-lg border-t-2 border-gray-300" />
        <p className="text-lg text-gray-700 text-center leading-relaxed">
          An email with an activation link has been sent to your registered email address. Please check your inbox and follow the instructions to activate your account.
        </p>
        <hr className="my-4 w-full max-w-lg border-t-2 border-gray-300" />
        <div className="text-center space-y-4">
          <p className="text-base text-gray-700">
            If you already have an account, you can{" "}
            <a
              href="./login"
              className="text-blue-600 hover:underline font-semibold"
            >
              login here
            </a>.
          </p>
          <p className="text-base text-gray-700">
            For any assistance, feel free to contact our support team.
          </p>
        </div>
      </section>
    </main>
  );
}

export default WelcomePage;
