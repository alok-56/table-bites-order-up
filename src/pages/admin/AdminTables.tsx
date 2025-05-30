
import { useRef, useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Table as TableType } from "@/lib/types";
import { QrCode, Plus, Download, Edit, Pencil } from "lucide-react";
import { toast } from "sonner";
import { tablesAPI } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QRCodeSVG } from "qrcode.react";

// TableForm component for both adding and editing tables
const TableForm = ({
  onSuccess,
  tableData = null,
}: {
  onSuccess: () => void;
  tableData?: TableType | null;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      number: tableData ? String(tableData.number) : "",
      seats: tableData ? String(tableData.seats) : "",
      status: tableData ? tableData.status : "available",
    },
  });

  const queryClient = useQueryClient();

  const { mutate: saveTable, isPending } = useMutation({
    mutationFn: async (data: {
      number: number;
      seats: number;
      status: "available" | "occupied";
    }) => {
      if (tableData) {
        return tablesAPI.updateTable(tableData._id, data);
      } else {
        return tablesAPI.createTable(data);
      }
    },
    onSuccess: (response) => {
      if (response.success) {
        toast.success(
          tableData
            ? "Table updated successfully"
            : "Table created successfully"
        );
        reset();
        queryClient.invalidateQueries({ queryKey: ["tables"] });
        onSuccess();
      } else {
        toast.error(response.message || "Failed to save table");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to save table");
    },
  });

  const onSubmit = (data: any) => {
    saveTable({
      number: parseInt(data.number),
      seats: parseInt(data.seats),
      status: data.status as "available" | "occupied",
    });
  };

  return (
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

      {tableData && (
        <div>
          <label className="text-sm font-medium">Status</label>
          <select
            {...register("status")}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
          </select>
        </div>
      )}

      <Button
        type="submit"
        className="w-full bg-orange-500 hover:bg-orange-600"
        disabled={isPending}
      >
        {isPending
          ? tableData
            ? "Updating..."
            : "Creating..."
          : tableData
          ? "Update Table"
          : "Create Table"}
      </Button>
    </form>
  );
};

const AdminTables = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<TableType | null>(null);
  const queryClient = useQueryClient();
  const frontendUrl =
    import.meta.env.VITE_FRONTEND_URL || window.location.origin;
  const qrCodeRefs = useRef<Record<string, any>>({});

  const {
    data: tables = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["tables"],
    queryFn: async () => {
      const response = await tablesAPI.getAllTables();
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.data;
    },
  });

  const handleEdit = (table: TableType) => {
    setSelectedTable(table);
    setIsEditDialogOpen(true);
  };

  const handleDownloadQR = (tableId: string, tableNumber: number) => {
    try {
      // Create a canvas element
      const canvas = document.createElement("canvas");
      const qrSvg = qrCodeRefs.current[tableId];
      
      if (!qrSvg) {
        toast.error("QR code not found");
        return;
      }
      
      // Get the SVG data
      const svgData = new XMLSerializer().serializeToString(qrSvg);
      
      // Create a Blob from the SVG data
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);
      
      // Create an image from the SVG
      const img = new Image();
      img.onload = () => {
        // Set canvas dimensions
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw image to canvas
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          
          // Convert canvas to blob
          canvas.toBlob((blob) => {
            if (blob) {
              // Create download link
              const downloadUrl = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = downloadUrl;
              link.download = `table-${tableNumber}-qr.png`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              
              // Clean up
              URL.revokeObjectURL(downloadUrl);
              toast.success(`QR code for Table #${tableNumber} downloaded`);
            } else {
              toast.error("Failed to generate QR code image");
            }
          }, "image/png");
        }
        URL.revokeObjectURL(url);
      };
      
      img.src = url;
    } catch (error) {
      console.error("Error downloading QR code:", error);
      toast.error("Failed to download QR code");
    }
  };

  if (error) {
    return (
      <AdminLayout title="Tables & QR Codes">
        <div className="text-center py-8">
          <p className="text-red-500">
            Error loading tables. Please try again.
          </p>
          <Button
            onClick={() => refetch()}
            className="mt-4 bg-orange-500 hover:bg-orange-600"
          >
            Retry
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Tables & QR Codes">
      <div className="mb-6 flex justify-end">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Plus className="mr-1 h-4 w-4" />
              Add New Table
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Table</DialogTitle>
            </DialogHeader>
            <TableForm onSuccess={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Table Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Table</DialogTitle>
          </DialogHeader>
          {selectedTable && (
            <TableForm
              tableData={selectedTable}
              onSuccess={() => {
                setIsEditDialogOpen(false);
                setSelectedTable(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {tables.map((table) => (
              <div
                key={table._id}
                className="bg-white rounded-lg border shadow-sm overflow-hidden animate-fade-in transition-all duration-300 hover:shadow-md"
              >
                <div className="p-6 flex items-center justify-center border-b">
                  <div
                    id={`qr-code-${table._id}`}
                    className="bg-gray-100 p-6 rounded-lg"
                  >
                    <QRCodeSVG
                      value={`${frontendUrl}/#/table/${table._id}/home`}
                      size={128}
                      level="H"
                      ref={(el) => {
                        if (el) {
                          qrCodeRefs.current[table._id] = el;
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">
                    Table #{table.number}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Seats: {table.seats}
                  </p>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 hover:bg-gray-50 transition-colors"
                      onClick={() => handleEdit(table)}
                    >
                      <Pencil className="mr-1 h-4 w-4" />
                      Edit
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 hover:bg-gray-50 transition-colors"
                      onClick={() => handleDownloadQR(table._id, table.number)}
                    >
                      <Download className="mr-1 h-4 w-4" />
                      Download QR
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg border shadow-sm p-6 animate-fade-in">
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
                      <TableRow key={table._id}>
                        <TableCell className="font-medium">
                          #{table.number}
                        </TableCell>
                        <TableCell>{table.seats}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              table.status === "occupied"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {table.status === "occupied"
                              ? "Occupied"
                              : "Available"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(table)}
                          >
                            <Edit className="mr-1 h-4 w-4" />
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center py-8 text-gray-500"
                      >
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
