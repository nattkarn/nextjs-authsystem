"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "../components/Sidebar"; // Import Sidebar component

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect unauthenticated users to the login page
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Show a loading state while checking the session
  if (status === "loading") {
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
        <div className="container mx-auto py-10 flex flex-col items-center justify-center">
          <h3 className="text-4xl font-bold text-center mb-4">
            Welcome to the Admin Page
          </h3>
          <hr className="my-6 w-full max-w-md border-t-2 border-gray-300" />
          {session ? (
            <div className="text-center space-y-4">
              <p className="text-base">
                Logged in as <strong>{session.user.email}</strong>
              </p>
              <p className="text-base">
                If you are an admin, you have access to admin functionalities.
              </p>
              {/* Add admin functionalities/components here */}
            </div>
          ) : (
            <div className="text-center space-y-2">
              <p className="text-base">
                If you have an account, you are already logged in{" "}
                <a href="/login" className="text-blue-600 hover:underline">
                  Login
                </a>
              </p>
              <p className="text-base">
                If you don&apos;t have an account, you can{" "}
                <a href="/register" className="text-blue-600 hover:underline">
                  Sign Up
                </a>
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
