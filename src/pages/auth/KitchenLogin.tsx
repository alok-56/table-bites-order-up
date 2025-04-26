
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Layout } from "@/components/Layout";
import { ChefHat } from "lucide-react";
import { toast } from "sonner";
import { authAPI } from "@/lib/api";

const KitchenLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const response = await authAPI.login(email, password);
    
    if (response.success && response.data) {
      const { token, user } = response.data;
      
      if (user.role !== 'kitchen') {
        toast.error('Access denied. Kitchen staff access only.');
        return;
      }
      
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', user.role);
      navigate('/kitchen');
      toast.success('Welcome to the kitchen dashboard!');
    } else {
      toast.error(response.message || 'Login failed');
    }
  };

  return (
    <Layout>
      <div className="min-h-[90vh] flex items-center justify-center bg-gradient-to-b from-orange-50 to-white">
        <div className="w-full max-w-md animate-fade-in">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="flex flex-col items-center mb-6">
              <ChefHat className="h-12 w-12 text-orange-500 mb-4" />
              <h1 className="text-2xl font-bold text-gray-900">Kitchen Staff Login</h1>
              <p className="text-gray-600">Access the kitchen dashboard</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              
              <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">
                Login to Kitchen Dashboard
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default KitchenLogin;
