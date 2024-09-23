"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Cookies from "js-cookie"; // Import js-cookie to handle cookies
import axios from "axios";

function WelcomePage() {
  const baseApiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const getToken = () => {
    return Cookies.get("Token"); // Retrieves the token from the 'Token' cookie
  };

  const { data: session, status } = useSession();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState(null);

  // Redirect if not authenticated
  if (status === "loading") {
    return <p>Loading...</p>;
  }

  const fetchProfile = async () => {
    const token = getToken(); // Get the token from the 'Token' cookie

    if (!token) {
      router.push("/login");
      return null; // Prevent rendering before redirect
    }

    try {
      const TokenExpire = await axios.get(
        `${baseApiUrl}/api/auth/local/tokenExpired?token=${token}`
      );
      if (TokenExpire.data) {
        router.push("/login");
      }
    } catch (error) {
      console.log("Error checking token expiration:", error);
      router.push("/login");
      return null; // Prevent rendering before redirect
    }

    console.log("API URL:", baseApiUrl);

    try {
      const response = await axios.get(`${baseApiUrl}/api/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Profile Response:", response.data.user[0]);
      setUserProfile(response.data.user[0]); // Set the user profile data
    } catch (error) {
      console.log("Error fetching profile:", error);
    }
  };

  if (!session) {
    router.push("/login");
    return null; // Prevent rendering before redirect
  }

  const handleEditClick = () => {
    // Redirect to the edit user page
    router.push(`/profile/edit/${session.user?.id}`);
  };
  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <main>
    <Navbar session={session} />
    <section className="container mx-auto py-8 flex flex-col items-center justify-center">
      <h3 className="text-4xl font-bold mb-4">
        Welcome, {session.user?.name}!
      </h3>
      <p className="text-lg text-black mb-4">Email: {session.user?.email}</p>
      <hr className="my-6 border-t-2 border-black" />
      {userProfile ? (
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
          <h2 className="text-2xl font-semibold text-center mb-4">
            Profile Details
          </h2>
          <div className="mb-4">
            <span className="font-medium">Name:</span>{" "}
            <span className="text-gray-700">{userProfile.name}</span>
          </div>
          <div className="mb-4">
            <span className="font-medium">Email:</span>{" "}
            <span className="text-gray-700">{userProfile.email}</span>
          </div>
          <div className="mb-4">
            <span className="font-medium">Role:</span>{" "}
            <span className="text-gray-700">{userProfile.role}</span>
          </div>
          <div className="mb-4">
            <span className="font-medium">Phone:</span>{" "}
            <span className="text-gray-700">{userProfile.tel}</span>
          </div>
          <div className="mb-4">
            <span className="font-medium">Account Confirmed:</span>{" "}
            <span
              className={`text-${
                userProfile.confirm ? "green" : "red"
              }-500 font-bold`}
            >
              {userProfile.confirm ? "Yes" : "No"}
            </span>
          </div>
          <div className="mb-4">
            <span className="font-medium">Member Since:</span>{" "}
            <span className="text-gray-700">
              {new Date(userProfile.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="mb-4">
            <span className="font-medium">Last Updated:</span>{" "}
            <span className="text-gray-700">
              {new Date(userProfile.updatedAt).toLocaleDateString()}
            </span>
          </div>
          <button
            onClick={handleEditClick}
            className="bg-blue-500 text-white p-2 rounded-md mt-4 w-full hover:bg-blue-600"
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <p className="text-red-500">Loading profile data...</p>
      )}
    </section>
  </main>
  );
}

export default WelcomePage;
