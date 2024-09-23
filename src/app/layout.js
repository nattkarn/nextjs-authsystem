import localFont from "next/font/local";
import "./globals.css";
import SessionProvider from "./components/SessionProvider";
import { getServerSession } from "next-auth";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  icons: {
    icon: '/favicon.ico', // /public path
  },
  title: "NextAuth",
  description: "NextAuth",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession();
  return (
    <html lang="en">

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  );
}
