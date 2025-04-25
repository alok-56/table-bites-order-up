
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/Layout";
import { Link } from "react-router-dom";
import { QrCode, ShoppingBag, Utensils } from "lucide-react";

const Home = () => {
  return (
    <Layout>
      <div className="min-h-[90vh] flex flex-col items-center justify-center text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
          Welcome to <span className="text-orange-500">TableBites</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8">
          QR code-based food ordering system for restaurants
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
            <QrCode className="h-12 w-12 text-orange-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Scan & Order</h2>
            <p className="text-gray-600 text-center">
              Customers scan table QR codes for instant menu access
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
            <ShoppingBag className="h-12 w-12 text-orange-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Manage Menu</h2>
            <p className="text-gray-600 text-center">
              Easily update your menu items and track inventory
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
            <Utensils className="h-12 w-12 text-orange-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Kitchen View</h2>
            <p className="text-gray-600 text-center">
              Real-time order tracking for kitchen staff
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/admin">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
              Admin Dashboard
            </Button>
          </Link>
          <Link to="/kitchen">
            <Button size="lg" variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-50">
              Kitchen Dashboard
            </Button>
          </Link>
          <Link to="/table/1">
            <Button size="lg" variant="outline" className="border-gray-300 hover:bg-gray-50">
              Demo Customer View
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
