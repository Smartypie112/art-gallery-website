import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

function ThankYou() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-amber-50 p-6">

      <FaCheckCircle className="text-green-600 text-8xl mb-6" />

      <h1 className="text-4xl font-bold text-red-900 mb-4 text-center">
        Thank You!
      </h1>

      <p className="text-lg text-gray-700 text-center mb-6">
        Your exhibition submission has been received successfully. We will contact you soon.
      </p>

      <Link
        to=""
        className="bg-red-900 text-white py-2 px-6 rounded-lg hover:bg-red-800 transition"
      >
        Back to Home
      </Link>

    </div>
  );
}

export default ThankYou;