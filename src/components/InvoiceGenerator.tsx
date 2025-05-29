import React, { useState } from "react";
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
import { Printer, Download, Mail, Eye } from "lucide-react";

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

interface InvoiceProps {
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
  invoiceNumber = "INV/2023/06/VL001/0001",
  businessName = "Villa Paradise",
  businessAddress = "Jl. Pantai Indah No. 123, Bali, Indonesia",
  businessContact = "Tel: +62 123 4567 | Email: info@villaparadise.com",
  businessLogo = "https://api.dicebear.com/7.x/avataaars/svg?seed=villa",
  customerName = "John Doe",
  customerEmail = "john.doe@example.com",
  customerPhone = "+62 987 6543",
  invoiceDate = "2023-06-15",
  dueDate = "2023-06-22",
  items = [
    {
      description: "Deluxe Room - 3 nights (Jun 15-18, 2023)",
      quantity: 3,
      unitPrice: 1500000,
      amount: 4500000,
    },
    {
      description: "Airport Transfer",
      quantity: 1,
      unitPrice: 350000,
      amount: 350000,
    },
    {
      description: "Breakfast Package",
      quantity: 3,
      unitPrice: 150000,
      amount: 450000,
    },
  ],
  subtotal = 5300000,
  taxRate = 11,
  taxAmount = 583000,
  discount = 300000,
  total = 5583000,
  paymentMethod = "Bank Transfer",
  paymentStatus = "Pending",
  bankDetails = "Bank Central Asia (BCA)\nAcc No: 1234567890\nAcc Name: PT Villa Paradise Indonesia",
  notes = "Thank you for your business. Payment is due within 7 days.",
  onDownload = () => console.log("Download invoice"),
  onEmail = () => console.log("Email invoice"),
  onPrint = () => console.log("Print invoice"),
}) => {
  const [previewMode, setPreviewMode] = useState(false);

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
        <div className="bg-white p-8 rounded-lg shadow-lg">
          {/* Invoice Preview */}
          <div className="flex flex-col sm:flex-row justify-between items-start mb-4 sm:mb-8 gap-4">
            <div>
              <img
                src={businessLogo}
                alt="Business Logo"
                className="h-16 w-16 mb-2"
              />
              <h1 className="text-2xl font-bold">{businessName}</h1>
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
                <pre className="whitespace-pre-wrap text-sm">{bankDetails}</pre>
              </div>
            )}
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Notes</h3>
            <p className="text-sm text-gray-600">{notes}</p>
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
            <Button variant="outline" size="sm" onClick={onPrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" size="sm" onClick={onDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button variant="default" size="sm" onClick={onEmail}>
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
                    <Input id="businessName" defaultValue={businessName} />
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
                    <Input id="invoiceNumber" defaultValue={invoiceNumber} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="invoiceDate">Invoice Date</Label>
                      <Input
                        id="invoiceDate"
                        type="date"
                        defaultValue={invoiceDate}
                      />
                    </div>
                    <div>
                      <Label htmlFor="dueDate">Due Date</Label>
                      <Input id="dueDate" type="date" defaultValue={dueDate} />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="paymentStatus">Payment Status</Label>
                    <Select defaultValue={paymentStatus}>
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
                  <Input id="customerName" defaultValue={customerName} />
                </div>
                <div>
                  <Label htmlFor="customerEmail">Customer Email</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    defaultValue={customerEmail}
                  />
                </div>
                <div>
                  <Label htmlFor="customerPhone">Customer Phone</Label>
                  <Input id="customerPhone" defaultValue={customerPhone} />
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
                        <Input defaultValue={item.description} />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          defaultValue={item.quantity}
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>
                        <Input type="number" defaultValue={item.unitPrice} />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          defaultValue={item.amount}
                          readOnly
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <span className="sr-only">Delete item</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                          >
                            <path d="M18 6L6 18M6 6l12 12" />
                          </svg>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button variant="outline" size="sm" className="mt-4">
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
                    <Select defaultValue={paymentMethod}>
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
                        defaultValue={bankDetails}
                        rows={4}
                      />
                    </div>
                  )}
                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea id="notes" defaultValue={notes} rows={3} />
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
                      defaultValue={discount}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="taxRate">Tax Rate (%)</Label>
                      <Input
                        id="taxRate"
                        type="number"
                        defaultValue={taxRate}
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
            <Button variant="outline">Reset</Button>
            <div className="space-x-2">
              <Button variant="outline" onClick={() => setPreviewMode(true)}>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button variant="default">Generate Invoice</Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default InvoiceGenerator;
