
import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm animate-fade-in">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-orange-500">TableBites</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/admin/login" className="text-gray-600 hover:text-orange-500 transition-colors">
              Admin
            </Link>
            <Link to="/kitchen/login" className="text-gray-600 hover:text-orange-500 transition-colors">
              Kitchen
            </Link>
          </nav>
          
          <div>
            <Link to="/admin/login">
              <button className="hidden md:inline-flex items-center justify-center rounded-md text-sm font-medium px-4 py-2 bg-orange-500 text-white hover:bg-orange-600 transition-colors">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
