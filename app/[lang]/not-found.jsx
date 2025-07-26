import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="font-bold text-3xl text-red-500 mb-4">Page not found</h1>
      <div className="text-lg mb-6">The page you are requesting was not found!</div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-24 w-24  mb-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        />
      </svg>
      <Link
        href="/"
        className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300 ease-in-out"
      >
        Go Back to Home
      </Link>
    </div>
  );
}
