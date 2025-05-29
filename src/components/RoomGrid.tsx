import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "./AuthProvider";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage } from "../contexts/LanguageContext";
import { Edit, Trash2, Power } from "lucide-react";

// Define types
type RoomStatus = "available" | "booked" | "cleaning" | "inactive";

interface Room {
  id: string;
  number: string;
  type: string;
  pricePerNight: number;
  maxGuests?: number;
  status: RoomStatus;
  description?: string;
  facilities?: string[];
  isActive?: boolean;
}

interface BookingFormProps {
  room: Room;
  onBookingComplete: () => void;
}

// Mock BookingForm component until the actual one is implemented
const BookingForm: React.FC<BookingFormProps> = ({
  room,
  onBookingComplete,
}) => {
  const { t } = useLanguage();
  return (
    <div className="p-4">
      <h3 className="text-lg font-medium mb-4">
        {t("bookings.title")} {room.number}
      </h3>
      <p>
        {t("rooms.roomType")}: {room.type}
      </p>
      <p>
        {t("rooms.pricePerNight")}: Rp {room.pricePerNight.toLocaleString()}
      </p>
      <div className="mt-4">
        <Button onClick={onBookingComplete}>{t("general.confirm")}</Button>
      </div>
    </div>
  );
};

interface RoomGridProps {
  rooms?: Room[];
  onRoomSelect?: (room: Room) => void;
  onEditRoom?: (room: Room) => void;
  onDeleteRoom?: (room: Room) => void;
  onToggleStatus?: (room: Room) => void;
  filterType?: string;
}

const RoomGrid: React.FC<RoomGridProps> = ({
  rooms = [],
  onRoomSelect = () => {},
  onEditRoom = () => {},
  onDeleteRoom = () => {},
  onToggleStatus = () => {},
  filterType,
}) => {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<string>(filterType || "all");
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Get unique room types for filter
  const roomTypes = ["all", ...new Set(rooms.map((room) => room.type))];

  // Filter rooms based on selected type
  const filteredRooms =
    filter === "all" ? rooms : rooms.filter((room) => room.type === filter);

  const handleRoomClick = (room: Room) => {
    if (room.status === "available") {
      setSelectedRoom(room);
      setIsDialogOpen(true);
      onRoomSelect(room);
    }
  };

  const getStatusColor = (status: RoomStatus) => {
    switch (status) {
      case "available":
        return "bg-green-100 border-green-500";
      case "booked":
        return "bg-red-100 border-red-500";
      case "cleaning":
        return "bg-yellow-100 border-yellow-500";
      case "inactive":
        return "bg-gray-100 border-gray-500";
      default:
        return "";
    }
  };

  const getStatusBadge = (status: RoomStatus) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-500">{t("rooms.available")}</Badge>;
      case "booked":
        return <Badge className="bg-red-500">{t("rooms.booked")}</Badge>;
      case "cleaning":
        return <Badge className="bg-yellow-500">{t("rooms.cleaning")}</Badge>;
      case "inactive":
        return <Badge className="bg-gray-500">{t("general.inactive")}</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div className="w-64">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger>
              <SelectValue placeholder={t("rooms.filterByType")} />
            </SelectTrigger>
            <SelectContent>
              {roomTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type === "all"
                    ? t("rooms.allTypes")
                    : t(`rooms.${type.toLowerCase()}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {filteredRooms.map((room) => (
          <Card
            key={room.id}
            className={`border-l-4 ${getStatusColor(room.status)} transition-transform hover:scale-[1.02]}`}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Room {room.number}</CardTitle>
                {getStatusBadge(room.status)}
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm text-gray-600">
                {t("rooms.roomType")}: {t(`rooms.${room.type.toLowerCase()}`)}
              </p>
              <p className="font-medium mt-1">
                Rp {room.pricePerNight.toLocaleString()} / night
              </p>
              {room.maxGuests && (
                <p className="text-sm text-gray-600">
                  {t("rooms.maxGuests")}: {room.maxGuests}
                </p>
              )}
              {room.facilities && room.facilities.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500">
                    {t("rooms.facilities")}:
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {room.facilities.slice(0, 3).map((facility) => (
                      <span
                        key={facility}
                        className="inline-block bg-gray-100 px-1.5 py-0.5 rounded text-xs"
                      >
                        {facility}
                      </span>
                    ))}
                    {room.facilities.length > 3 && (
                      <span className="inline-block bg-gray-100 px-1.5 py-0.5 rounded text-xs">
                        +{room.facilities.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              {room.status === "available" && (
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => handleRoomClick(room)}
                >
                  {t("rooms.bookNow")}
                </Button>
              )}
              {room.status === "booked" && (
                <Button size="sm" variant="outline" className="w-full" disabled>
                  {t("rooms.currentlyBooked")}
                </Button>
              )}
              {room.status === "cleaning" && (
                <Button size="sm" variant="outline" className="w-full" disabled>
                  {t("rooms.needsCleaning")}
                </Button>
              )}
              {room.status === "inactive" && (
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={() => onToggleStatus(room)}
                >
                  {t("rooms.activateRoom")}
                </Button>
              )}

              <div className="flex gap-1 ml-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditRoom(room);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                {room.status !== "inactive" && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleStatus(room);
                    }}
                  >
                    <Power className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteRoom(room);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {t("rooms.bookNow")} {selectedRoom?.number}
            </DialogTitle>
          </DialogHeader>
          {selectedRoom && (
            <BookingForm
              room={selectedRoom}
              onBookingComplete={() => setIsDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoomGrid;
