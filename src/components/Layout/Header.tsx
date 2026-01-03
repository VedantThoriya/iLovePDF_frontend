import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="fixed top-0 left-0 right-0 h-[60px] bg-white border-b border-gray-200 z-50 flex items-center px-4 shadow-sm font-sans">
      <div className="flex items-center justify-between md:justify-start w-full">
        <Link to="/" replace className="flex items-center gap-2 mr-12">
          <img src="/logo.svg" alt="PaperFlow" className="h-8 md:h-10" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-12">
          <Link
            to="/merge"
            className="text-gray-900 hover:text-[#2C7A7B] font-medium text-sm lg:text-base uppercase transition-colors"
          >
            Merge PDF
          </Link>
          <Link
            to="/split"
            className="text-gray-900 hover:text-[#2C7A7B] font-medium text-sm lg:text-base uppercase transition-colors"
          >
            Split PDF
          </Link>
          <Link
            to="/compress"
            className="text-gray-900 hover:text-[#2C7A7B] font-medium text-sm lg:text-base uppercase transition-colors"
          >
            Compress PDF
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-gray-600 hover:text-gray-900"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Overlay */}
      {isMenuOpen && (
        <div className="absolute top-[60px] left-0 right-0 bg-white border-b border-gray-200 shadow-lg md:hidden flex flex-col p-4 animate-in slide-in-from-top-2">
          <Link
            to="/merge"
            className="py-3 text-gray-900 hover:text-brand-light font-medium text-base uppercase border-b border-gray-100 last:border-0"
            onClick={() => setIsMenuOpen(false)}
          >
            Merge PDF
          </Link>
          <Link
            to="/split"
            className="py-3 text-gray-900 hover:text-brand-light font-medium text-base uppercase border-b border-gray-100 last:border-0"
            onClick={() => setIsMenuOpen(false)}
          >
            Split PDF
          </Link>
          <Link
            to="/compress"
            className="py-3 text-gray-900 hover:text-brand-light font-medium text-base uppercase border-b border-gray-100 last:border-0"
            onClick={() => setIsMenuOpen(false)}
          >
            Compress PDF
          </Link>
        </div>
      )}
    </header>
  );
};
