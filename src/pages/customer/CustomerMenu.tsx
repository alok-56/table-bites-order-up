
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

const CustomerMenu = () => {
  const { tableId } = useParams<{ tableId: string }>();
  const { setTableId } = useCart();
  const [activeCategory, setActiveCategory] = useState<string>("");
  
  useEffect(() => {
    if (tableId) {
      setTableId(tableId);
    }
  }, [tableId, setTableId]);
  
  // Fetch table info
  const { data: table, isLoading: tableLoading } = useQuery({
    queryKey: ['table', tableId],
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
      }
    }
  });
  
  // Fetch categories
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await menuAPI.getCategories();
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    meta: {
      onSuccess: (data: Category[]) => {
        if (data.length > 0 && !activeCategory) {
          setActiveCategory(data[0].id);
        }
      }
    }
  });
  
  // Fetch menu items
  const { data: menuItems = [], isLoading: menuLoading } = useQuery({
    queryKey: ['menuItems'],
    queryFn: async () => {
      const response = await menuAPI.getMenuItems();
      if (!response.success) throw new Error(response.message);
      return response.data;
    }
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
      {/* Header Section */}
      <div className="mb-8 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-lg p-6 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Menu</h1>
        {table && (
          <p className="text-gray-600 inline-flex items-center justify-center">
            <span className="inline-block px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
              Table #{table.number}
            </span>
          </p>
        )}
      </div>
      
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <Skeleton key={n} className="h-[300px] w-full" />
            ))}
          </div>
        </div>
      ) : categories.length > 0 ? (
        <Tabs 
          defaultValue={categories[0]?.id} 
          value={activeCategory}
          onValueChange={setActiveCategory}
          className="mb-8"
        >
          <Card className="mb-6 p-2">
            <TabsList className="w-full h-auto flex flex-nowrap overflow-x-auto justify-start space-x-2">
              {categories.map((category: Category) => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  className="px-4 py-2 whitespace-nowrap rounded-full"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Card>
          
          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-0 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems
                  .filter((item: MenuItem) => item.category === category.id && item.available)
                  .map((item: MenuItem) => (
                    <MenuItemCard key={item.id} item={item} />
                  ))}
              </div>
              
              {menuItems.filter((item: MenuItem) => 
                item.category === category.id && item.available
              ).length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No items available in this category.</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Menu Unavailable</CardTitle>
            <CardDescription>No menu items are currently available.</CardDescription>
          </CardHeader>
        </Card>
      )}
      
      <CartButton tableId={tableId} />
    </Layout>
  );
};

export default CustomerMenu;
