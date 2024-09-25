"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "../../../../components/Sidebar"; // Import Sidebar component
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
    activated: false,
    blocked: false,
  });

  // Redirect if not authenticated
  if (status === "loading") {
    return <p>Loading...</p>;
  }

  const checkToken = async () => {
    const tokenExpired = await axios.get(
      `${baseApiUrl}/api/auth/local/tokenExpired?token=${getToken()}`
    );
    if (tokenExpired.data) {
      router.push("/login");
    }
  };

  const fetchProfile = async () => {
    checkToken();
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
        activated: user.confirm, // Assuming the user object contains 'confirm' status
        blocked: user.blocked, // Assuming the user object contains 'blocked' status
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
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();

    try {
      console.log("formData", formData);
      const response = await axios.patch(
        `${baseApiUrl}/api/users/update/${session.user.id}`, // Adjust the URL if necessary
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
        router.push("/admin/manage-user"); // Redirect to profile page after successful update
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
    <main className="flex">
      <Sidebar session={session} /> {/* Sidebar is displayed here */}
      <section className="flex-1 p-6 flex flex-col items-center justify-center">
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
            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                name="activated"
                checked={formData.activated}
                onChange={handleChange}
                className="mr-2"
              />
              <label className="text-gray-700">Activated</label>
            </div>
            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                name="blocked"
                checked={formData.blocked}
                onChange={handleChange}
                className="mr-2"
              />
              <label className="text-gray-700">Blocked</label>
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
