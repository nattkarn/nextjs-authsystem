"use client";

import React from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { FaGithub } from "react-icons/fa";
import Image from "next/image";

import logoImage from "../../public/images/logoipsum-288.png"; // Adjust the path as necessary

function Sidebar({ session }) {
  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen flex flex-col justify-between p-4">
      <div>
        {/* Logo */}
        <Link href="/" className="mb-6 block text-center">
          <Image
            src={logoImage}
            alt="Logo"
            width={150}
            height={75}
            className="cursor-pointer"
          />
        </Link>

        {/* Navigation Links */}
        <nav className="flex-1">
          <ul className="space-y-4">
            <li>
              <Link href="/" className="block px-4 py-2 rounded hover:bg-gray-700">
                Home
              </Link>
            </li>
            <li>
              <Link href="/admin/manage-user" className="block px-4 py-2 rounded hover:bg-gray-700">
                Manage User
              </Link>
            </li>
            <li>
              <Link href="/category" className="block px-4 py-2 rounded hover:bg-gray-700">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/api" className="block px-4 py-2 rounded hover:bg-gray-700">
                {/* API */}
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Session and GitHub Links */}
      <div className="flex flex-col items-center space-y-2 mt-4">
        <a
          href="https://github.com/nattkarn"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-black text-white px-3 py-2 rounded-md text-sm w-full flex justify-center items-center gap-2 hover:bg-gray-700"
        >
          About Me
          <FaGithub size={20} />
        </a>

        {session ? (
          <>
            <p className="px-3 py-2 text-center">{session.user.name}</p>
            <button
              onClick={() => signOut()}
              className="bg-red-500 text-white px-3 py-2 rounded-md text-sm w-full hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="block px-4 py-2 rounded hover:bg-gray-700 text-center w-full"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="block px-4 py-2 rounded hover:bg-gray-700 text-center w-full"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
