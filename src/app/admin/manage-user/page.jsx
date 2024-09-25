"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar"; // Import Sidebar component
import Link from "next/link"; // Import Link for client-side navigation

export default function UserManagePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Redirect unauthenticated users to the login page
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Fetch users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users/get-all-user");
        const data = await response.json();
        console.log("data", data);
        setUsers(data);
        setFilteredUsers(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchUsers();
    }
  }, [status]);

  // Filter users based on search query
  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.nameRole.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  // Show a loading state while checking the session or fetching data
  if (status === "loading" || loading) {
    return (
      <main className="container mx-auto py-10 flex flex-col items-center justify-center">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="flex">
      <Sidebar session={session} /> {/* Sidebar is displayed here */}
      <section className="flex-1 p-6">
        <h3 className="text-4xl font-bold text-left mb-4">User Management</h3>
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-4 p-2 border border-gray-300 rounded w-full"
        />
        <div className="container mx-auto py-10">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">ID</th>
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">Email</th>
                <th className="border border-gray-300 px-4 py-2">Role</th>
                <th className="border border-gray-300 px-4 py-2">Activated</th>
                <th className="border border-gray-300 px-4 py-2">Block</th>
                <th className="border border-gray-300 px-4 py-2">Edit</th> {/* Updated Header */}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2">{user.id}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.role.nameRole}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.confirmed ? "Yes" : "No"}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.blocked ? "Yes" : "No"}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <Link href={`/admin/manage-user/edit/${user.id}`} className="text-blue-500 hover:underline">
                      Edit
                    </Link>
                  </td> {/* Added Edit Link */}
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan="7" /* Updated colSpan to match the number of columns */
                    className="border border-gray-300 px-4 py-2 text-center"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
