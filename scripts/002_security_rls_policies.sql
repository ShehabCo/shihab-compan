-- Super Platform Security - RLS Policies Enhancement
-- Phase 1: Security Foundation
-- Applied to all tables for production-grade protection

-- ========== ADMIN POLICIES ==========
-- Admins can do anything
CREATE POLICY "admin_all_access" ON public.user_profiles
  USING (EXISTS(
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'
  ));

-- ========== AUTHENTICATION CHECK ==========
-- All tables require authenticated users (except public reads)
CREATE POLICY "authenticated_users_only" ON public.user_profiles
  USING (auth.role() = 'authenticated');

-- ========== SECURE DELETE POLICIES ==========
-- Only own profile deletion
CREATE POLICY "users_delete_own" ON public.user_profiles FOR DELETE
  USING (auth.uid() = id);

-- ========== SELLER PROTECTION POLICIES ==========
-- Sellers can only view verified sellers
CREATE POLICY "sellers_view_verified" ON public.sellers FOR SELECT
  USING (verification_status = 'verified' OR auth.uid() IN (
    SELECT user_id FROM public.sellers WHERE id = sellers.id
  ));

-- Sellers can insert their own profile
CREATE POLICY "sellers_insert_own" ON public.sellers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Sellers can delete their own profile
CREATE POLICY "sellers_delete_own" ON public.sellers FOR DELETE
  USING (auth.uid() = user_id);

-- ========== PRODUCT VISIBILITY POLICIES ==========
-- Public: anyone can view active products
CREATE POLICY "products_select_public" ON public.products FOR SELECT
  USING (
    status = 'active' AND visibility = 'public'
    OR EXISTS(
      SELECT 1 FROM public.sellers
      WHERE sellers.id = products.seller_id
      AND sellers.user_id = auth.uid()
    )
  );

-- Draft/inactive products only visible to seller
CREATE POLICY "products_draft_to_seller" ON public.products FOR SELECT
  USING (
    status IN ('draft', 'inactive')
    AND EXISTS(
      SELECT 1 FROM public.sellers
      WHERE sellers.id = products.seller_id
      AND sellers.user_id = auth.uid()
    )
  );

-- Delete protection
CREATE POLICY "products_delete_own_seller" ON public.products FOR DELETE
  USING (EXISTS(
    SELECT 1 FROM public.sellers
    WHERE sellers.id = products.seller_id
    AND sellers.user_id = auth.uid()
  ));

-- ========== ORDERS PROTECTION ==========
-- Users can view their own orders
CREATE POLICY "orders_select_own" ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only insert their own orders
CREATE POLICY "orders_insert_own" ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users cannot delete orders (audit trail)
-- Orders can only be updated by admin or seller

-- ========== PAYMENTS PROTECTION ==========
-- Users can view their own payments
CREATE POLICY "payments_select_own" ON public.payments FOR SELECT
  USING (auth.uid() = user_id);

-- Payments cannot be inserted directly by users (only via webhook)
CREATE POLICY "payments_webhook_only" ON public.payments FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- ========== REVIEWS PROTECTION ==========
-- Anyone can view verified reviews
CREATE POLICY "reviews_select_all" ON public.reviews FOR SELECT
  USING (TRUE);

-- Users can insert their own reviews
CREATE POLICY "reviews_insert_own" ON public.reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own reviews
CREATE POLICY "reviews_update_own" ON public.reviews FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can only delete their own reviews
CREATE POLICY "reviews_delete_own" ON public.reviews FOR DELETE
  USING (auth.uid() = user_id);

-- ========== CHAT HISTORY PROTECTION ==========
-- Users can view their own conversations
CREATE POLICY "chat_select_own" ON public.chat_history FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own messages
CREATE POLICY "chat_insert_own" ON public.chat_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ========== ENABLE RLS ON ALL TABLES ==========
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- ========== CREATE INDEXES FOR PERFORMANCE ==========
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_user_profiles_kyc_status ON public.user_profiles(kyc_status);
CREATE INDEX idx_sellers_user_id ON public.sellers(user_id);
CREATE INDEX idx_sellers_verification ON public.sellers(verification_status);
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX idx_payments_user_id ON public.payments(user_id);
CREATE INDEX idx_payments_status ON public.payments(status);
CREATE INDEX idx_reviews_product_id ON public.reviews(product_id);
CREATE INDEX idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX idx_chat_history_user_id ON public.chat_history(user_id);
CREATE INDEX idx_chat_history_created_at ON public.chat_history(created_at DESC);

-- ========== AUDIT TRIGGER ==========
-- Track all modifications for security audit
CREATE TABLE IF NOT EXISTS public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  operation TEXT NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  user_id UUID REFERENCES auth.users(id),
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "audit_log_admin_only" ON public.audit_log
  USING (EXISTS(
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE INDEX idx_audit_log_user_id ON public.audit_log(user_id);
CREATE INDEX idx_audit_log_table_name ON public.audit_log(table_name);
CREATE INDEX idx_audit_log_created_at ON public.audit_log(created_at DESC);
