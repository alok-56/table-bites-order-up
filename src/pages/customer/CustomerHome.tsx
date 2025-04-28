
import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { Utensils, Coffee, Clock, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { tablesAPI } from "@/lib/api";
import { toast } from "sonner";

const CustomerHome = () => {
  const { tableId } = useParams<{ tableId: string }>();
  const { setTableId } = useCart();

  useEffect(() => {
    if (tableId) {
      setTableId(tableId);
    }
    
    // Add animation effect on load
    const timer = setTimeout(() => {
      document.querySelector('.home-container')?.classList.add('opacity-100', 'translate-y-0');
    }, 100);
    
    return () => clearTimeout(timer);
  }, [tableId, setTableId]);

  // Fetch table info
  const { data: table, isLoading } = useQuery({
    queryKey: ["table", tableId],
    queryFn: async () => {
      if (!tableId) return null;
      const response = await tablesAPI.getTable(tableId);
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    enabled: !!tableId,
    retry: 1,
    meta: {
      onError: (error: Error) => {
        toast.error(error.message || "Invalid table QR code");
      },
    },
  });

  if (!tableId || (!isLoading && !table)) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">Invalid Table</h2>
          <p className="mt-2 text-gray-600">Please scan a valid QR code.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="home-container opacity-0 translate-y-4 transition-all duration-700 ease-out">
        {/* Hero Section */}
        <div className="relative py-12 mb-8 bg-gradient-to-r from-orange-500/10 to-orange-600/20 rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          
          <div className="relative px-6 py-8">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 animate-fade-in">
                Welcome to <span className="text-orange-500">TableBites</span>
              </h1>
              
              {table && (
                <div className="flex items-center justify-center space-x-2 mb-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                  <p className="text-gray-600">You're at</p>
                  <span className="inline-block px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-md font-medium">
                    Table #{table.number}
                  </span>
                  <span className="text-sm text-gray-500">({table.seats} seats)</span>
                </div>
              )}
              
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.3s" }}>
                Explore our delicious menu and order directly from your table
              </p>
              
              <Link to={`/table/${tableId}`} className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 group">
                  View Menu
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Feature Cards */}
        <div className="my-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 animate-fade-in">
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="bg-white rounded-lg overflow-hidden border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div className="p-6">
                  <div className="bg-orange-100 text-orange-500 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="bg-gray-50 rounded-lg p-8 my-12 text-center animate-fade-in">
          <h2 className="text-2xl font-bold mb-4">Ready to Order?</h2>
          <p className="text-gray-600 mb-6">Browse our menu and create your perfect meal</p>
          <Link to={`/table/${tableId}`}>
            <Button className="bg-orange-500 hover:bg-orange-600">
              Go to Menu
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

// Data for the feature cards
const features = [
  {
    title: 'Browse Menu',
    description: 'Explore our diverse menu with detailed descriptions and images of each dish.',
    icon: <Coffee className="h-6 w-6" />,
  },
  {
    title: 'Place Your Order',
    description: 'Select your items, customize as needed, and send your order directly to our kitchen.',
    icon: <Utensils className="h-6 w-6" />,
  },
  {
    title: 'Quick Service',
    description: 'Track your order status and enjoy quick service without waiting for staff.',
    icon: <Clock className="h-6 w-6" />,
  },
];

export default CustomerHome;
