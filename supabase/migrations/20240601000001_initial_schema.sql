-- Create tenants table to support multi-tenant architecture
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table with tenant relationship
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id),
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL, -- In production, use auth.users instead
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

-- Enable Row Level Security
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;

-- Create policies for tenant access
CREATE POLICY "Tenants can view their own data" ON tenants
  FOR SELECT USING (auth.uid() IN (
    SELECT user_id FROM users WHERE tenant_id = id
  ));

CREATE POLICY "Users can view their tenant data" ON users
  FOR SELECT USING (tenant_id IN (
    SELECT tenant_id FROM users WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can view their tenant settings" ON settings
  FOR SELECT USING (tenant_id IN (
    SELECT tenant_id FROM users WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can update their tenant settings" ON settings
  FOR UPDATE USING (tenant_id IN (
    SELECT tenant_id FROM users WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can view their tenant rooms" ON rooms
  FOR SELECT USING (tenant_id IN (
    SELECT tenant_id FROM users WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can manage their tenant rooms" ON rooms
  FOR ALL USING (tenant_id IN (
    SELECT tenant_id FROM users WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can view their tenant customers" ON customers
  FOR SELECT USING (tenant_id IN (
    SELECT tenant_id FROM users WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can manage their tenant customers" ON customers
  FOR ALL USING (tenant_id IN (
    SELECT tenant_id FROM users WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can view their tenant bookings" ON bookings
  FOR SELECT USING (tenant_id IN (
    SELECT tenant_id FROM users WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can manage their tenant bookings" ON bookings
  FOR ALL USING (tenant_id IN (
    SELECT tenant_id FROM users WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can view their tenant invoices" ON invoices
  FOR SELECT USING (tenant_id IN (
    SELECT tenant_id FROM users WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can manage their tenant invoices" ON invoices
  FOR ALL USING (tenant_id IN (
    SELECT tenant_id FROM users WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can view their tenant invoice items" ON invoice_items
  FOR SELECT USING (invoice_id IN (
    SELECT id FROM invoices WHERE tenant_id IN (
      SELECT tenant_id FROM users WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY "Users can manage their tenant invoice items" ON invoice_items
  FOR ALL USING (invoice_id IN (
    SELECT id FROM invoices WHERE tenant_id IN (
      SELECT tenant_id FROM users WHERE user_id = auth.uid()
    )
  ));

-- Enable realtime subscriptions
alter publication supabase_realtime add table tenants;
alter publication supabase_realtime add table users;
alter publication supabase_realtime add table settings;
alter publication supabase_realtime add table rooms;
alter publication supabase_realtime add table customers;
alter publication supabase_realtime add table bookings;
alter publication supabase_realtime add table invoices;
alter publication supabase_realtime add table invoice_items;

-- Insert demo data
INSERT INTO tenants (id, name) VALUES 
('d9a1fc2e-d6a6-4f30-9b4c-6f832c4d3510', 'Villa Paradise');

INSERT INTO users (tenant_id, username, password) VALUES 
('d9a1fc2e-d6a6-4f30-9b4c-6f832c4d3510', 'admin', 'password');

INSERT INTO settings (tenant_id, theme, business_name, bank_name, account_number, account_holder) VALUES 
('d9a1fc2e-d6a6-4f30-9b4c-6f832c4d3510', 'light', 'Villa Paradise Resort', 'Bank Central Asia', '1234567890', 'PT Villa Paradise Indonesia');
