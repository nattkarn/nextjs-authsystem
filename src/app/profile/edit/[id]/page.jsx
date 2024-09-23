"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Cookies from "js-cookie"; // Import js-cookie to handle cookies
import axios from "axios";

function EditUserPage() {
  const baseApiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const getToken = () => {
    return Cookies.get("Token"); // Retrieves the token from the 'Token' cookie
  };

  const { data: session, status } = useSession();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    tel: "",
    role: "",
  });

  // Redirect if not authenticated
  if (status === "loading") {
    return <p>Loading...</p>;
  }

  const checkToken = async () => {
    const tokenExpired = await axios.get(
      `${baseApiUrl}/api/auth/local/tokenExpired?token=${getToken()}`
    )
    if (tokenExpired.data) {
      router.push("/login");
    }
  }
  const fetchProfile = async () => {
    checkToken()
    const token = getToken(); // Get the token from the 'Token' cookie

    try {
      const response = await axios.get(`${baseApiUrl}/api/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const user = response.data.user[0]; // Assuming the API returns an array of users
      setUserProfile(user);
      setFormData({
        name: user.name,
        email: user.email,
        tel: user.tel,
        role: user.role,
      });
    } catch (error) {
      console.log("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    if (session) {
      fetchProfile();
    } else {
      router.push("/login");
    }
  }, [session]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();

    try {
      const response = await axios.patch(
        `${baseApiUrl}/api/users/update/${session.user.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        alert("Profile updated successfully!");
        router.push("/profile"); // Redirect to profile page after successful update
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  if (!session) {
    return null; // Prevent rendering before redirect
  }

  return (
    <main>
      <Navbar session={session} />
      <section className="container mx-auto py-8 flex flex-col items-center justify-center">
        <h3 className="text-4xl font-bold mb-4">Edit Profile</h3>
        <hr className="my-6 border-t-2 border-black" />
        {userProfile ? (
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-md rounded-lg p-6 w-full max-w-md"
          >
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="block bg-gray-300 p-2 rounded-md w-full text-black"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="block bg-gray-300 p-2 rounded-md w-full text-black"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Phone
              </label>
              <input
                type="text"
                name="tel"
                value={formData.tel}
                onChange={handleChange}
                className="block bg-gray-300 p-2 rounded-md w-full text-black"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Role
              </label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="block bg-gray-300 p-2 rounded-md w-full text-black"
              />
            </div>
            <button
              type="submit"
              className="bg-green-500 p-2 rounded-md text-white w-full"
            >
              Update Profile
            </button>
          </form>
        ) : (
          <p className="text-red-500">Loading profile data...</p>
        )}
      </section>
    </main>
  );
}

export default EditUserPage;
