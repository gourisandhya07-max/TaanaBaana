-- =====================================================================
-- TAANA-BAANA SUPABASE DATABASE SCHEMA
-- Project URL: https://noyrfotqdzwnalbnmbcu.supabase.co
-- Description: Complete SQL script for tables, triggers, RLS policies, 
--              indexes, and seed data for the Taana-Baana Platform.
-- =====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUM TYPES
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('artisan', 'buyer', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE product_status AS ENUM ('draft', 'published', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE requirement_status AS ENUM ('open', 'matched', 'closed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE quotation_status AS ENUM ('submitted', 'accepted', 'rejected', 'negotiating');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'refunded', 'failed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =====================================================================
-- 3. TABLES DEFINITION
-- =====================================================================

-- TABLE: profiles (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'artisan',
    phone TEXT,
    avatar_url TEXT,
    location TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TABLE: artisan_clusters (Artisan business & cluster profiles)
CREATE TABLE IF NOT EXISTS public.artisan_clusters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    cluster_name TEXT NOT NULL,
    craft_category TEXT NOT NULL,
    state TEXT NOT NULL,
    district TEXT NOT NULL,
    village_city TEXT,
    member_count INT NOT NULL DEFAULT 1,
    rating NUMERIC(3, 2) DEFAULT 4.8,
    experience_years INT DEFAULT 5,
    bio TEXT,
    is_verified BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TABLE: products (Handcrafted items & AI-generated catalogs)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    artisan_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    cluster_id UUID REFERENCES public.artisan_clusters(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    material TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    minimum_price NUMERIC(10, 2),
    recommended_price NUMERIC(10, 2),
    premium_price NUMERIC(10, 2),
    stock_quantity INT NOT NULL DEFAULT 10,
    image_url TEXT,
    keywords TEXT[] DEFAULT '{}',
    languages TEXT[] DEFAULT '{"English", "Hindi"}',
    status product_status NOT NULL DEFAULT 'published',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TABLE: buyer_requirements (B2B demand postings by buyers)
CREATE TABLE IF NOT EXISTS public.buyer_requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    craft_category TEXT NOT NULL,
    material TEXT,
    quantity INT NOT NULL,
    target_budget NUMERIC(10, 2) NOT NULL,
    deadline DATE,
    delivery_location TEXT,
    specifications TEXT,
    status requirement_status NOT NULL DEFAULT 'open',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TABLE: cluster_matches (AI Buyer-Cluster Matchmaking results)
CREATE TABLE IF NOT EXISTS public.cluster_matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requirement_id UUID REFERENCES public.buyer_requirements(id) ON DELETE CASCADE,
    cluster_id UUID REFERENCES public.artisan_clusters(id) ON DELETE CASCADE,
    match_score INT NOT NULL CHECK (match_score BETWEEN 0 AND 100),
    match_reason TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TABLE: quotations (Artisan price bids for buyer requirements)
CREATE TABLE IF NOT EXISTS public.quotations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requirement_id UUID REFERENCES public.buyer_requirements(id) ON DELETE CASCADE,
    artisan_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    unit_price NUMERIC(10, 2) NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL,
    estimated_delivery_days INT NOT NULL,
    terms_and_conditions TEXT,
    status quotation_status NOT NULL DEFAULT 'submitted',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TABLE: orders (B2B & B2C Orders)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL,
    buyer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    artisan_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    requirement_id UUID REFERENCES public.buyer_requirements(id) ON DELETE SET NULL,
    quantity INT NOT NULL DEFAULT 1,
    total_amount NUMERIC(10, 2) NOT NULL,
    payment_status payment_status NOT NULL DEFAULT 'pending',
    order_status order_status NOT NULL DEFAULT 'pending',
    shipping_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TABLE: pricing_calculations (AI Pricing Studio logs)
CREATE TABLE IF NOT EXISTS public.pricing_calculations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    material_cost NUMERIC(10, 2) NOT NULL DEFAULT 0,
    labour_cost NUMERIC(10, 2) NOT NULL DEFAULT 0,
    packaging_cost NUMERIC(10, 2) NOT NULL DEFAULT 0,
    other_cost NUMERIC(10, 2) NOT NULL DEFAULT 0,
    base_cost NUMERIC(10, 2) NOT NULL,
    minimum_price NUMERIC(10, 2) NOT NULL,
    recommended_price NUMERIC(10, 2) NOT NULL,
    premium_price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TABLE: artisan_earnings (Financial records & Payouts)
CREATE TABLE IF NOT EXISTS public.artisan_earnings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    artisan_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    gross_amount NUMERIC(10, 2) NOT NULL,
    platform_fee NUMERIC(10, 2) NOT NULL DEFAULT 0,
    net_earnings NUMERIC(10, 2) NOT NULL,
    payout_status TEXT NOT NULL DEFAULT 'pending',
    payout_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TABLE: enquiries (Messaging & Communication)
CREATE TABLE IF NOT EXISTS public.enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    requirement_id UUID REFERENCES public.buyer_requirements(id) ON DELETE SET NULL,
    subject TEXT,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TABLE: cart_items (E-commerce shopping cart)
CREATE TABLE IF NOT EXISTS public.cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================================
-- 4. INDEXES FOR HIGH PERFORMANCE
-- =====================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_products_artisan ON public.products(artisan_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_buyer_req_buyer ON public.buyer_requirements(buyer_id);
CREATE INDEX IF NOT EXISTS idx_buyer_req_status ON public.buyer_requirements(status);
CREATE INDEX IF NOT EXISTS idx_quotations_req ON public.quotations(requirement_id);
CREATE INDEX IF NOT EXISTS idx_orders_buyer ON public.orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_artisan ON public.orders(artisan_id);
CREATE INDEX IF NOT EXISTS idx_matches_req ON public.cluster_matches(requirement_id);

-- =====================================================================
-- 5. AUTOMATIC UPDATED_AT TRIGGER
-- =====================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER trg_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER trg_buyer_req_updated_at
    BEFORE UPDATE ON public.buyer_requirements
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER trg_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================================
-- 6. AUTOMATIC AUTH USER PROFILE SYNC TRIGGER
-- =====================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'artisan')
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = EXCLUDED.full_name;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artisan_clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buyer_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cluster_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artisan_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- Public Read access
CREATE POLICY "Public profiles are readable" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Artisan clusters are readable" ON public.artisan_clusters FOR SELECT USING (true);
CREATE POLICY "Products are readable by all" ON public.products FOR SELECT USING (true);
CREATE POLICY "Buyer requirements readable by all" ON public.buyer_requirements FOR SELECT USING (true);
CREATE POLICY "Cluster matches readable by all" ON public.cluster_matches FOR SELECT USING (true);

-- Authenticated User Access
CREATE POLICY "Users can edit own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Artisans can insert/edit own products" ON public.products FOR ALL USING (auth.uid() = artisan_id);
CREATE POLICY "Buyers can insert/edit own requirements" ON public.buyer_requirements FOR ALL USING (auth.uid() = buyer_id);
CREATE POLICY "Artisans can manage own quotations" ON public.quotations FOR ALL USING (auth.uid() = artisan_id);
CREATE POLICY "Buyers and Artisans can view relevant orders" ON public.orders FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = artisan_id);
CREATE POLICY "Buyers can create orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Users manage own pricing calculations" ON public.pricing_calculations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Artisans view own earnings" ON public.artisan_earnings FOR SELECT USING (auth.uid() = artisan_id);
CREATE POLICY "Users view own enquiries" ON public.enquiries FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users send enquiries" ON public.enquiries FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Buyers manage own cart" ON public.cart_items FOR ALL USING (auth.uid() = buyer_id);

-- =====================================================================
-- 8. INITIAL SEED DATA
-- =====================================================================
INSERT INTO public.artisan_clusters (cluster_name, craft_category, state, district, member_count, rating, bio)
VALUES 
('Artisan Cluster — West Bengal', 'Handloom Textiles & Jamdani', 'West Bengal', 'Nadia', 42, 4.90, 'Traditional Jamdani and Kantha embroidery master weavers cluster.'),
('Craft Cooperative — Odisha', 'Pattachitra & Woodwork', 'Odisha', 'Puri', 27, 4.85, 'Heritage painters and wooden toy craft artisans.')
ON CONFLICT DO NOTHING;

INSERT INTO public.products (title, category, material, description, price, minimum_price, recommended_price, premium_price, stock_quantity, keywords)
VALUES
('Handwoven Terracotta Vase', 'Pottery & Ceramics', 'Natural Clay', 'A handcrafted clay vase made using traditional wheel spinning techniques.', 1250.00, 1000.00, 1250.00, 1500.00, 25, ARRAY['pottery', 'clay', 'handmade', 'terracotta']),
('Kantha Embroidered Silk Stole', 'Textiles & Handloom', 'Pure Mulberry Silk', 'Exquisite hand-stitched silk shawl crafted by Bengali women artisans.', 3400.00, 2800.00, 3400.00, 4200.00, 15, ARRAY['handloom', 'embroidery', 'silk', 'kantha'])
ON CONFLICT DO NOTHING;
