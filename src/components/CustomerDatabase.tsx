import React, { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Search, FileText, ArrowUpDown } from "lucide-react";

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalBookings: number;
  lastBookingDate: string;
}

interface Booking {
  id: string;
  roomNumber: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  totalAmount: number;
  status: "completed" | "upcoming" | "cancelled";
}

const CustomerDatabase: React.FC = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Customer>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Mock customer data
  const customers: Customer[] = [
    {
      id: "1",
      name: "John Doe",
      phone: "+62 812 3456 7890",
      email: "john.doe@example.com",
      totalBookings: 3,
      lastBookingDate: "2023-06-15",
    },
    {
      id: "2",
      name: "Jane Smith",
      phone: "+62 812 9876 5432",
      email: "jane.smith@example.com",
      totalBookings: 1,
      lastBookingDate: "2023-05-20",
    },
    {
      id: "3",
      name: "Robert Johnson",
      phone: "+62 811 2345 6789",
      email: "robert.j@example.com",
      totalBookings: 5,
      lastBookingDate: "2023-06-10",
    },
    {
      id: "4",
      name: "Sarah Williams",
      phone: "+62 813 8765 4321",
      email: "sarah.w@example.com",
      totalBookings: 2,
      lastBookingDate: "2023-04-05",
    },
    {
      id: "5",
      name: "Michael Brown",
      phone: "+62 812 1122 3344",
      email: "michael.b@example.com",
      totalBookings: 4,
      lastBookingDate: "2023-06-18",
    },
  ];

  // Mock booking data for selected customer
  const customerBookings: Record<string, Booking[]> = {
    "1": [
      {
        id: "b1",
        roomNumber: "101",
        roomType: "Standard",
        checkIn: "2023-06-15",
        checkOut: "2023-06-18",
        totalAmount: 1500000,
        status: "completed",
      },
      {
        id: "b2",
        roomNumber: "103",
        roomType: "Deluxe",
        checkIn: "2023-04-10",
        checkOut: "2023-04-12",
        totalAmount: 1500000,
        status: "completed",
      },
      {
        id: "b3",
        roomNumber: "201",
        roomType: "Suite",
        checkIn: "2023-07-20",
        checkOut: "2023-07-25",
        totalAmount: 6000000,
        status: "upcoming",
      },
    ],
    "2": [
      {
        id: "b4",
        roomNumber: "102",
        roomType: "Standard",
        checkIn: "2023-05-20",
        checkOut: "2023-05-22",
        totalAmount: 1000000,
        status: "completed",
      },
    ],
    "3": [
      {
        id: "b5",
        roomNumber: "201",
        roomType: "Suite",
        checkIn: "2023-06-10",
        checkOut: "2023-06-15",
        totalAmount: 6000000,
        status: "completed",
      },
      {
        id: "b6",
        roomNumber: "103",
        roomType: "Deluxe",
        checkIn: "2023-03-05",
        checkOut: "2023-03-07",
        totalAmount: 1500000,
        status: "completed",
      },
      {
        id: "b7",
        roomNumber: "104",
        roomType: "Deluxe",
        checkIn: "2023-01-15",
        checkOut: "2023-01-20",
        totalAmount: 3750000,
        status: "completed",
      },
      {
        id: "b8",
        roomNumber: "102",
        roomType: "Standard",
        checkIn: "2022-12-24",
        checkOut: "2022-12-26",
        totalAmount: 1000000,
        status: "completed",
      },
      {
        id: "b9",
        roomNumber: "201",
        roomType: "Suite",
        checkIn: "2022-08-10",
        checkOut: "2022-08-15",
        totalAmount: 6000000,
        status: "completed",
      },
    ],
    "4": [
      {
        id: "b10",
        roomNumber: "101",
        roomType: "Standard",
        checkIn: "2023-04-05",
        checkOut: "2023-04-07",
        totalAmount: 1000000,
        status: "completed",
      },
      {
        id: "b11",
        roomNumber: "102",
        roomType: "Standard",
        checkIn: "2023-02-15",
        checkOut: "2023-02-17",
        totalAmount: 1000000,
        status: "completed",
      },
    ],
    "5": [
      {
        id: "b12",
        roomNumber: "201",
        roomType: "Suite",
        checkIn: "2023-06-18",
        checkOut: "2023-06-20",
        totalAmount: 2400000,
        status: "completed",
      },
      {
        id: "b13",
        roomNumber: "103",
        roomType: "Deluxe",
        checkIn: "2023-05-05",
        checkOut: "2023-05-08",
        totalAmount: 2250000,
        status: "completed",
      },
      {
        id: "b14",
        roomNumber: "104",
        roomType: "Deluxe",
        checkIn: "2023-03-20",
        checkOut: "2023-03-22",
        totalAmount: 1500000,
        status: "completed",
      },
      {
        id: "b15",
        roomNumber: "201",
        roomType: "Suite",
        checkIn: "2023-08-10",
        checkOut: "2023-08-15",
        totalAmount: 6000000,
        status: "upcoming",
      },
    ],
  };

  const handleSort = (field: keyof Customer) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMM yyyy");
    } catch (error) {
      return dateString;
    }
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    if (sortField === "totalBookings") {
      return sortDirection === "asc"
        ? a.totalBookings - b.totalBookings
        : b.totalBookings - a.totalBookings;
    } else if (sortField === "lastBookingDate") {
      return sortDirection === "asc"
        ? new Date(a.lastBookingDate).getTime() -
            new Date(b.lastBookingDate).getTime()
        : new Date(b.lastBookingDate).getTime() -
            new Date(a.lastBookingDate).getTime();
    } else {
      const aValue = a[sortField].toString().toLowerCase();
      const bValue = b[sortField].toString().toLowerCase();
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
  });

  const handleViewDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDetailsOpen(true);
  };

  const getSortIcon = (field: keyof Customer) => {
    if (sortField === field) {
      return (
        <ArrowUpDown
          className={`ml-1 h-4 w-4 ${sortDirection === "asc" ? "rotate-180" : ""}`}
        />
      );
    }
    return <ArrowUpDown className="ml-1 h-4 w-4 opacity-30" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t("customers.database")}</h2>
        <Button variant="outline">
          <FileText className="h-4 w-4 mr-2" />
          {t("general.export")}
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t("customers.searchCustomers")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center">
                  {t("customers.name")}
                  {getSortIcon("name")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("phone")}
              >
                <div className="flex items-center">
                  {t("customers.phone")}
                  {getSortIcon("phone")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("email")}
              >
                <div className="flex items-center">
                  {t("customers.email")}
                  {getSortIcon("email")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer text-right"
                onClick={() => handleSort("totalBookings")}
              >
                <div className="flex items-center justify-end">
                  {t("customers.totalBookings")}
                  {getSortIcon("totalBookings")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("lastBookingDate")}
              >
                <div className="flex items-center">
                  {t("customers.lastBooking")}
                  {getSortIcon("lastBookingDate")}
                </div>
              </TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  No customers found
                </TableCell>
              </TableRow>
            ) : (
              sortedCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell className="text-right">
                    {customer.totalBookings}
                  </TableCell>
                  <TableCell>{formatDate(customer.lastBookingDate)}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetails(customer)}
                    >
                      {t("customers.details")}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Customer Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {t("customers.details")}: {selectedCustomer?.name}
            </DialogTitle>
          </DialogHeader>

          {selectedCustomer && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("customers.name")}:
                  </p>
                  <p className="font-medium">{selectedCustomer.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("customers.phone")}:
                  </p>
                  <p className="font-medium">{selectedCustomer.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("customers.email")}:
                  </p>
                  <p className="font-medium">{selectedCustomer.email}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {t("customers.bookingHistory")}
                </h3>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Room</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Check-in</TableHead>
                        <TableHead>Check-out</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customerBookings[selectedCustomer.id]?.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell>{booking.roomNumber}</TableCell>
                          <TableCell>{booking.roomType}</TableCell>
                          <TableCell>{formatDate(booking.checkIn)}</TableCell>
                          <TableCell>{formatDate(booking.checkOut)}</TableCell>
                          <TableCell className="text-right">
                            Rp {booking.totalAmount.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                booking.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : booking.status === "upcoming"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-red-100 text-red-800"
                              }`}
                            >
                              {booking.status === "completed"
                                ? "Completed"
                                : booking.status === "upcoming"
                                  ? "Upcoming"
                                  : "Cancelled"}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerDatabase;
