import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "./AuthProvider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Printer, Download, Mail, Eye, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { usePDF } from "react-to-pdf";

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

interface InvoiceProps {
  bookingId?: string;
  invoiceNumber?: string;
  businessName?: string;
  businessAddress?: string;
  businessContact?: string;
  businessLogo?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  invoiceDate?: string;
  dueDate?: string;
  items?: InvoiceItem[];
  subtotal?: number;
  taxRate?: number;
  taxAmount?: number;
  discount?: number;
  total?: number;
  paymentMethod?: string;
  paymentStatus?: string;
  bankDetails?: string;
  notes?: string;
  onDownload?: () => void;
  onEmail?: () => void;
  onPrint?: () => void;
}

const InvoiceGenerator: React.FC<InvoiceProps> = ({
  bookingId,
  invoiceNumber: propInvoiceNumber,
  businessName,
  businessAddress = "Jl. Pantai Indah No. 123, Bali, Indonesia",
  businessContact = "Tel: +62 123 4567 | Email: info@villaparadise.com",
  businessLogo = "https://api.dicebear.com/7.x/avataaars/svg?seed=villa",
  customerName: propCustomerName,
  customerEmail: propCustomerEmail,
  customerPhone: propCustomerPhone,
  invoiceDate: propInvoiceDate,
  dueDate: propDueDate,
  items: propItems,
  subtotal: propSubtotal,
  taxRate: propTaxRate,
  taxAmount: propTaxAmount,
  discount: propDiscount,
  total: propTotal,
  paymentMethod: propPaymentMethod,
  paymentStatus: propPaymentStatus,
  bankDetails,
  notes: propNotes,
  onDownload,
  onEmail,
  onPrint,
}) => {
  const { tenantId } = useAuth();
  const { toast } = useToast();
  const { toPDF, targetRef } = usePDF({ filename: "invoice.pdf" });

  const [previewMode, setPreviewMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [savedInvoiceId, setSavedInvoiceId] = useState<string | null>(null);

  // Form state
  const [invoiceNumber, setInvoiceNumber] = useState(
    propInvoiceNumber || generateInvoiceNumber(),
  );
  const [customerName, setCustomerName] = useState(propCustomerName || "");
  const [customerEmail, setCustomerEmail] = useState(propCustomerEmail || "");
  const [customerPhone, setCustomerPhone] = useState(propCustomerPhone || "");
  const [invoiceDate, setInvoiceDate] = useState(
    propInvoiceDate || format(new Date(), "yyyy-MM-dd"),
  );
  const [dueDate, setDueDate] = useState(
    propDueDate ||
      format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
  );
  const [items, setItems] = useState<InvoiceItem[]>(
    propItems || [
      {
        description: "Deluxe Room - 3 nights",
        quantity: 3,
        unitPrice: 1500000,
        amount: 4500000,
      },
    ],
  );
  const [paymentMethod, setPaymentMethod] = useState(
    propPaymentMethod || "Bank Transfer",
  );
  const [paymentStatus, setPaymentStatus] = useState(
    propPaymentStatus || "Pending",
  );
  const [notes, setNotes] = useState(
    propNotes || "Thank you for your business. Payment is due within 7 days.",
  );
  const [discount, setDiscount] = useState(propDiscount || 0);
  const [taxRate, setTaxRate] = useState(propTaxRate || 11);

  // Calculated values
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = (subtotal - discount) * (taxRate / 100);
  const total = subtotal - discount + taxAmount;

  // Load settings from Supabase
  const [settings, setSettings] = useState({
    businessInfo: {
      name: "Villa Paradise",
    },
    paymentInfo: {
      bankName: "Bank Central Asia (BCA)",
      accountNumber: "1234567890",
      accountHolder: "PT Villa Paradise Indonesia",
    },
  });

  // Generate a unique invoice number
  function generateInvoiceNumber() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    return `INV/${year}/${month}/VL001/${random}`;
  }

  // Load booking data if bookingId is provided
  useEffect(() => {
    if (bookingId && tenantId) {
      const fetchBookingData = async () => {
        try {
          setLoading(true);

          // Fetch booking details
          const { data: bookingData, error: bookingError } = await supabase
            .from("bookings")
            .select(
              `
              id, check_in, check_out, total_amount, status,
              customers:customer_id(id, name, email, phone),
              rooms:room_id(id, number, type, price_per_night)
            `,
            )
            .eq("id", bookingId)
            .eq("tenant_id", tenantId)
            .single();

          if (bookingError) {
            console.error("Error fetching booking:", bookingError);
            return;
          }

          if (bookingData) {
            // Calculate number of nights
            const checkIn = new Date(bookingData.check_in);
            const checkOut = new Date(bookingData.check_out);
            const nights = Math.ceil(
              (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24),
            );

            // Set customer information
            if (bookingData.customers) {
              setCustomerName(bookingData.customers.name);
              setCustomerEmail(bookingData.customers.email || "");
              setCustomerPhone(bookingData.customers.phone || "");
            }

            // Set invoice items
            if (bookingData.rooms) {
              const roomItem = {
                description: `${bookingData.rooms.type} Room (${bookingData.rooms.number}) - ${nights} nights (${format(checkIn, "dd MMM yyyy")} - ${format(checkOut, "dd MMM yyyy")})`,
                quantity: nights,
                unitPrice: bookingData.rooms.price_per_night,
                amount: nights * bookingData.rooms.price_per_night,
              };

              setItems([roomItem]);
            }
          }
        } catch (error) {
          console.error("Error loading booking data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchBookingData();
    }
  }, [bookingId, tenantId]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        if (!tenantId) return;

        const { data, error } = await supabase
          .from("settings")
          .select("business_name, bank_name, account_number, account_holder")
          .eq("tenant_id", tenantId)
          .single();

        if (error && error.code !== "PGRST116") {
          console.error("Error fetching settings:", error);
          return;
        }

        if (data) {
          setSettings({
            businessInfo: {
              name: data.business_name || "Villa Paradise",
            },
            paymentInfo: {
              bankName: data.bank_name || "Bank Central Asia (BCA)",
              accountNumber: data.account_number || "1234567890",
              accountHolder:
                data.account_holder || "PT Villa Paradise Indonesia",
            },
          });
        }
      } catch (error) {
        console.error("Error fetching settings from Supabase", error);
      }
    };

    fetchSettings();
  }, [tenantId]);

  // Use settings for business name and bank details if not provided as props
  const displayBusinessName = businessName || settings.businessInfo.name;
  const displayBankDetails =
    bankDetails ||
    `${settings.paymentInfo.bankName}\nAcc No: ${settings.paymentInfo.accountNumber}\nAcc Name: ${settings.paymentInfo.accountHolder}`;

  // Handle item changes
  const updateItem = (
    index: number,
    field: keyof InvoiceItem,
    value: string | number,
  ) => {
    const newItems = [...items];

    if (field === "quantity" || field === "unitPrice") {
      const numValue = typeof value === "string" ? parseFloat(value) : value;
      newItems[index][field] = numValue;

      // Recalculate amount
      newItems[index].amount =
        newItems[index].quantity * newItems[index].unitPrice;
    } else {
      // @ts-ignore - TypeScript doesn't know we're setting a string field
      newItems[index][field] = value;
    }

    setItems(newItems);
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        description: "",
        quantity: 1,
        unitPrice: 0,
        amount: 0,
      },
    ]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // Save invoice to Supabase
  const saveInvoice = async () => {
    if (!tenantId) {
      toast({
        title: "Error",
        description: "Tenant ID is required",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      // 1. Insert invoice record
      const { data: invoiceData, error: invoiceError } = await supabase
        .from("invoices")
        .insert({
          tenant_id: tenantId,
          booking_id: bookingId || null,
          invoice_number: invoiceNumber,
          invoice_date: invoiceDate,
          due_date: dueDate,
          subtotal,
          tax_rate: taxRate,
          tax_amount: taxAmount,
          discount,
          total,
          payment_method: paymentMethod,
          payment_status: paymentStatus,
          notes,
        })
        .select("id")
        .single();

      if (invoiceError) {
        throw invoiceError;
      }

      // 2. Insert invoice items
      const invoiceItems = items.map((item) => ({
        invoice_id: invoiceData.id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        amount: item.amount,
      }));

      const { error: itemsError } = await supabase
        .from("invoice_items")
        .insert(invoiceItems);

      if (itemsError) {
        throw itemsError;
      }

      setSavedInvoiceId(invoiceData.id);

      toast({
        title: "Success",
        description: "Invoice saved successfully",
      });

      // Switch to preview mode
      setPreviewMode(true);
    } catch (error: any) {
      console.error("Error saving invoice:", error);
      toast({
        title: "Error saving invoice",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle download
  const handleDownload = useCallback(() => {
    if (onDownload) {
      onDownload();
    } else {
      toPDF();
    }
  }, [onDownload, toPDF]);

  // Handle email
  const handleEmail = useCallback(() => {
    if (onEmail) {
      onEmail();
    } else {
      toast({
        title: "Email feature",
        description: "Email functionality will be implemented soon",
      });
    }
  }, [onEmail, toast]);

  // Handle print
  const handlePrint = useCallback(() => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  }, [onPrint]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="bg-background p-2 sm:p-4 md:p-6 w-full max-w-4xl mx-auto">
      {previewMode ? (
        <div ref={targetRef} className="bg-white p-8 rounded-lg shadow-lg">
          {/* Invoice Preview */}
          <div className="flex flex-col sm:flex-row justify-between items-start mb-4 sm:mb-8 gap-4">
            <div>
              <img
                src={businessLogo}
                alt="Business Logo"
                className="h-16 w-16 mb-2"
              />
              <h1 className="text-2xl font-bold">{displayBusinessName}</h1>
              <p className="text-sm text-gray-600">{businessAddress}</p>
              <p className="text-sm text-gray-600">{businessContact}</p>
            </div>
            <div className="text-right">
              <h2 className="text-3xl font-bold text-primary mb-2">INVOICE</h2>
              <p className="text-sm">
                <span className="font-semibold">Invoice #:</span>{" "}
                {invoiceNumber}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Date:</span>{" "}
                {formatDate(invoiceDate)}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Due Date:</span>{" "}
                {formatDate(dueDate)}
              </p>
              <div
                className="mt-2 inline-block px-3 py-1 rounded-full text-sm font-medium
                  ${paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 
                    paymentStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'}"
              >
                {paymentStatus}
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-2">Bill To:</h3>
            <p className="font-medium">{customerName}</p>
            <p className="text-sm text-gray-600">{customerEmail}</p>
            <p className="text-sm text-gray-600">{customerPhone}</p>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/2">Description</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.description}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(item.unitPrice)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(item.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-6 flex justify-end">
            <div className="w-1/2">
              <div className="flex justify-between py-2">
                <span className="font-medium">Subtotal:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between py-2">
                  <span className="font-medium">Discount:</span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}
              <div className="flex justify-between py-2">
                <span className="font-medium">Tax ({taxRate}%):</span>
                <span>{formatCurrency(taxAmount)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between py-2">
                <span className="font-bold">Total:</span>
                <span className="font-bold">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-2">
              Payment Method: {paymentMethod}
            </h3>
            {paymentMethod === "Bank Transfer" && (
              <div className="bg-gray-50 p-4 rounded-md">
                <pre className="whitespace-pre-wrap text-sm">
                  {displayBankDetails}
                </pre>
              </div>
            )}
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Notes</h3>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              This is a computer-generated invoice and does not require a
              signature.
            </p>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row justify-end gap-2 sm:space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreviewMode(false)}
            >
              Edit
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button variant="default" size="sm" onClick={handleEmail}>
              <Mail className="h-4 w-4 mr-2" />
              Email Invoice
            </Button>
          </div>
        </div>
      ) : (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Invoice Generator</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewMode(true)}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Business Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                      id="businessName"
                      defaultValue={displayBusinessName}
                    />
                  </div>
                  <div>
                    <Label htmlFor="businessAddress">Business Address</Label>
                    <Textarea
                      id="businessAddress"
                      defaultValue={businessAddress}
                    />
                  </div>
                  <div>
                    <Label htmlFor="businessContact">Business Contact</Label>
                    <Input
                      id="businessContact"
                      defaultValue={businessContact}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Invoice Details</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="invoiceNumber">Invoice Number</Label>
                    <Input
                      id="invoiceNumber"
                      value={invoiceNumber}
                      onChange={(e) => setInvoiceNumber(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="invoiceDate">Invoice Date</Label>
                      <Input
                        id="invoiceDate"
                        type="date"
                        value={invoiceDate}
                        onChange={(e) => setInvoiceDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="dueDate">Due Date</Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="paymentStatus">Payment Status</Label>
                    <Select
                      value={paymentStatus}
                      onValueChange={(value) => setPaymentStatus(value)}
                    >
                      <SelectTrigger id="paymentStatus">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Paid">Paid</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Overdue">Overdue</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <div>
              <h3 className="text-lg font-semibold mb-4">
                Customer Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Input
                    id="customerName"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="customerEmail">Customer Email</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="customerPhone">Customer Phone</Label>
                  <Input
                    id="customerPhone"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <div>
              <h3 className="text-lg font-semibold mb-4">Invoice Items</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/2">Description</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit Price (IDR)</TableHead>
                    <TableHead>Amount (IDR)</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Input
                          value={item.description}
                          onChange={(e) =>
                            updateItem(index, "description", e.target.value)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            updateItem(index, "quantity", e.target.value)
                          }
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) =>
                            updateItem(index, "unitPrice", e.target.value)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Input type="number" value={item.amount} readOnly />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => removeItem(index)}
                        >
                          <span className="sr-only">Delete item</span>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={addItem}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>

            <Separator className="my-6" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Payment Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="paymentMethod">Payment Method</Label>
                    <Select
                      value={paymentMethod}
                      onValueChange={(value) => setPaymentMethod(value)}
                    >
                      <SelectTrigger id="paymentMethod">
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="Bank Transfer">
                          Bank Transfer
                        </SelectItem>
                        <SelectItem value="Credit Card">Credit Card</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {paymentMethod === "Bank Transfer" && (
                    <div>
                      <Label htmlFor="bankDetails">Bank Details</Label>
                      <Textarea
                        id="bankDetails"
                        defaultValue={displayBankDetails}
                        rows={4}
                      />
                    </div>
                  )}
                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Summary</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="subtotal">Subtotal</Label>
                    <Input
                      id="subtotal"
                      type="number"
                      defaultValue={subtotal}
                      readOnly
                    />
                  </div>
                  <div>
                    <Label htmlFor="discount">Discount</Label>
                    <Input
                      id="discount"
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(Number(e.target.value))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="taxRate">Tax Rate (%)</Label>
                      <Input
                        id="taxRate"
                        type="number"
                        value={taxRate}
                        onChange={(e) => setTaxRate(Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="taxAmount">Tax Amount</Label>
                      <Input
                        id="taxAmount"
                        type="number"
                        defaultValue={taxAmount}
                        readOnly
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="total">Total</Label>
                    <Input
                      id="total"
                      type="number"
                      defaultValue={total}
                      readOnly
                      className="font-bold"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => {
                // Reset form to initial values or reload from props
                setInvoiceNumber(generateInvoiceNumber());
                setItems([
                  {
                    description: "Deluxe Room - 3 nights",
                    quantity: 3,
                    unitPrice: 1500000,
                    amount: 4500000,
                  },
                ]);
                setDiscount(0);
                setPaymentStatus("Pending");
              }}
            >
              Reset
            </Button>
            <div className="space-x-2">
              <Button variant="outline" onClick={() => setPreviewMode(true)}>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button
                variant="default"
                onClick={saveInvoice}
                disabled={loading}
              >
                {loading
                  ? "Saving..."
                  : savedInvoiceId
                    ? "Update Invoice"
                    : "Generate Invoice"}
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default InvoiceGenerator;
