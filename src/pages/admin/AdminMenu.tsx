
import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { menuItems as initialMenuItems, categories } from "@/lib/sample-data";
import { MenuItem } from "@/lib/types";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Search, Plus } from "lucide-react";

const AdminMenu = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [searchTerm, setSearchTerm] = useState("");
  
  const handleToggleAvailability = (itemId: string) => {
    setMenuItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, available: !item.available } : item
      )
    );
    
    const item = menuItems.find((item) => item.id === itemId);
    if (item) {
      toast.success(
        item.available 
          ? `${item.name} is now unavailable` 
          : `${item.name} is now available`
      );
    }
  };
  
  const filteredItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Get category name from category ID
  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.name : "Uncategorized";
  };
  
  return (
    <AdminLayout title="Menu Management">
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search menu items..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Button className="bg-orange-500 hover:bg-orange-600">
          <Plus className="mr-1 h-4 w-4" />
          Add New Item
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="hidden md:table-cell">Description</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Available</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <div
                        className="w-10 h-10 rounded overflow-hidden bg-gray-100 mr-3 hidden sm:block"
                        style={{
                          backgroundImage: `url(${item.image})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      />
                      {item.name}
                    </div>
                  </TableCell>
                  <TableCell>{getCategoryName(item.category)}</TableCell>
                  <TableCell className="hidden md:table-cell max-w-xs truncate">
                    {item.description}
                  </TableCell>
                  <TableCell>${item.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <Switch
                      checked={item.available}
                      onCheckedChange={() => handleToggleAvailability(item.id)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24 text-gray-500">
                  No menu items found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
};

export default AdminMenu;
