
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
import { tables as initialTables } from "@/lib/sample-data";
import { Table as TableType } from "@/lib/types";
import { QrCode, Plus, Download } from "lucide-react";
import { toast } from "sonner";

const AdminTables = () => {
  const [tables, setTables] = useState<TableType[]>(initialTables);

  const handleGenerateQR = (tableId: string) => {
    // In a real app, this would generate a new QR code
    // For now, just show a toast
    toast.success("QR code regenerated");
  };
  
  const handleDownloadQR = (tableId: string, tableNumber: number) => {
    // In a real app, this would trigger a download of the QR code
    toast.success(`QR code for Table #${tableNumber} downloaded`);
  };
  
  return (
    <AdminLayout title="Tables & QR Codes">
      <div className="mb-6 flex justify-end">
        <Button className="bg-orange-500 hover:bg-orange-600">
          <Plus className="mr-1 h-4 w-4" />
          Add New Table
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {tables.map((table) => (
          <div key={table.id} className="bg-white rounded-lg border shadow-sm overflow-hidden">
            <div className="p-6 flex items-center justify-center border-b">
              <div className="bg-gray-100 p-6 rounded-lg">
                <QrCode className="h-24 w-24 text-gray-800" />
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
                  onClick={() => handleDownloadQR(table.id, table.number)}
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
