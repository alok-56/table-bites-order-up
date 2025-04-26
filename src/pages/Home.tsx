
import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ChefHat, Settings } from "lucide-react";

const Home = () => {
  return (
    <Layout>
      <div className="min-h-[90vh] relative overflow-hidden bg-gradient-to-b from-orange-50 to-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-16 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Welcome to{" "}
              <span className="text-orange-500">TableBites</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              A modern restaurant management system for seamless dining experience
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <Link to="/admin/login">
                <Button
                  size="lg"
                  className="bg-orange-500 hover:bg-orange-600 min-w-[200px] group"
                >
                  <Settings className="mr-2 h-5 w-5 transition-transform group-hover:rotate-90" />
                  Admin Login
                </Button>
              </Link>
              
              <Link to="/kitchen/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="min-w-[200px] border-orange-500 text-orange-500 hover:bg-orange-50 group"
                >
                  <ChefHat className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                  Kitchen Login
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-3">Table Management</h3>
              <p className="text-gray-600">Efficiently manage tables and QR codes for seamless customer service.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-3">Order Processing</h3>
              <p className="text-gray-600">Real-time order management between customers, kitchen, and staff.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-3">Menu Control</h3>
              <p className="text-gray-600">Easy menu management with categories and real-time updates.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
