
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/Layout";
import { Link } from "react-router-dom";
import { QrCode, ShoppingBag, Utensils, ChefHat, Settings } from "lucide-react";

const Home = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
        {/* Hero Section */}
        <div className="min-h-[90vh] flex flex-col items-center justify-center text-center max-w-4xl mx-auto px-4">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
              Welcome to TableBites
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Streamline your restaurant operations with our QR code-based ordering system
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-12 animate-fade-in animation-delay-200">
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1">
              <QrCode className="h-12 w-12 text-orange-500 mb-4 mx-auto" />
              <h2 className="text-xl font-semibold mb-2">Scan & Order</h2>
              <p className="text-gray-600">
                Customers scan table QR codes for instant menu access
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1">
              <ShoppingBag className="h-12 w-12 text-orange-500 mb-4 mx-auto" />
              <h2 className="text-xl font-semibold mb-2">Menu Management</h2>
              <p className="text-gray-600">
                Easily update your menu items and track inventory
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1">
              <ChefHat className="h-12 w-12 text-orange-500 mb-4 mx-auto" />
              <h2 className="text-xl font-semibold mb-2">Kitchen View</h2>
              <p className="text-gray-600">
                Real-time order tracking for kitchen staff
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 justify-center animate-fade-in animation-delay-300">
            <Link to="/admin/login">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 min-w-[200px]">
                <Settings className="mr-2 h-5 w-5" />
                Admin Portal
              </Button>
            </Link>
            <Link to="/kitchen/login">
              <Button size="lg" variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-50 min-w-[200px]">
                <Utensils className="mr-2 h-5 w-5" />
                Kitchen Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
