type Language = "en" | "id";

type TranslationKeys =
  | "general.welcome"
  | "general.settings"
  | "general.logout"
  | "general.save"
  | "general.cancel"
  | "general.edit"
  | "general.delete"
  | "general.back"
  | "general.search"
  | "general.filter"
  | "general.export"
  | "general.add"
  | "general.yes"
  | "general.no"
  | "general.confirm"
  | "general.active"
  | "general.inactive"
  | "settings.title"
  | "settings.appearance"
  | "settings.theme"
  | "settings.lightMode"
  | "settings.darkMode"
  | "settings.corporateBlue"
  | "settings.natureGreen"
  | "settings.businessInfo"
  | "settings.businessName"
  | "settings.businessNamePlaceholder"
  | "settings.paymentInfo"
  | "settings.bankName"
  | "settings.bankNamePlaceholder"
  | "settings.accountNumber"
  | "settings.accountNumberPlaceholder"
  | "settings.accountHolder"
  | "settings.accountHolderPlaceholder"
  | "settings.saveSuccess"
  | "settings.saveSuccessDescription"
  | "dashboard.title"
  | "dashboard.newBooking"
  | "rooms.title"
  | "rooms.management"
  | "rooms.addRoom"
  | "rooms.editRoom"
  | "rooms.roomNumber"
  | "rooms.roomType"
  | "rooms.pricePerNight"
  | "rooms.maxGuests"
  | "rooms.description"
  | "rooms.facilities"
  | "rooms.status"
  | "rooms.available"
  | "rooms.booked"
  | "rooms.cleaning"
  | "rooms.searchRooms"
  | "rooms.filterByType"
  | "rooms.allTypes"
  | "rooms.standard"
  | "rooms.deluxe"
  | "rooms.suite"
  | "rooms.bookNow"
  | "rooms.currentlyBooked"
  | "rooms.needsCleaning"
  | "rooms.deactivateRoom"
  | "rooms.activateRoom"
  | "rooms.deleteRoom"
  | "rooms.confirmDelete"
  | "rooms.deleteWarning"
  | "rooms.facilityAC"
  | "rooms.facilityWifi"
  | "rooms.facilityPool"
  | "rooms.facilityKitchen"
  | "rooms.facilityTV"
  | "rooms.facilityHotWater"
  | "rooms.facilityParking"
  | "rooms.facilityOther"
  | "bookings.title"
  | "bookings.current"
  | "bookings.searchBookings"
  | "invoices.title"
  | "invoices.history"
  | "invoices.searchInvoices"
  | "customers.title"
  | "customers.database"
  | "customers.name"
  | "customers.phone"
  | "customers.email"
  | "customers.totalBookings"
  | "customers.lastBooking"
  | "customers.searchCustomers"
  | "customers.details"
  | "customers.bookingHistory";

type TranslationsType = {
  [key in Language]: {
    [key in TranslationKeys]: string;
  };
};

export const translations: TranslationsType = {
  en: {
    "general.welcome": "Welcome",
    "general.settings": "Settings",
    "general.logout": "Logout",
    "general.save": "Save",
    "general.cancel": "Cancel",
    "general.edit": "Edit",
    "general.delete": "Delete",
    "general.back": "Back",
    "general.search": "Search",
    "general.filter": "Filter",
    "general.export": "Export",
    "general.add": "Add",
    "general.yes": "Yes",
    "general.no": "No",
    "general.confirm": "Confirm",
    "general.active": "Active",
    "general.inactive": "Inactive",
    "settings.title": "Settings",
    "settings.appearance": "Dashboard Appearance",
    "settings.theme": "Theme",
    "settings.lightMode": "Light Mode",
    "settings.darkMode": "Dark Mode",
    "settings.corporateBlue": "Corporate Blue",
    "settings.natureGreen": "Nature Green",
    "settings.businessInfo": "Business Information",
    "settings.businessName": "Business Name",
    "settings.businessNamePlaceholder": "Enter your business name",
    "settings.paymentInfo": "Payment Information",
    "settings.bankName": "Bank Name",
    "settings.bankNamePlaceholder": "Enter bank name",
    "settings.accountNumber": "Account Number",
    "settings.accountNumberPlaceholder": "Enter account number",
    "settings.accountHolder": "Account Holder Name",
    "settings.accountHolderPlaceholder": "Enter account holder name",
    "settings.saveSuccess": "Settings saved",
    "settings.saveSuccessDescription":
      "Your settings have been saved successfully.",
    "settings.saveSuccess": "Save Success",
    "settings.saveSuccessDescription":
      "Your changes have been saved successfully.",
    "dashboard.title": "Villa Management Dashboard",
    "dashboard.newBooking": "New Booking",
    "rooms.title": "Rooms",
    "rooms.management": "Room Management",
    "rooms.addRoom": "Add Room",
    "rooms.editRoom": "Edit Room",
    "rooms.roomNumber": "Room Number",
    "rooms.roomType": "Room Type",
    "rooms.pricePerNight": "Price per Night",
    "rooms.maxGuests": "Maximum Guests",
    "rooms.description": "Description",
    "rooms.facilities": "Facilities",
    "rooms.status": "Status",
    "rooms.available": "Available",
    "rooms.booked": "Booked",
    "rooms.cleaning": "Needs Cleaning",
    "rooms.searchRooms": "Search rooms...",
    "rooms.filterByType": "Filter by type",
    "rooms.allTypes": "All Types",
    "rooms.standard": "Standard",
    "rooms.deluxe": "Deluxe",
    "rooms.suite": "Suite",
    "rooms.bookNow": "Book Now",
    "rooms.currentlyBooked": "Currently Booked",
    "rooms.needsCleaning": "Needs Cleaning",
    "rooms.deactivateRoom": "Deactivate Room",
    "rooms.activateRoom": "Activate Room",
    "rooms.deleteRoom": "Delete Room",
    "rooms.confirmDelete": "Are you sure you want to delete this room?",
    "rooms.deleteWarning": "This action cannot be undone.",
    "rooms.facilityAC": "Air Conditioning",
    "rooms.facilityWifi": "WiFi",
    "rooms.facilityPool": "Private Pool",
    "rooms.facilityKitchen": "Kitchen",
    "rooms.facilityTV": "Cable TV",
    "rooms.facilityHotWater": "Hot Water",
    "rooms.facilityParking": "Parking",
    "rooms.facilityOther": "Other Facilities",
    "bookings.title": "Bookings",
    "bookings.current": "Current Bookings",
    "bookings.searchBookings": "Search bookings...",
    "invoices.title": "Invoices",
    "invoices.history": "Invoice History",
    "invoices.searchInvoices": "Search invoices...",
    "customers.title": "Customers",
    "customers.database": "Customer Database",
    "customers.name": "Customer Name",
    "customers.phone": "Phone Number",
    "customers.email": "Email Address",
    "customers.totalBookings": "Total Bookings",
    "customers.lastBooking": "Last Booking Date",
    "customers.searchCustomers": "Search customers...",
    "customers.details": "Customer Details",
    "customers.bookingHistory": "Booking History",
  },
  id: {
    "general.welcome": "Selamat Datang",
    "general.settings": "Pengaturan",
    "general.logout": "Keluar",
    "general.save": "Simpan",
    "general.cancel": "Batal",
    "general.edit": "Edit",
    "general.delete": "Hapus",
    "general.back": "Kembali",
    "general.search": "Cari",
    "general.filter": "Filter",
    "general.export": "Ekspor",
    "general.add": "Tambah",
    "general.yes": "Ya",
    "general.no": "Tidak",
    "general.confirm": "Konfirmasi",
    "general.active": "Aktif",
    "general.inactive": "Tidak Aktif",
    "settings.title": "Pengaturan",
    "settings.appearance": "Tampilan Dashboard",
    "settings.theme": "Tema",
    "settings.lightMode": "Mode Terang",
    "settings.darkMode": "Mode Gelap",
    "settings.corporateBlue": "Biru Korporat",
    "settings.natureGreen": "Hijau Alam",
    "settings.businessInfo": "Informasi Bisnis",
    "settings.businessName": "Nama Bisnis",
    "settings.businessNamePlaceholder": "Masukkan nama bisnis Anda",
    "settings.paymentInfo": "Informasi Pembayaran",
    "settings.bankName": "Nama Bank",
    "settings.bankNamePlaceholder": "Masukkan nama bank",
    "settings.accountNumber": "Nomor Rekening",
    "settings.accountNumberPlaceholder": "Masukkan nomor rekening",
    "settings.accountHolder": "Nama Pemilik Rekening",
    "settings.accountHolderPlaceholder": "Masukkan nama pemilik rekening",
    "settings.saveSuccess": "Pengaturan tersimpan",
    "settings.saveSuccessDescription":
      "Pengaturan Anda telah berhasil disimpan.",
    "settings.saveSuccess": "Simpan Berhasil",
    "settings.saveSuccessDescription":
      "Perubahan Anda telah disimpan dengan sukses.",
    "dashboard.title": "Dashboard Manajemen Villa",
    "dashboard.newBooking": "Booking Baru",
    "rooms.title": "Kamar",
    "rooms.management": "Manajemen Kamar",
    "rooms.addRoom": "Tambah Kamar",
    "rooms.editRoom": "Edit Kamar",
    "rooms.roomNumber": "Nomor Kamar",
    "rooms.roomType": "Tipe Kamar",
    "rooms.pricePerNight": "Harga per Malam",
    "rooms.maxGuests": "Maksimal Tamu",
    "rooms.description": "Deskripsi",
    "rooms.facilities": "Fasilitas",
    "rooms.status": "Status",
    "rooms.available": "Tersedia",
    "rooms.booked": "Terpesan",
    "rooms.cleaning": "Perlu Dibersihkan",
    "rooms.searchRooms": "Cari kamar...",
    "rooms.filterByType": "Filter berdasarkan tipe",
    "rooms.allTypes": "Semua Tipe",
    "rooms.standard": "Standar",
    "rooms.deluxe": "Deluxe",
    "rooms.suite": "Suite",
    "rooms.bookNow": "Pesan Sekarang",
    "rooms.currentlyBooked": "Sedang Terpesan",
    "rooms.needsCleaning": "Perlu Dibersihkan",
    "rooms.deactivateRoom": "Nonaktifkan Kamar",
    "rooms.activateRoom": "Aktifkan Kamar",
    "rooms.deleteRoom": "Hapus Kamar",
    "rooms.confirmDelete": "Apakah Anda yakin ingin menghapus kamar ini?",
    "rooms.deleteWarning": "Tindakan ini tidak dapat dibatalkan.",
    "rooms.facilityAC": "AC",
    "rooms.facilityWifi": "WiFi",
    "rooms.facilityPool": "Kolam Renang Pribadi",
    "rooms.facilityKitchen": "Dapur",
    "rooms.facilityTV": "TV Kabel",
    "rooms.facilityHotWater": "Pemanas Air",
    "rooms.facilityParking": "Parkir",
    "rooms.facilityOther": "Fasilitas Lainnya",
    "bookings.title": "Booking",
    "bookings.current": "Booking Saat Ini",
    "bookings.searchBookings": "Cari booking...",
    "invoices.title": "Faktur",
    "invoices.history": "Riwayat Faktur",
    "invoices.searchInvoices": "Cari faktur...",
    "customers.title": "Pelanggan",
    "customers.database": "Database Pelanggan",
    "customers.name": "Nama Pelanggan",
    "customers.phone": "Nomor Telepon",
    "customers.email": "Alamat Email",
    "customers.totalBookings": "Total Booking",
    "customers.lastBooking": "Tanggal Booking Terakhir",
    "customers.searchCustomers": "Cari pelanggan...",
    "customers.details": "Detail Pelanggan",
    "customers.bookingHistory": "Riwayat Booking",
  },
};
