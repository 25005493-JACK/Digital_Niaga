-- ============================================================================
-- DIGITAL NIAGA — SUPABASE POSTGRESQL SCHEMA & REALTIME SETUP
-- WIX2001 SULAM Community Initiative
-- ============================================================================

-- 1. Create Hawker Centres Table
CREATE TABLE IF NOT EXISTS public.hawker_centres (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    operating_hours VARCHAR(100),
    total_stalls INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Stalls Table
CREATE TABLE IF NOT EXISTS public.stalls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hawker_centre_id UUID REFERENCES public.hawker_centres(id) ON DELETE CASCADE,
    stall_number VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    tagline TEXT,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    cuisines TEXT[] DEFAULT '{}',
    contact_phone VARCHAR(50),
    operating_hours VARCHAR(100),
    logo_url TEXT,
    banner_url TEXT,
    duitnow_qr_url TEXT,
    is_halal BOOLEAN DEFAULT false,
    rating NUMERIC(2,1) DEFAULT 4.5,
    -- 3D Coordinates in Food Court Model
    coord_x FLOAT DEFAULT 0,
    coord_y FLOAT DEFAULT 0.5,
    coord_z FLOAT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Stall Staff Members Table (Row Level Security role mapping)
CREATE TABLE IF NOT EXISTS public.stall_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stall_id UUID REFERENCES public.stalls(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('owner', 'cashier', 'kitchen')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(stall_id, user_id)
);

-- 4. Create Menu Items Table
CREATE TABLE IF NOT EXISTS public.menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stall_id UUID REFERENCES public.stalls(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL,
    image_url TEXT,
    is_available BOOLEAN DEFAULT true,
    is_signature BOOLEAN DEFAULT false,
    spicy_level INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id VARCHAR(100) PRIMARY KEY,
    stall_id VARCHAR(100) NOT NULL,
    order_number VARCHAR(50) NOT NULL,
    order_type VARCHAR(20) NOT NULL CHECK (order_type IN ('dine_in', 'takeaway')),
    table_number VARCHAR(50),
    total_amount NUMERIC(10,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('cash', 'duitnow_qr')),
    payment_status VARCHAR(50) NOT NULL CHECK (payment_status IN ('unpaid', 'verified')),
    order_status VARCHAR(50) NOT NULL CHECK (order_status IN ('pending', 'preparing', 'ready', 'completed', 'cancelled')),
    cashier_id VARCHAR(100),
    cashier_name VARCHAR(255),
    items JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Supabase Realtime Broadcasting on the orders table
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;

-- Enable Row Level Security (RLS)
ALTER TABLE public.hawker_centres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stalls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Public can read hawker centres, stalls, and menu items
CREATE POLICY "Allow public read access to hawker centres" ON public.hawker_centres FOR SELECT USING (true);
CREATE POLICY "Allow public read access to stalls" ON public.stalls FOR SELECT USING (true);
CREATE POLICY "Allow public read access to menu items" ON public.menu_items FOR SELECT USING (true);

-- Orders: Public can view their receipt by order id
CREATE POLICY "Allow public read order by id" ON public.orders FOR SELECT USING (true);

-- Orders: Allow insert and update
CREATE POLICY "Allow insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update orders" ON public.orders FOR UPDATE USING (true);
