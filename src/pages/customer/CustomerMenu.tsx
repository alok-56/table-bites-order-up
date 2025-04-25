
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { MenuItemCard } from "@/components/MenuItemCard";
import { CartButton } from "@/components/CartButton";
import { useCart } from "@/contexts/CartContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { categories, menuItems } from "@/lib/sample-data";
import { Category } from "@/lib/types";

const CustomerMenu = () => {
  const { tableId } = useParams<{ tableId: string }>();
  const { setTableId } = useCart();
  const [activeCategory, setActiveCategory] = useState<string>(categories[0]?.id || '');
  
  useEffect(() => {
    if (tableId) {
      setTableId(tableId);
    }
  }, [tableId, setTableId]);
  
  if (!tableId) {
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
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Menu</h1>
        <p className="text-gray-600">Table #{tableId}</p>
      </div>
      
      <Tabs 
        defaultValue={categories[0]?.id} 
        value={activeCategory}
        onValueChange={setActiveCategory}
        className="mb-8"
      >
        <TabsList className="w-full h-auto flex flex-nowrap overflow-x-auto justify-start mb-6 space-x-2">
          {categories.map((category: Category) => (
            <TabsTrigger 
              key={category.id} 
              value={category.id}
              className="px-4 py-2 whitespace-nowrap"
            >
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems
                .filter((item) => item.category === category.id)
                .map((item) => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
      
      <CartButton tableId={tableId} />
    </Layout>
  );
};

export default CustomerMenu;
