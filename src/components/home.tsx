import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Settings, FileText, LogOut } from "lucide-react";
import RoomGrid from "./RoomGrid";
import BookingForm from "./BookingForm";
import CustomerDatabase from "./CustomerDatabase";
import RoomManagement from "./RoomManagement";
import { useAuth } from "./AuthProvider";

const Home = () => {
  const [activeTab, setActiveTab] = useState("rooms");
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const { user, logout } = useAuth();

  // Mock business info - in a real app this would come from the backend
  const businessInfo = {
    name: "Villa Paradise Resort",
    address: "Jl. Pantai Indah No. 123, Bali",
    phone: "+62 812 3456 7890",
    email: "info@villaparadise.com",
  };

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
    setShowBookingForm(true);
  };

  const handleBookingComplete = () => {
    setShowBookingForm(false);
    setSelectedRoom(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 shadow-md">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-bold">{businessInfo.name}</h1>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <span className="text-sm hidden sm:inline-block">
              Welcome, {user}
            </span>
            <Button
              variant="secondary"
              size="sm"
              className="text-xs sm:text-sm"
            >
              <Settings className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Settings</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="text-xs sm:text-sm bg-white/10"
            >
              <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4 mt-4">
        {showBookingForm ? (
          <div>
            <Button
              variant="outline"
              onClick={() => setShowBookingForm(false)}
              className="mb-4"
            >
              Back to Rooms
            </Button>
            <BookingForm
              room={selectedRoom}
              onComplete={handleBookingComplete}
              businessInfo={businessInfo}
            />
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold">
                Villa Management Dashboard
              </h2>
              <Button
                onClick={() => setShowBookingForm(true)}
                className="w-full sm:w-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Booking
              </Button>
            </div>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="mb-4 w-full">
                <TabsTrigger value="rooms">Rooms</TabsTrigger>
                <TabsTrigger value="roomManagement">
                  Room Management
                </TabsTrigger>
                <TabsTrigger value="bookings">Bookings</TabsTrigger>
                <TabsTrigger value="invoices">Invoices</TabsTrigger>
                <TabsTrigger value="customers">Customers</TabsTrigger>
              </TabsList>

              <TabsContent value="rooms" className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col gap-4 mb-6">
                      <div className="flex items-center w-full">
                        <div className="relative w-full">
                          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search rooms..."
                            className="pl-8"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 w-full">
                        <Select
                          value={filterType}
                          onValueChange={setFilterType}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Filter by type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="standard">Standard</SelectItem>
                            <SelectItem value="deluxe">Deluxe</SelectItem>
                            <SelectItem value="suite">Suite</SelectItem>
                          </SelectContent>
                        </Select>

                        <div className="flex flex-wrap items-center gap-2">
                          <Badge
                            variant="outline"
                            className="bg-green-100 text-green-800 hover:bg-green-100"
                          >
                            Available
                          </Badge>
                          <Badge
                            variant="outline"
                            className="bg-red-100 text-red-800 hover:bg-red-100"
                          >
                            Booked
                          </Badge>
                          <Badge
                            variant="outline"
                            className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                          >
                            Cleaning
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <RoomGrid
                      onRoomSelect={handleRoomSelect}
                      filterType={filterType}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="roomManagement" className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <RoomManagement />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="bookings">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-semibold">
                        Current Bookings
                      </h3>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Search bookings..."
                          className="w-64"
                        />
                        <Button variant="outline">
                          <FileText className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                      </div>
                    </div>
                    <div className="bg-muted/50 p-8 text-center rounded-md">
                      <p className="text-muted-foreground">
                        Booking management interface will be displayed here
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="invoices">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-semibold">Invoice History</h3>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Search invoices..."
                          className="w-64"
                        />
                        <Button variant="outline">
                          <FileText className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                      </div>
                    </div>
                    <div className="bg-muted/50 p-8 text-center rounded-md">
                      <p className="text-muted-foreground">
                        Invoice history and management interface will be
                        displayed here
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="customers">
                <Card>
                  <CardContent className="pt-6">
                    <CustomerDatabase />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-muted p-4 mt-8">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© 2023 Villa Booking & Invoice Management System</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
