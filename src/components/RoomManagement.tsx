import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "./AuthProvider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "../contexts/LanguageContext";
import { Plus, Edit, Trash2 } from "lucide-react";
import RoomGrid from "./RoomGrid";

// Define types
type RoomStatus = "available" | "booked" | "cleaning" | "inactive";

interface Facility {
  id: string;
  name: string;
}

interface Room {
  id: string;
  number: string;
  type: string;
  pricePerNight: number;
  maxGuests: number;
  status: RoomStatus;
  description: string;
  facilities: string[];
  isActive: boolean;
}

const defaultFacilities: Facility[] = [
  { id: "ac", name: "rooms.facilityAC" },
  { id: "wifi", name: "rooms.facilityWifi" },
  { id: "pool", name: "rooms.facilityPool" },
  { id: "kitchen", name: "rooms.facilityKitchen" },
  { id: "tv", name: "rooms.facilityTV" },
  { id: "hotWater", name: "rooms.facilityHotWater" },
  { id: "parking", name: "rooms.facilityParking" },
];

const RoomManagement: React.FC = () => {
  const { t } = useLanguage();
  const { tenantId } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [rooms, setRooms] = useState<Room[]>([
    {
      id: "1",
      number: "101",
      type: "standard",
      pricePerNight: 500000,
      maxGuests: 2,
      status: "available",
      description: "Standard room with basic amenities",
      facilities: ["ac", "wifi", "tv"],
      isActive: true,
    },
    {
      id: "2",
      number: "102",
      type: "standard",
      pricePerNight: 500000,
      maxGuests: 2,
      status: "booked",
      description: "Standard room with garden view",
      facilities: ["ac", "wifi", "tv", "hotWater"],
      isActive: true,
    },
    {
      id: "3",
      number: "103",
      type: "deluxe",
      pricePerNight: 750000,
      maxGuests: 3,
      status: "available",
      description: "Deluxe room with extra space and premium amenities",
      facilities: ["ac", "wifi", "tv", "hotWater", "kitchen"],
      isActive: true,
    },
    {
      id: "4",
      number: "201",
      type: "suite",
      pricePerNight: 1200000,
      maxGuests: 4,
      status: "available",
      description: "Luxury suite with separate living area and ocean view",
      facilities: ["ac", "wifi", "tv", "hotWater", "kitchen", "pool"],
      isActive: true,
    },
    {
      id: "5",
      number: "202",
      type: "suite",
      pricePerNight: 1200000,
      maxGuests: 4,
      status: "inactive",
      description: "Luxury suite with separate living area and garden view",
      facilities: ["ac", "wifi", "tv", "hotWater", "kitchen"],
      isActive: false,
    },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Fetch rooms from Supabase
  useEffect(() => {
    const fetchRooms = async () => {
      if (!tenantId) return;

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("rooms")
          .select("*")
          .eq("tenant_id", tenantId);

        if (error) throw error;

        if (data && data.length > 0) {
          const formattedRooms = data.map((room) => ({
            id: room.id,
            number: room.number,
            type: room.type,
            pricePerNight: room.price_per_night,
            maxGuests: room.max_guests,
            status: room.status as RoomStatus,
            description: room.description || "",
            facilities: room.facilities
              ? Array.isArray(room.facilities)
                ? room.facilities
                : JSON.parse(room.facilities)
              : [],
            isActive: room.is_active,
          }));
          setRooms(formattedRooms);
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, [tenantId]);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [newRoom, setNewRoom] = useState<Partial<Room>>({
    number: "",
    type: "standard",
    pricePerNight: 500000,
    maxGuests: 2,
    status: "available",
    description: "",
    facilities: [],
    isActive: true,
  });
  const [otherFacility, setOtherFacility] = useState("");

  const handleAddRoom = async () => {
    if (!tenantId) return;

    try {
      const roomToAdd = {
        tenant_id: tenantId,
        number: newRoom.number || "",
        type: newRoom.type || "standard",
        price_per_night: newRoom.pricePerNight || 500000,
        max_guests: newRoom.maxGuests || 2,
        status: "available",
        description: newRoom.description || "",
        facilities: newRoom.facilities || [],
        is_active: true,
      };

      const { data, error } = await supabase
        .from("rooms")
        .insert(roomToAdd)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const newRoom: Room = {
          id: data.id,
          number: data.number,
          type: data.type,
          pricePerNight: data.price_per_night,
          maxGuests: data.max_guests,
          status: data.status as RoomStatus,
          description: data.description || "",
          facilities: data.facilities || [],
          isActive: data.is_active,
        };

        setRooms([...rooms, newRoom]);
      }

      setIsAddDialogOpen(false);
      resetNewRoom();
    } catch (error) {
      console.error("Error adding room:", error);
    }
  };

  const handleEditRoom = async () => {
    if (!currentRoom || !tenantId) return;

    try {
      const { error } = await supabase
        .from("rooms")
        .update({
          number: currentRoom.number,
          type: currentRoom.type,
          price_per_night: currentRoom.pricePerNight,
          max_guests: currentRoom.maxGuests,
          status: currentRoom.status,
          description: currentRoom.description,
          facilities: currentRoom.facilities,
          is_active: currentRoom.isActive,
          updated_at: new Date().toISOString(),
        })
        .eq("id", currentRoom.id)
        .eq("tenant_id", tenantId);

      if (error) throw error;

      const updatedRooms = rooms.map((room) =>
        room.id === currentRoom.id ? { ...currentRoom } : room,
      );

      setRooms(updatedRooms);
      setIsEditDialogOpen(false);
      setCurrentRoom(null);
    } catch (error) {
      console.error("Error updating room:", error);
    }
  };

  const handleDeleteRoom = async () => {
    if (!currentRoom || !tenantId) return;

    try {
      // Check if room has booking history
      const { data: bookings, error: bookingError } = await supabase
        .from("bookings")
        .select("id")
        .eq("room_id", currentRoom.id)
        .limit(1);

      if (bookingError) throw bookingError;

      const hasBookingHistory = bookings && bookings.length > 0;

      if (hasBookingHistory) {
        // Deactivate instead of delete
        const { error } = await supabase
          .from("rooms")
          .update({
            is_active: false,
            status: "inactive",
            updated_at: new Date().toISOString(),
          })
          .eq("id", currentRoom.id)
          .eq("tenant_id", tenantId);

        if (error) throw error;

        const updatedRooms = rooms.map((room) =>
          room.id === currentRoom.id
            ? { ...room, isActive: false, status: "inactive" as RoomStatus }
            : room,
        );
        setRooms(updatedRooms);
      } else {
        // Delete if no booking history
        const { error } = await supabase
          .from("rooms")
          .delete()
          .eq("id", currentRoom.id)
          .eq("tenant_id", tenantId);

        if (error) throw error;

        const updatedRooms = rooms.filter((room) => room.id !== currentRoom.id);
        setRooms(updatedRooms);
      }

      setIsDeleteDialogOpen(false);
      setCurrentRoom(null);
    } catch (error) {
      console.error("Error deleting room:", error);
    }
  };

  const handleToggleRoomStatus = async (room: Room) => {
    if (!tenantId) return;

    try {
      const newStatus = !room.isActive;
      const { error } = await supabase
        .from("rooms")
        .update({
          is_active: newStatus,
          status: newStatus ? "available" : "inactive",
          updated_at: new Date().toISOString(),
        })
        .eq("id", room.id)
        .eq("tenant_id", tenantId);

      if (error) throw error;

      const updatedRooms = rooms.map((r) =>
        r.id === room.id
          ? {
              ...r,
              isActive: !r.isActive,
              status: !r.isActive ? "available" : "inactive",
            }
          : r,
      );
      setRooms(updatedRooms);
    } catch (error) {
      console.error("Error toggling room status:", error);
    }
  };

  const openEditDialog = (room: Room) => {
    setCurrentRoom({ ...room });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (room: Room) => {
    setCurrentRoom(room);
    setIsDeleteDialogOpen(true);
  };

  const resetNewRoom = () => {
    setNewRoom({
      number: "",
      type: "standard",
      pricePerNight: 500000,
      maxGuests: 2,
      status: "available",
      description: "",
      facilities: [],
      isActive: true,
    });
    setOtherFacility("");
  };

  const handleFacilityChange = (
    facilityId: string,
    isChecked: boolean,
    isCurrentRoom: boolean = false,
  ) => {
    if (isCurrentRoom && currentRoom) {
      const updatedFacilities = isChecked
        ? [...currentRoom.facilities, facilityId]
        : currentRoom.facilities.filter((id) => id !== facilityId);

      setCurrentRoom({
        ...currentRoom,
        facilities: updatedFacilities,
      });
    } else {
      const updatedFacilities = isChecked
        ? [...(newRoom.facilities || []), facilityId]
        : (newRoom.facilities || []).filter((id) => id !== facilityId);

      setNewRoom({
        ...newRoom,
        facilities: updatedFacilities,
      });
    }
  };

  const handleAddOtherFacility = (isCurrentRoom: boolean = false) => {
    if (!otherFacility.trim()) return;

    if (isCurrentRoom && currentRoom) {
      setCurrentRoom({
        ...currentRoom,
        facilities: [...currentRoom.facilities, otherFacility],
      });
    } else {
      setNewRoom({
        ...newRoom,
        facilities: [...(newRoom.facilities || []), otherFacility],
      });
    }

    setOtherFacility("");
  };

  const activeRooms = rooms.filter((room) => room.isActive);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t("rooms.management")}</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {t("rooms.addRoom")}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          Loading rooms...
        </div>
      ) : (
        <RoomGrid
          rooms={activeRooms}
          onRoomSelect={() => {}}
          onEditRoom={openEditDialog}
          onDeleteRoom={openDeleteDialog}
          onToggleStatus={handleToggleRoomStatus}
        />
      )}

      {/* Add Room Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{t("rooms.addRoom")}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="roomNumber">{t("rooms.roomNumber")}</Label>
                <Input
                  id="roomNumber"
                  value={newRoom.number}
                  onChange={(e) =>
                    setNewRoom({ ...newRoom, number: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="roomType">{t("rooms.roomType")}</Label>
                <Select
                  value={newRoom.type}
                  onValueChange={(value) =>
                    setNewRoom({ ...newRoom, type: value })
                  }
                >
                  <SelectTrigger id="roomType">
                    <SelectValue placeholder={t("rooms.roomType")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">
                      {t("rooms.standard")}
                    </SelectItem>
                    <SelectItem value="deluxe">{t("rooms.deluxe")}</SelectItem>
                    <SelectItem value="suite">{t("rooms.suite")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pricePerNight">
                  {t("rooms.pricePerNight")}
                </Label>
                <Input
                  id="pricePerNight"
                  type="number"
                  value={newRoom.pricePerNight}
                  onChange={(e) =>
                    setNewRoom({
                      ...newRoom,
                      pricePerNight: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxGuests">{t("rooms.maxGuests")}</Label>
                <Input
                  id="maxGuests"
                  type="number"
                  value={newRoom.maxGuests}
                  onChange={(e) =>
                    setNewRoom({
                      ...newRoom,
                      maxGuests: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t("rooms.description")}</Label>
              <Textarea
                id="description"
                value={newRoom.description}
                onChange={(e) =>
                  setNewRoom({ ...newRoom, description: e.target.value })
                }
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>{t("rooms.facilities")}</Label>
              <div className="grid grid-cols-2 gap-2">
                {defaultFacilities.map((facility) => (
                  <div
                    key={facility.id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`facility-${facility.id}`}
                      checked={(newRoom.facilities || []).includes(facility.id)}
                      onCheckedChange={(checked) =>
                        handleFacilityChange(facility.id, checked === true)
                      }
                    />
                    <label
                      htmlFor={`facility-${facility.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {t(facility.name)}
                    </label>
                  </div>
                ))}
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <Input
                  placeholder={t("rooms.facilityOther")}
                  value={otherFacility}
                  onChange={(e) => setOtherFacility(e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleAddOtherFacility()}
                  disabled={!otherFacility.trim()}
                >
                  {t("general.add")}
                </Button>
              </div>
              {(newRoom.facilities || []).filter(
                (f) => !defaultFacilities.some((df) => df.id === f),
              ).length > 0 && (
                <div className="mt-2">
                  <Label>{t("rooms.facilityOther")}:</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {(newRoom.facilities || [])
                      .filter(
                        (f) => !defaultFacilities.some((df) => df.id === f),
                      )
                      .map((facility) => (
                        <div
                          key={facility}
                          className="bg-muted px-2 py-1 rounded-md text-xs flex items-center"
                        >
                          {facility}
                          <button
                            type="button"
                            className="ml-1 text-muted-foreground hover:text-foreground"
                            onClick={() =>
                              handleFacilityChange(facility, false)
                            }
                          >
                            ×
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddDialogOpen(false);
                resetNewRoom();
              }}
            >
              {t("general.cancel")}
            </Button>
            <Button onClick={handleAddRoom}>{t("general.save")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Room Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{t("rooms.editRoom")}</DialogTitle>
          </DialogHeader>
          {currentRoom && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-roomNumber">
                    {t("rooms.roomNumber")}
                  </Label>
                  <Input
                    id="edit-roomNumber"
                    value={currentRoom.number}
                    onChange={(e) =>
                      setCurrentRoom({
                        ...currentRoom,
                        number: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-roomType">{t("rooms.roomType")}</Label>
                  <Select
                    value={currentRoom.type}
                    onValueChange={(value) =>
                      setCurrentRoom({ ...currentRoom, type: value })
                    }
                  >
                    <SelectTrigger id="edit-roomType">
                      <SelectValue placeholder={t("rooms.roomType")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">
                        {t("rooms.standard")}
                      </SelectItem>
                      <SelectItem value="deluxe">
                        {t("rooms.deluxe")}
                      </SelectItem>
                      <SelectItem value="suite">{t("rooms.suite")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-pricePerNight">
                    {t("rooms.pricePerNight")}
                  </Label>
                  <Input
                    id="edit-pricePerNight"
                    type="number"
                    value={currentRoom.pricePerNight}
                    onChange={(e) =>
                      setCurrentRoom({
                        ...currentRoom,
                        pricePerNight: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-maxGuests">{t("rooms.maxGuests")}</Label>
                  <Input
                    id="edit-maxGuests"
                    type="number"
                    value={currentRoom.maxGuests}
                    onChange={(e) =>
                      setCurrentRoom({
                        ...currentRoom,
                        maxGuests: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">
                  {t("rooms.description")}
                </Label>
                <Textarea
                  id="edit-description"
                  value={currentRoom.description}
                  onChange={(e) =>
                    setCurrentRoom({
                      ...currentRoom,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>{t("rooms.facilities")}</Label>
                <div className="grid grid-cols-2 gap-2">
                  {defaultFacilities.map((facility) => (
                    <div
                      key={facility.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`edit-facility-${facility.id}`}
                        checked={currentRoom.facilities.includes(facility.id)}
                        onCheckedChange={(checked) =>
                          handleFacilityChange(
                            facility.id,
                            checked === true,
                            true,
                          )
                        }
                      />
                      <label
                        htmlFor={`edit-facility-${facility.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {t(facility.name)}
                      </label>
                    </div>
                  ))}
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <Input
                    placeholder={t("rooms.facilityOther")}
                    value={otherFacility}
                    onChange={(e) => setOtherFacility(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleAddOtherFacility(true)}
                    disabled={!otherFacility.trim()}
                  >
                    {t("general.add")}
                  </Button>
                </div>
                {currentRoom.facilities.filter(
                  (f) => !defaultFacilities.some((df) => df.id === f),
                ).length > 0 && (
                  <div className="mt-2">
                    <Label>{t("rooms.facilityOther")}:</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {currentRoom.facilities
                        .filter(
                          (f) => !defaultFacilities.some((df) => df.id === f),
                        )
                        .map((facility) => (
                          <div
                            key={facility}
                            className="bg-muted px-2 py-1 rounded-md text-xs flex items-center"
                          >
                            {facility}
                            <button
                              type="button"
                              className="ml-1 text-muted-foreground hover:text-foreground"
                              onClick={() =>
                                handleFacilityChange(facility, false, true)
                              }
                            >
                              ×
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-status">{t("rooms.status")}</Label>
                <Select
                  value={currentRoom.status}
                  onValueChange={(value: RoomStatus) =>
                    setCurrentRoom({
                      ...currentRoom,
                      status: value,
                      isActive: value !== "inactive",
                    })
                  }
                >
                  <SelectTrigger id="edit-status">
                    <SelectValue placeholder={t("rooms.status")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">
                      {t("rooms.available")}
                    </SelectItem>
                    <SelectItem value="booked">{t("rooms.booked")}</SelectItem>
                    <SelectItem value="cleaning">
                      {t("rooms.cleaning")}
                    </SelectItem>
                    <SelectItem value="inactive">
                      {t("general.inactive")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setCurrentRoom(null);
              }}
            >
              {t("general.cancel")}
            </Button>
            <Button onClick={handleEditRoom}>{t("general.save")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Room Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("rooms.deleteRoom")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("rooms.confirmDelete")} {t("rooms.deleteWarning")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("general.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteRoom}>
              {t("general.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RoomManagement;
