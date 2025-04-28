
import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { ChefHat, Settings, Utensils, Coffee, Clock, Users } from "lucide-react";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-orange-50 to-white py-16 md:py-24">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 tracking-tight">
              Welcome to{" "}
              <span className="text-orange-500 relative">
                TableBites
                <span className="absolute bottom-0 left-0 w-full h-2 bg-orange-300 opacity-50 -z-10"></span>
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
              A modern restaurant management system for seamless dining experiences from ordering to service
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <Link to="/admin/login">
                <Button
                  size="lg"
                  className="bg-orange-500 hover:bg-orange-600 min-w-[200px] group transition-all duration-300 hover:shadow-lg"
                >
                  <Settings className="mr-2 h-5 w-5 transition-transform group-hover:rotate-90 duration-300" />
                  Admin Login
                </Button>
              </Link>
              
              <Link to="/kitchen/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="min-w-[200px] border-orange-500 text-orange-500 hover:bg-orange-50 group transition-all duration-300 hover:shadow-lg"
                >
                  <ChefHat className="mr-2 h-5 w-5 transition-transform group-hover:scale-110 duration-300" />
                  Kitchen Login
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Wave Separator */}
          <div className="w-full h-24 mt-16 relative">
            <svg className="absolute bottom-0 w-full h-24" viewBox="0 0 1440 74" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 24L60 29.3C120 34.7 240 45.3 360 50.7C480 56 600 56 720 45.3C840 34.7 960 13.3 1080 8C1200 2.7 1320 13.3 1380 18.7L1440 24V74H1380C1320 74 1200 74 1080 74C960 74 840 74 720 74C600 74 480 74 360 74C240 74 120 74 60 74H0V24Z" fill="white"/>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 animate-fade-in">
            Complete Restaurant Management
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={feature.title} 
                className="border border-gray-100 shadow-md hover:shadow-xl transition-all duration-500 overflow-hidden group"
              >
                <CardContent className="pt-6">
                  <div className="bg-orange-100 text-orange-600 rounded-full w-12 h-12 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 animate-fade-in">
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div 
                key={step.title}
                className="flex flex-col items-center text-center animate-fade-in"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-orange-500 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                    {index + 1}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-orange-300 -z-10"></div>
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Call To Action */}
      <div className="bg-orange-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-fade-in">
            Ready to Transform Your Restaurant Operations?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Experience the power of TableBites today and elevate your dining service
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <Link to="/admin/login">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-orange-500 hover:bg-gray-100 min-w-[200px]"
              >
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

// Data for the features section
const features = [
  {
    title: 'Table Management',
    description: 'Efficiently manage tables with QR codes for seamless customer service and digital ordering.',
    icon: <Users className="h-6 w-6" />,
  },
  {
    title: 'Order Processing',
    description: 'Real-time order management connecting customers, kitchen staff, and waiters in one system.',
    icon: <Utensils className="h-6 w-6" />,
  },
  {
    title: 'Menu Control',
    description: 'Easily update your menu items, prices, and availability with our intuitive interface.',
    icon: <Coffee className="h-6 w-6" />,
  },
];

// Data for the steps section
const steps = [
  {
    title: 'Scan QR Code',
    description: 'Customers scan table QR codes to access your digital menu instantly.',
  },
  {
    title: 'Place Orders',
    description: 'Orders go directly to the kitchen for efficient preparation.',
  },
  {
    title: 'Enjoy Service',
    description: 'Staff delivers orders to tables with minimal wait time.',
  },
];

export default Home;
