
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChefHat, SearchIcon, Star } from "lucide-react";

const Home = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
        {/* Hero Section */}
        <div className="container mx-auto px-4 pt-20 pb-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-6xl font-bold text-gray-900 animate-fade-in">
              Welcome to <span className="text-orange-500">TableBites</span>
            </h1>
            
            <p className="text-xl text-gray-600 mt-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              Experience a modern dining platform that brings together customers, 
              kitchen staff, and management in perfect harmony.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mt-8 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <Link to="/menu">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
                  <SearchIcon className="mr-2 h-5 w-5" />
                  Browse Menu
                </Button>
              </Link>
              <Link to="/kitchen">
                <Button size="lg" variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-50">
                  <ChefHat className="mr-2 h-5 w-5" />
                  Kitchen Portal
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-16">Why Choose TableBites?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={feature.title}
                  className="p-6 rounded-lg bg-gradient-to-br from-orange-50 to-white shadow-lg hover:shadow-xl transition-shadow animate-fade-in"
                  style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                >
                  <div className="flex items-center mb-4">
                    <Star className="h-6 w-6 text-orange-500 mr-2" />
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                  </div>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const features = [
  {
    title: "Smart Ordering",
    description: "Place orders easily through our digital menu system with real-time updates and customization options."
  },
  {
    title: "Kitchen Management",
    description: "Efficient order processing and kitchen management system to ensure timely food preparation."
  },
  {
    title: "Table Management",
    description: "Advanced table management with QR code integration for seamless customer seating and ordering."
  }
];

export default Home;
