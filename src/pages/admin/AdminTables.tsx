
import { useState, useEffect } from "react";
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
import { Table as TableType } from "@/lib/types";
import { QrCode, Plus, Download } from "lucide-react";
import { toast } from "sonner";
import { tablesAPI } from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const AddTableDialog = ({ onSuccess }: { onSuccess: () => void }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      number: '',
      seats: ''
    }
  });

  const queryClient = useQueryClient();

  const { mutate: createTable, isPending } = useMutation({
    mutationFn: async (data: { number: number; seats: number }) => {
      return tablesAPI.createTable(data);
    },
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Table created successfully");
        reset();
        queryClient.invalidateQueries({ queryKey: ['tables'] });
        onSuccess();
      } else {
        toast.error(response.message || "Failed to create table");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create table");
    }
  });

  const onSubmit = (data: any) => {
    createTable({
      number: parseInt(data.number),
      seats: parseInt(data.seats)
    });
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add New Table</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="text-sm font-medium">Table Number</label>
          <Input
            type="number"
            {...register("number", { required: "Table number is required" })}
          />
          {errors.number && (
            <p className="text-sm text-red-500">{errors.number.message}</p>
          )}
        </div>
        
        <div>
          <label className="text-sm font-medium">Number of Seats</label>
          <Input
            type="number"
            {...register("seats", { required: "Number of seats is required" })}
          />
          {errors.seats && (
            <p className="text-sm text-red-500">{errors.seats.message}</p>
          )}
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-orange-500 hover:bg-orange-600"
          disabled={isPending}
        >
          {isPending ? "Creating..." : "Create Table"}
        </Button>
      </form>
    </DialogContent>
  );
};

const AdminTables = () => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { 
    data: tables = [], 
    isLoading, 
    error,
    refetch
  } = useQuery({
    queryKey: ['tables'],
    queryFn: async () => {
      const response = await tablesAPI.getAllTables();
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.data;
    }
  });

  const { mutate: regenerateQR, isPending: isRegenerating } = useMutation({
    mutationFn: async (tableId: string) => {
      return tablesAPI.regenerateQRCode(tableId);
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success("QR code regenerated successfully");
        queryClient.invalidateQueries({ queryKey: ['tables'] });
      } else {
        toast.error(data.message || "Failed to regenerate QR code");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to regenerate QR code");
    }
  });

  const handleGenerateQR = (tableId: string) => {
    regenerateQR(tableId);
  };
  
  const handleDownloadQR = (qrCode: string, tableNumber: number) => {
    // Create a temporary link to download the QR code
    const link = document.createElement('a');
    
    // Check if the QR code URL is relative or absolute
    const qrCodeUrl = qrCode.startsWith('http') ? qrCode : `${window.location.origin}${qrCode}`;
    
    link.href = qrCodeUrl;
    link.download = `table-${tableNumber}-qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`QR code for Table #${tableNumber} downloaded`);
  };
  
  if (error) {
    return (
      <AdminLayout title="Tables & QR Codes">
        <div className="text-center py-8">
          <p className="text-red-500">Error loading tables. Please try again.</p>
          <button 
            onClick={() => refetch()} 
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Retry
          </button>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout title="Tables & QR Codes">
      <div className="mb-6 flex justify-end">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Plus className="mr-1 h-4 w-4" />
              Add New Table
            </Button>
          </DialogTrigger>
          <AddTableDialog onSuccess={() => setIsOpen(false)} />
        </Dialog>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {tables.map((table) => (
              <div key={table.id} className="bg-white rounded-lg border shadow-sm overflow-hidden animate-fade-in">
                <div className="p-6 flex items-center justify-center border-b">
                  <div className="bg-gray-100 p-6 rounded-lg">
                    {table.qrCode ? (
                      <img 
                        src={table.qrCode} 
                        alt={`QR Code for Table ${table.number}`}
                        className="h-24 w-24"
                      />
                    ) : (
                      <QrCode className="h-24 w-24 text-gray-800" />
                    )}
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">Table #{table.number}</h3>
                  <p className="text-sm text-gray-600 mb-4">Seats: {table.seats}</p>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleGenerateQR(table.id)}
                      disabled={isRegenerating}
                    >
                      <QrCode className="mr-1 h-4 w-4" />
                      Regenerate
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleDownloadQR(table.qrCode, table.number)}
                      disabled={!table.qrCode}
                    >
                      <Download className="mr-1 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h3 className="font-semibold text-lg mb-4">Table List</h3>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Table Number</TableHead>
                    <TableHead>Seats</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tables.length > 0 ? (
                    tables.map((table) => (
                      <TableRow key={table.id}>
                        <TableCell className="font-medium">#{table.number}</TableCell>
                        <TableCell>{table.seats}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            table.status === 'occupied' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {table.status === 'occupied' ? 'Occupied' : 'Available'}
                          </span>
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
                      <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                        No tables found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminTables;
