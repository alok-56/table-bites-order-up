
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { MenuItemCard } from "@/components/MenuItemCard";
import { CartButton } from "@/components/CartButton";
import { useCart } from "@/contexts/CartContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Category, MenuItem } from "@/lib/types";
import { menuAPI, tablesAPI } from "@/lib/api";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Utensils } from "lucide-react";

const CustomerMenu = () => {
  const { tableId } = useParams<{ tableId: string }>();
  const { setTableId } = useCart();
  const [activeCategory, setActiveCategory] = useState<string>("");

  useEffect(() => {
    if (tableId) {
      setTableId(tableId);
    }
    
    // Add a subtle entrance animation
    const timer = setTimeout(() => {
      document.querySelector('.menu-container')?.classList.add('opacity-100', 'translate-y-0');
    }, 100);
    
    return () => clearTimeout(timer);
  }, [tableId, setTableId]);

  // Fetch table info
  const { data: table, isLoading: tableLoading } = useQuery({
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

  // Fetch categories
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await menuAPI.getCategories();
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    meta: {
      onSuccess: (data: Category[]) => {
        if (data.length > 0 && !activeCategory) {
          setActiveCategory(data[0]._id);
        }
      },
    },
  });

  // Fetch menu items
  const { data: menuItems = [], isLoading: menuLoading } = useQuery({
    queryKey: ["menuItems"],
    queryFn: async () => {
      const response = await menuAPI.getMenuItems();
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
  });

  const isLoading = tableLoading || categoriesLoading || menuLoading;

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
      <div className="menu-container opacity-0 translate-y-4 transition-all duration-700 ease-out">
        {/* Hero Section with Table Info */}
        <div className="relative mb-8 bg-gradient-to-r from-orange-500/10 to-orange-600/20 rounded-lg p-6 overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          
          <div className="relative flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 animate-fade-in">Our Menu</h1>
              {table && (
                <div className="flex items-center justify-center md:justify-start space-x-2 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                  <p className="text-gray-600 flex items-center">You're at</p>
                  <span className="inline-block px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                    Table #{table.number}
                  </span>
                  <span className="text-sm text-gray-500">({table.seats} seats)</span>
                </div>
              )}
            </div>
            
            <div className="bg-white/50 backdrop-blur-sm p-3 rounded-full shadow-md animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <Utensils className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-6 animate-pulse">
            {/* Skeleton for categories */}
            <Skeleton className="h-12 w-full rounded-lg" />
            
            {/* Skeleton for menu items */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <Skeleton key={n} className="h-64 w-full rounded-lg" />
              ))}
            </div>
          </div>
        ) : categories.length > 0 ? (
          <Tabs
            defaultValue={categories[0]?._id}
            value={activeCategory}
            onValueChange={setActiveCategory}
            className="mb-8"
          >
            <Card className="mb-6 p-2 shadow-md border-orange-100 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <TabsList className="w-full h-auto flex flex-nowrap overflow-x-auto justify-start space-x-2 p-1">
                {categories.map((category: Category, index) => (
                  <TabsTrigger
                    key={category._id}
                    value={category._id}
                    className="px-4 py-2 whitespace-nowrap rounded-full transition-all duration-300 data-[state=active]:bg-orange-500 data-[state=active]:text-white animate-fade-in"
                    style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                  >
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Card>

            {categories.map((category) => (
              <TabsContent
                key={category._id}
                value={category._id}
                className="mt-0 focus:outline-none"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {menuItems
                    .filter(
                      (item: MenuItem) =>
                        item.category._id === category._id && item.available
                    )
                    .map((item: MenuItem, index) => (
                      <div 
                        key={item._id} 
                        className="animate-fade-in" 
                        style={{ animationDelay: `${0.1 * index}s` }}
                      >
                        <MenuItemCard item={item} />
                      </div>
                    ))}
                </div>

                {menuItems.filter(
                  (item: MenuItem) =>
                    item.category._id === category._id && item.available
                ).length === 0 && (
                  <div className="text-center py-12 animate-fade-in">
                    <p className="text-gray-500">
                      No items available in this category.
                    </p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <Card className="animate-fade-in">
            <CardHeader className="text-center">
              <CardTitle>Menu Unavailable</CardTitle>
              <CardDescription>
                No menu items are currently available.
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        <CartButton tableId={tableId} />
      </div>
    </Layout>
  );
};

export default CustomerMenu;
