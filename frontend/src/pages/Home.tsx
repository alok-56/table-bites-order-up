
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";

const Home = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            <span className="text-orange-500">QR</span> Restaurant Ordering System
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Streamline your restaurant operations with our QR code-based ordering system.
            Allow customers to order directly from their tables and manage everything from a centralized dashboard.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-gradient-to-br from-orange-50 to-white border-orange-100">
            <CardContent className="pt-6">
              <div className="text-center mb-4">
                <div className="bg-orange-100 inline-flex p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500">
                    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mt-3">Customer Experience</h3>
              </div>
              <p className="text-gray-600 text-center">
                Customers scan a QR code at their table and place orders directly from their phones,
                providing a contactless and convenient dining experience.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
            <CardContent className="pt-6">
              <div className="text-center mb-4">
                <div className="bg-blue-100 inline-flex p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                    <rect width="18" height="18" x="3" y="3" rx="2"/>
                    <path d="M7 7h10"/>
                    <path d="M7 12h10"/>
                    <path d="M7 17h10"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mt-3">Menu Management</h3>
              </div>
              <p className="text-gray-600 text-center">
                Easily create and update your digital menu, including categories, prices, images, and availability,
                all from a user-friendly dashboard.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-white border-green-100">
            <CardContent className="pt-6">
              <div className="text-center mb-4">
                <div className="bg-green-100 inline-flex p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                    <path d="M12 9h.01"/>
                    <path d="M19 9h.01"/>
                    <path d="M5 9h.01"/>
                    <path d="M3 15h18"/>
                    <rect width="18" height="14" x="3" y="4" rx="2"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mt-3">Order Processing</h3>
              </div>
              <p className="text-gray-600 text-center">
                Track orders in real-time through different stages - from receipt to preparation to delivery -
                ensuring efficient kitchen operations and customer satisfaction.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <img 
              src="https://images.unsplash.com/photo-1552566626-52f8b828add9" 
              alt="Restaurant QR ordering" 
              className="rounded-lg shadow-lg"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Start Managing Your Restaurant Today</h2>
            <div className="space-y-6">
              <div className="flex gap-3">
                <div className="bg-orange-100 text-orange-600 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">1</div>
                <div>
                  <h3 className="font-semibold text-lg">Set Up Your Menu</h3>
                  <p className="text-gray-600">Create your digital menu with categories, items, descriptions, and images.</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="bg-orange-100 text-orange-600 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">2</div>
                <div>
                  <h3 className="font-semibold text-lg">Configure Tables & QR Codes</h3>
                  <p className="text-gray-600">Add your restaurant tables and generate unique QR codes for each one.</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="bg-orange-100 text-orange-600 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">3</div>
                <div>
                  <h3 className="font-semibold text-lg">Start Receiving Orders</h3>
                  <p className="text-gray-600">Place the QR codes on tables and start receiving orders directly to your kitchen.</p>
                </div>
              </div>
              
              <div className="pt-4 flex flex-wrap gap-4">
                <Link to="/admin/login">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                    Admin Login
                  </Button>
                </Link>
                <Link to="/kitchen/login">
                  <Button variant="outline">
                    Kitchen Staff Login
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
