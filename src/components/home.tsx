import React, { useState, useEffect } from "react";
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
import SettingsPanel from "./SettingsPanel";
import { useAuth } from "./AuthProvider";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "../contexts/LanguageContext";

const Home = () => {
  const [activeTab, setActiveTab] = useState("rooms");
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  // Business info from settings
  const [businessInfo, setBusinessInfo] = useState({
    name: "Villa Paradise Resort",
    address: "Jl. Pantai Indah No. 123, Bali",
    phone: "+62 812 3456 7890",
    email: "info@villaparadise.com",
  });

  // Load business name from settings
  useEffect(() => {
    const savedSettings = localStorage.getItem("villaSettings");
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        if (parsedSettings.businessInfo?.name) {
          setBusinessInfo((prev) => ({
            ...prev,
            name: parsedSettings.businessInfo.name,
          }));
        }

        // Apply theme if available
        if (parsedSettings.theme) {
          document.body.className = parsedSettings.theme;
        }
      } catch (error) {
        console.error("Error parsing settings from localStorage", error);
      }
    }
  }, []);

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
              {t("general.welcome")}, {user}
            </span>
            <LanguageSwitcher />
            <Button
              variant="secondary"
              size="sm"
              className="text-xs sm:text-sm"
            >
              <Settings className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">{t("general.settings")}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="text-xs sm:text-sm bg-white/10"
            >
              <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">{t("general.logout")}</span>
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
              {t("general.back")} {t("rooms.title")}
            </Button>
            <BookingForm
              roomId={selectedRoom?.id}
              roomName={selectedRoom?.name}
              roomType={selectedRoom?.type}
              pricePerNight={selectedRoom?.price}
              onBookingComplete={handleBookingComplete}
            />
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold">
                {t("dashboard.title")}
              </h2>
              <Button
                onClick={() => setShowBookingForm(true)}
                className="w-full sm:w-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t("dashboard.newBooking")}
              </Button>
            </div>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="mb-4 w-full">
                <TabsTrigger value="rooms">{t("rooms.title")}</TabsTrigger>
                <TabsTrigger value="roomManagement">
                  {t("rooms.management")}
                </TabsTrigger>
                <TabsTrigger value="bookings">
                  {t("bookings.title")}
                </TabsTrigger>
                <TabsTrigger value="invoices">
                  {t("invoices.title")}
                </TabsTrigger>
                <TabsTrigger value="customers">
                  {t("customers.title")}
                </TabsTrigger>
                <TabsTrigger value="settings">
                  {t("general.settings")}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="rooms" className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col gap-4 mb-6">
                      <div className="flex items-center w-full">
                        <div className="relative w-full">
                          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder={t("rooms.searchRooms")}
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
                            <SelectValue
                              placeholder={t("rooms.filterByType")}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">
                              {t("rooms.allTypes")}
                            </SelectItem>
                            <SelectItem value="standard">
                              {t("rooms.standard")}
                            </SelectItem>
                            <SelectItem value="deluxe">
                              {t("rooms.deluxe")}
                            </SelectItem>
                            <SelectItem value="suite">
                              {t("rooms.suite")}
                            </SelectItem>
                          </SelectContent>
                        </Select>

                        <div className="flex flex-wrap items-center gap-2">
                          <Badge
                            variant="outline"
                            className="bg-green-100 text-green-800 hover:bg-green-100"
                          >
                            {t("rooms.available")}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="bg-red-100 text-red-800 hover:bg-red-100"
                          >
                            {t("rooms.booked")}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                          >
                            {t("rooms.cleaning")}
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
                        {t("bookings.current")}
                      </h3>
                      <div className="flex gap-2">
                        <Input
                          placeholder={t("bookings.searchBookings")}
                          className="w-64"
                        />
                        <Button variant="outline">
                          <FileText className="h-4 w-4 mr-2" />
                          {t("general.export")}
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
                      <h3 className="text-xl font-semibold">
                        {t("invoices.history")}
                      </h3>
                      <div className="flex gap-2">
                        <Input
                          placeholder={t("invoices.searchInvoices")}
                          className="w-64"
                        />
                        <Button variant="outline">
                          <FileText className="h-4 w-4 mr-2" />
                          {t("general.export")}
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

              <TabsContent value="settings">
                <Card>
                  <CardContent className="pt-6">
                    <SettingsPanel />
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
