import React, { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import InvoiceGenerator from "./InvoiceGenerator";

interface BookingFormProps {
  roomId?: string;
  roomName?: string;
  roomType?: string;
  pricePerNight?: number;
  onBookingComplete?: () => void;
}

interface GuestInfo {
  name: string;
  phone: string;
  email: string;
}

interface BookingDetails {
  checkIn: Date | undefined;
  checkOut: Date | undefined;
  duration: number;
  totalCost: number;
}

interface PaymentInfo {
  method: "cash" | "bank";
  amountReceived?: number;
  change?: number;
  bankDetails?: {
    accountName: string;
    accountNumber: string;
    bankName: string;
  };
}

const BookingForm: React.FC<BookingFormProps> = ({
  roomId = "101",
  roomName = "Deluxe Villa",
  roomType = "Deluxe",
  pricePerNight = 1500000,
  onBookingComplete = () => {},
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [guestInfo, setGuestInfo] = useState<GuestInfo>({
    name: "",
    phone: "",
    email: "",
  });
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
    checkIn: undefined,
    checkOut: undefined,
    duration: 0,
    totalCost: 0,
  });
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    method: "cash",
    amountReceived: 0,
    change: 0,
    bankDetails: {
      accountName: "Villa Indah Permai",
      accountNumber: "1234567890",
      bankName: "Bank Central Asia",
    },
  });
  const [showInvoice, setShowInvoice] = useState<boolean>(false);

  const handleGuestInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGuestInfo((prev) => ({ ...prev, [name]: value }));
  };

  const calculateDurationAndCost = () => {
    if (bookingDetails.checkIn && bookingDetails.checkOut) {
      const checkInTime = bookingDetails.checkIn.getTime();
      const checkOutTime = bookingDetails.checkOut.getTime();
      const durationMs = checkOutTime - checkInTime;
      const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24));

      const totalCost = durationDays * pricePerNight;

      setBookingDetails((prev) => ({
        ...prev,
        duration: durationDays,
        totalCost: totalCost,
      }));
    }
  };

  const handleDateChange = (
    date: Date | undefined,
    type: "checkIn" | "checkOut",
  ) => {
    setBookingDetails((prev) => ({
      ...prev,
      [type]: date,
    }));

    // Calculate duration and cost when both dates are selected
    if (type === "checkOut" && bookingDetails.checkIn && date) {
      setTimeout(calculateDurationAndCost, 0);
    } else if (type === "checkIn" && bookingDetails.checkOut && date) {
      setTimeout(calculateDurationAndCost, 0);
    }
  };

  const handlePaymentMethodChange = (method: "cash" | "bank") => {
    setPaymentInfo((prev) => ({
      ...prev,
      method,
    }));
  };

  const handleAmountReceivedChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const amount = parseFloat(e.target.value) || 0;
    const change = amount - bookingDetails.totalCost;

    setPaymentInfo((prev) => ({
      ...prev,
      amountReceived: amount,
      change: change,
    }));
  };

  const handleNextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleCompleteBooking = () => {
    setShowInvoice(true);
  };

  const steps = [
    // Step 1: Guest Information
    <Card key="guest-info" className="w-full bg-white">
      <CardHeader>
        <CardTitle>Guest Information</CardTitle>
        <CardDescription>
          Enter the guest details for this booking
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Enter guest name"
            value={guestInfo.name}
            onChange={handleGuestInfoChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            name="phone"
            placeholder="Enter phone number"
            value={guestInfo.phone}
            onChange={handleGuestInfoChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter email address"
            value={guestInfo.email}
            onChange={handleGuestInfoChange}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBookingComplete}>
          Cancel
        </Button>
        <Button onClick={handleNextStep}>Next</Button>
      </CardFooter>
    </Card>,

    // Step 2: Date Selection
    <Card key="date-selection" className="w-full bg-white">
      <CardHeader>
        <CardTitle>Select Dates</CardTitle>
        <CardDescription>Choose check-in and check-out dates</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="check-in">Check-in Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {bookingDetails.checkIn ? (
                    format(bookingDetails.checkIn, "PPP")
                  ) : (
                    <span>Select check-in date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={bookingDetails.checkIn}
                  onSelect={(date) => handleDateChange(date, "checkIn")}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="check-out">Check-out Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {bookingDetails.checkOut ? (
                    format(bookingDetails.checkOut, "PPP")
                  ) : (
                    <span>Select check-out date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={bookingDetails.checkOut}
                  onSelect={(date) => handleDateChange(date, "checkOut")}
                  initialFocus
                  disabled={(date) =>
                    bookingDetails.checkIn
                      ? date < bookingDetails.checkIn
                      : false
                  }
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="flex justify-between py-2">
            <span>Room Type:</span>
            <span className="font-medium">{roomType}</span>
          </div>
          <div className="flex justify-between py-2">
            <span>Price per Night:</span>
            <span className="font-medium">
              Rp {pricePerNight.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span>Duration:</span>
            <span className="font-medium">
              {bookingDetails.duration} night(s)
            </span>
          </div>
          <div className="flex justify-between py-2 text-lg font-bold">
            <span>Total Cost:</span>
            <span>Rp {bookingDetails.totalCost.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handlePreviousStep}>
          Back
        </Button>
        <Button
          onClick={handleNextStep}
          disabled={!bookingDetails.checkIn || !bookingDetails.checkOut}
        >
          Next
        </Button>
      </CardFooter>
    </Card>,

    // Step 3: Payment
    <Card key="payment" className="w-full bg-white">
      <CardHeader>
        <CardTitle>Payment</CardTitle>
        <CardDescription>
          Select payment method and process payment
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs
          defaultValue="cash"
          onValueChange={(value) =>
            handlePaymentMethodChange(value as "cash" | "bank")
          }
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="cash">Cash</TabsTrigger>
            <TabsTrigger value="bank">Bank Transfer</TabsTrigger>
          </TabsList>
          <TabsContent value="cash" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="amount-received">Amount Received (Rp)</Label>
              <Input
                id="amount-received"
                type="number"
                placeholder="Enter amount received"
                value={paymentInfo.amountReceived || ""}
                onChange={handleAmountReceivedChange}
              />
            </div>
            <div className="pt-4 border-t">
              <div className="flex justify-between py-2 text-lg font-bold">
                <span>Total Amount:</span>
                <span>Rp {bookingDetails.totalCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Amount Received:</span>
                <span>
                  Rp {(paymentInfo.amountReceived || 0).toLocaleString()}
                </span>
              </div>
              <div
                className={cn(
                  "flex justify-between py-2 text-lg",
                  (paymentInfo.change || 0) < 0
                    ? "text-red-500"
                    : "text-green-500",
                )}
              >
                <span>Change:</span>
                <span>Rp {(paymentInfo.change || 0).toLocaleString()}</span>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="bank" className="space-y-4 pt-4">
            <div className="p-4 border rounded-md bg-muted">
              <h3 className="font-medium mb-2">Bank Transfer Details</h3>
              <p className="mb-1">Bank: {paymentInfo.bankDetails?.bankName}</p>
              <p className="mb-1">
                Account Number: {paymentInfo.bankDetails?.accountNumber}
              </p>
              <p className="mb-1">
                Account Name: {paymentInfo.bankDetails?.accountName}
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                Please transfer the exact amount of{" "}
                <span className="font-bold">
                  Rp {bookingDetails.totalCost.toLocaleString()}
                </span>{" "}
                to the account above.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handlePreviousStep}>
          Back
        </Button>
        <Button
          onClick={handleCompleteBooking}
          disabled={
            paymentInfo.method === "cash" &&
            (paymentInfo.amountReceived || 0) < bookingDetails.totalCost
          }
        >
          Complete Booking
        </Button>
      </CardFooter>
    </Card>,
  ];

  if (showInvoice) {
    return (
      <InvoiceGenerator
        guestInfo={guestInfo}
        bookingDetails={{
          roomId,
          roomName,
          roomType,
          checkIn: bookingDetails.checkIn,
          checkOut: bookingDetails.checkOut,
          duration: bookingDetails.duration,
          pricePerNight,
          totalCost: bookingDetails.totalCost,
        }}
        paymentInfo={{
          method: paymentInfo.method,
          status: paymentInfo.method === "cash" ? "Paid" : "Pending",
          bankDetails: paymentInfo.bankDetails,
        }}
        onBack={() => setShowInvoice(false)}
        onComplete={onBookingComplete}
      />
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-2 sm:p-4 bg-background">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold">
          Booking for {roomName}
        </h2>
        <p className="text-sm text-muted-foreground">Room ID: {roomId}</p>
      </div>

      {steps[currentStep]}
    </div>
  );
};

export default BookingForm;
