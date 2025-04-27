
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { MenuItem, Category } from "@/lib/types";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Search, Plus, Edit } from "lucide-react";
import { menuAPI } from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage
} from "@/components/ui/form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const MenuItemForm = ({ 
  onSuccess, 
  categories, 
  menuItem = null 
}: { 
  onSuccess: () => void, 
  categories: Category[], 
  menuItem?: MenuItem | null 
}) => {
  const form = useForm({
    defaultValues: {
      name: menuItem?.name || '',
      description: menuItem?.description || '',
      price: menuItem?.price ? String(menuItem.price) : '',
      category: menuItem?.category || '',
      image: menuItem?.image || 'https://images.unsplash.com/photo-1546241072-48010ad2862c',
      available: menuItem?.available !== undefined ? menuItem.available : true
    }
  });

  const queryClient = useQueryClient();
  
  const { mutate: saveMenuItem, isPending } = useMutation({
    mutationFn: async (data: any) => {
      const formattedData = {
        ...data,
        price: parseFloat(data.price)
      };
      
      if (menuItem) {
        return menuAPI.updateMenuItem(menuItem.id, formattedData);
      } else {
        return menuAPI.createMenuItem(formattedData);
      }
    },
    onSuccess: (response) => {
      if (response.success) {
        toast.success(menuItem ? "Menu item updated successfully" : "Menu item created successfully");
        queryClient.invalidateQueries({ queryKey: ['menuItems'] });
        form.reset();
        onSuccess();
      } else {
        toast.error(response.message || "Failed to save menu item");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to save menu item");
    }
  });

  const onSubmit = (data: any) => {
    // Validate that a category is selected
    if (!data.category) {
      toast.error("Please select a category");
      return;
    }
    
    saveMenuItem(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Item Name</FormLabel>
              <FormControl>
                <Input placeholder="Pizza Margherita" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Classic pizza with tomato sauce, mozzarella, and basil" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="9.99" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="available"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel>Available</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full bg-orange-500 hover:bg-orange-600"
          disabled={isPending}
        >
          {isPending ? (menuItem ? "Updating..." : "Creating...") : (menuItem ? "Update Menu Item" : "Create Menu Item")}
        </Button>
      </form>
    </Form>
  );
};

const AddCategoryDialog = ({ onSuccess }: { onSuccess: () => void }) => {
  const [name, setName] = useState('');
  
  const queryClient = useQueryClient();
  
  const { mutate: createCategory, isPending } = useMutation({
    mutationFn: async () => {
      return menuAPI.createCategory(name);
    },
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Category created successfully");
        queryClient.invalidateQueries({ queryKey: ['categories'] });
        setName('');
        onSuccess();
      } else {
        toast.error(response.message || "Failed to create category");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create category");
    }
  });
  
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add New Category</DialogTitle>
      </DialogHeader>
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          createCategory();
        }} 
        className="space-y-4"
      >
        <div>
          <label className="text-sm font-medium">Category Name</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Appetizers, Main Course"
            required
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-orange-500 hover:bg-orange-600"
          disabled={isPending || !name.trim()}
        >
          {isPending ? "Creating..." : "Create Category"}
        </Button>
      </form>
    </DialogContent>
  );
};

const AdminMenu = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogType, setDialogType] = useState<"item" | "category" | "editItem" | null>(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  
  const queryClient = useQueryClient();
  
  // Fetch menu items
  const { 
    data: menuItems = [], 
    isLoading: itemsLoading,
    error: itemsError,
    refetch: refetchMenuItems
  } = useQuery({
    queryKey: ['menuItems'],
    queryFn: async () => {
      const response = await menuAPI.getMenuItems();
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.data;
    }
  });
  
  // Fetch categories
  const { 
    data: categories = [], 
    isLoading: categoriesLoading,
    error: categoriesError,
    refetch: refetchCategories
  } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await menuAPI.getCategories();
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.data;
    }
  });

  // Update item availability
  const { mutate: updateAvailability } = useMutation({
    mutationFn: async ({ id, available }: { id: string, available: boolean }) => {
      return menuAPI.updateMenuItem(id, { available });
    },
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['menuItems'] });
        toast.success(
          response.data.available 
            ? `${response.data.name} is now available` 
            : `${response.data.name} is now unavailable`
        );
      } else {
        toast.error(response.message || "Failed to update item availability");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update item availability");
    }
  });
  
  const handleToggleAvailability = (item: MenuItem) => {
    updateAvailability({ 
      id: item.id, 
      available: !item.available 
    });
  };
  
  const handleEditMenuItem = (item: MenuItem) => {
    setSelectedMenuItem(item);
    setDialogType("editItem");
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

  const closeDialog = () => {
    setDialogType(null);
    setSelectedMenuItem(null);
  };
  
  const isLoading = itemsLoading || categoriesLoading;
  const error = itemsError || categoriesError;
  
  if (error) {
    return (
      <AdminLayout title="Menu Management">
        <div className="text-center py-8">
          <p className="text-red-500">Error loading menu data. Please try again.</p>
          <div className="mt-4 space-x-4">
            <button 
              onClick={() => refetchMenuItems()} 
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
            >
              Retry Loading Menu Items
            </button>
            <button 
              onClick={() => refetchCategories()} 
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Retry Loading Categories
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }
  
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
        
        <div className="flex gap-2">
          <Dialog open={dialogType === "category"} onOpenChange={(open) => open ? setDialogType("category") : closeDialog()}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-1 h-4 w-4" />
                Add Category
              </Button>
            </DialogTrigger>
            <AddCategoryDialog onSuccess={closeDialog} />
          </Dialog>
          
          <Dialog open={dialogType === "item"} onOpenChange={(open) => open ? setDialogType("item") : closeDialog()}>
            <DialogTrigger asChild>
              <Button className="bg-orange-500 hover:bg-orange-600">
                <Plus className="mr-1 h-4 w-4" />
                Add Menu Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Menu Item</DialogTitle>
              </DialogHeader>
              <MenuItemForm onSuccess={closeDialog} categories={categories} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* Edit Menu Item Dialog */}
      <Dialog open={dialogType === "editItem"} onOpenChange={(open) => open ? setDialogType("editItem") : closeDialog()}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Menu Item</DialogTitle>
          </DialogHeader>
          {selectedMenuItem && (
            <MenuItemForm 
              onSuccess={closeDialog} 
              categories={categories} 
              menuItem={selectedMenuItem} 
            />
          )}
        </DialogContent>
      </Dialog>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
        </div>
      ) : (
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
                        onCheckedChange={() => handleToggleAvailability(item)}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditMenuItem(item)}
                      >
                        <Edit className="mr-1 h-4 w-4" />
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
      )}
    </AdminLayout>
  );
};

export default AdminMenu;
