import { FaInstagram, FaFacebook } from "react-icons/fa";

function Navbar() {
  return (
    <nav className="bg-red-900 text-white shadow-md">

      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">

        {/* Logo + Name */}
        <div className="flex items-center gap-3">
          <img
            src="/assets/logo.png"
            alt="Manikarnika Art Gallery"
            className="h-10 w-10 rounded-full"
          />

          <h1 className="text-lg font-semibold text-yellow-400">
            Manikarnika Art Gallery
          </h1>
        </div>

        {/* Menu */}
        <div className="hidden md:flex gap-6 font-medium">

          <a href="#" className="hover:text-yellow-400">
            Home
          </a>

          <a href="#" className="hover:text-yellow-400">
            Exhibition
          </a>

          <a href="#" className="hover:text-yellow-400">
            Artists
          </a>

          <a href="#" className="hover:text-yellow-400">
            Contact
          </a>

        </div>

      </div>

    </nav>
  );
}

export default Navbar;