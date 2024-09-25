// pages/index.js
import Head from 'next/head';

export default function Home() {
  return (
    <div className="flex h-screen bg-gradient-to-r from-purple-700 via-purple-500 to-blue-500">
      <Head>
        <title>Portfolio - Learning Robo</title>
        <meta name="description" content="Portfolio of Learning Robo - Web Developer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full">
        {/* Profile Section */}
        <div className="flex flex-1 items-center justify-center bg-gray-900">
          <div className="text-center bg-gray-800 p-8 rounded-lg text-white">
            <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-4"></div>
            <h1 className="text-2xl mb-2">Learning Robo</h1>
            <p className="text-sm mb-4">WEB DEVELOPER</p>
            <div className="flex justify-center gap-4">
              <a href="#" className="text-2xl hover:text-blue-400">🔗</a>
              <a href="#" className="text-2xl hover:text-blue-400">🔗</a>
              <a href="#" className="text-2xl hover:text-blue-400">🔗</a>
              <a href="#" className="text-2xl hover:text-blue-400">🔗</a>
            </div>
          </div>
        </div>

        {/* Introduction Section */}
        <div className="flex flex-1.5 flex-col justify-center p-10 bg-gray-800 text-white">
          <h1 className="text-5xl mb-2">HELLO!</h1>
          <p className="text-xl mb-6">Here's who I am & what I do</p>
          <div className="flex gap-4 mb-4">
            <button className="bg-purple-700 hover:bg-blue-500 text-white py-2 px-4 rounded">
              RESUME / CV
            </button>
            <button className="bg-purple-700 hover:bg-blue-500 text-white py-2 px-4 rounded">
              GIT HUB
            </button>
          </div>
          <p className="text-gray-400 mb-2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus, aspernatur?
          </p>
          <p className="text-gray-400">
            Made with ❤️ by Learning Robo
          </p>
        </div>
      </main>
    </div>
  );
}
