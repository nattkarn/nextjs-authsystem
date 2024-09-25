"use client";

import React from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { FaGithub, FaUserShield } from "react-icons/fa"; // Import GitHub and Admin icons
import Image from "next/image";

import logoImage from "../../public/images/logoipsum-288.png"; // Path to your logo image

function Navbar({ session }) {
  console.log("session",session);
  return (
    <nav className="bg-[#333] text-white p-5">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          {/* Left side (Logo and Navigation Links) */}
          <div className="flex items-center gap-5">
            <Link href="/" className="text-2xl font-bold">
              <Image
                src={logoImage} // Replace this with your logo path
                alt="Logo"
                width={150} // Adjust the height and width as needed
                height={75}
              />
            </Link>
            <Link href="/">Home</Link>
            <Link href="/products">Products</Link>
            <Link href="/category">Category</Link>
            <Link href="/api">API</Link>
          </div>

          {/* Right side (GitHub, Sign In/Sign Up or Logout) */}
          <ul className="flex items-center">
            {/* GitHub Icon linking to your GitHub profile */}
            <li className="mx-3 bg-black text-white px-3 py-2 rounded-md text-sm">
              <a
                href="https://github.com/nattkarn"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                About Me
                <FaGithub size={20} />
              </a>
            </li>
            {!session ? (
              <>
                <li className="mx-3">
                  <Link href="/login">Login</Link>
                </li>
                <li className="mx-3">
                  <Link href="/register">Sign Up</Link>
                </li>
              </>
            ) : (
              <>
                <p className="flex items-center px-3 py-2 gap-2">
                  <Link href="/profile">{session.user.name}</Link>
                  
                  {/* <p>role: </p> */}
                  {/* Display Admin Icon if the user is an Admin */}
                  {session.user.role === "Admin" && (
                    <Link href="/admin"><FaUserShield title="Admin" size={20} className="text-yellow-500" /></Link>
                  )}
                </p>
                <li className="bg-red-500 text-white px-3 py-2 rounded-md text-sm my-2">
                  <a onClick={() => signOut()} className="cursor-pointer">
                    Logout
                  </a>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
