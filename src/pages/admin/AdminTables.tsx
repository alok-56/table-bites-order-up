
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

const AddTableDialog = ({ onSuccess }: { onSuccess: () => void }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      number: '',
      seats: ''
    }
  });

  const onSubmit = async (data: any) => {
    const response = await tablesAPI.createTable({
      number: parseInt(data.number),
      seats: parseInt(data.seats)
    });

    if (response.success) {
      toast.success("Table created successfully");
      onSuccess();
    } else {
      toast.error(response.message || "Failed to create table");
    }
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
        
        <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">
          Create Table
        </Button>
      </form>
    </DialogContent>
  );
};

const AdminTables = () => {
  const [tables, setTables] = useState<TableType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTables = async () => {
    setLoading(true);
    const response = await tablesAPI.getAllTables();
    if (response.success && response.data) {
      setTables(response.data);
    } else {
      toast.error(response.message || "Failed to fetch tables");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const handleGenerateQR = async (tableId: string) => {
    const response = await tablesAPI.regenerateQRCode(tableId);
    if (response.success) {
      toast.success("QR code regenerated successfully");
      fetchTables(); // Refresh table data
    } else {
      toast.error(response.message || "Failed to regenerate QR code");
    }
  };
  
  const handleDownloadQR = (qrCode: string, tableNumber: number) => {
    // Create a temporary link to download the QR code
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `table-${tableNumber}-qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`QR code for Table #${tableNumber} downloaded`);
  };
  
  return (
    <AdminLayout title="Tables & QR Codes">
      <div className="mb-6 flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Plus className="mr-1 h-4 w-4" />
              Add New Table
            </Button>
          </DialogTrigger>
          <AddTableDialog onSuccess={fetchTables} />
        </Dialog>
      </div>
      
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
              {tables.map((table) => (
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
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminTables;
