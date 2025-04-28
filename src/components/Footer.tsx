
import { Link } from "react-router-dom";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 animate-fade-in">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">TableBites</h3>
            <p className="mb-4 text-gray-400">
              A modern restaurant management system for seamless dining experiences.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-orange-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-orange-400 transition-colors">
                  Admin Portal
                </Link>
              </li>
              <li>
                <Link to="/kitchen/login" className="hover:text-orange-400 transition-colors">
                  Kitchen Display
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
            <p className="text-gray-400">
              123 Restaurant Street<br />
              Foodie City, FC 12345<br />
              support@tablebites.com
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500">
          <p>© {currentYear} TableBites. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
