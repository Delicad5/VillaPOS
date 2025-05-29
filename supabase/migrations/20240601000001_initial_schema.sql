-- Create tenants table to support multi-tenant architecture
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create settings table for business and payment info
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id),
  theme TEXT DEFAULT 'light',
  business_name TEXT,
  bank_name TEXT,
  account_number TEXT,
  account_holder TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tenant_id)
);

-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id),
  number TEXT NOT NULL,
  type TEXT NOT NULL,
  price_per_night INTEGER NOT NULL,
  max_guests INTEGER NOT NULL,
  status TEXT NOT NULL,
  description TEXT,
  facilities JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tenant_id, number)
);

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id),
  room_id UUID REFERENCES rooms(id),
  customer_id UUID REFERENCES customers(id),
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  total_amount INTEGER NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id),
  booking_id UUID REFERENCES bookings(id),
  invoice_number TEXT NOT NULL,
  invoice_date DATE NOT NULL,
  due_date DATE NOT NULL,
  subtotal INTEGER NOT NULL,
  tax_rate NUMERIC,
  tax_amount INTEGER,
  discount INTEGER,
  total INTEGER NOT NULL,
  payment_method TEXT,
  payment_status TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tenant_id, invoice_number)
);

-- Create invoice_items table
CREATE TABLE IF NOT EXISTS invoice_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID REFERENCES invoices(id),
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price INTEGER NOT NULL,
  amount INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default tenant
INSERT INTO tenants (id, name) VALUES 
('1', 'Villa Paradise')
ON CONFLICT (id) DO NOTHING;

-- Insert default settings
INSERT INTO settings (tenant_id, theme, business_name, bank_name, account_number, account_holder) VALUES 
('1', 'light', 'Villa Paradise Resort', 'Bank Central Asia', '1234567890', 'PT Villa Paradise Indonesia')
ON CONFLICT (tenant_id) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;

-- Create policies for tenant access
CREATE POLICY "Tenants can access their own data" ON tenants
  FOR ALL USING (id = '1');

CREATE POLICY "Settings can be accessed by tenant" ON settings
  FOR ALL USING (tenant_id = '1');

CREATE POLICY "Rooms can be accessed by tenant" ON rooms
  FOR ALL USING (tenant_id = '1');

CREATE POLICY "Customers can be accessed by tenant" ON customers
  FOR ALL USING (tenant_id = '1');

CREATE POLICY "Bookings can be accessed by tenant" ON bookings
  FOR ALL USING (tenant_id = '1');

CREATE POLICY "Invoices can be accessed by tenant" ON invoices
  FOR ALL USING (tenant_id = '1');

CREATE POLICY "Invoice items can be accessed by tenant" ON invoice_items
  FOR ALL USING (invoice_id IN (
    SELECT id FROM invoices WHERE tenant_id = '1'
  ));

-- Enable realtime subscriptions
alter publication supabase_realtime add table tenants;
alter publication supabase_realtime add table settings;
alter publication supabase_realtime add table rooms;
alter publication supabase_realtime add table customers;
alter publication supabase_realtime add table bookings;
alter publication supabase_realtime add table invoices;
alter publication supabase_realtime add table invoice_items;