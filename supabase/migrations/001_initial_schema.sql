-- InvestorMatch AI Database Schema
-- Initial migration for Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  subscription_tier TEXT NOT NULL DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'premium')),
  stripe_customer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Companies table
CREATE TABLE companies (
  company_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  industry TEXT NOT NULL,
  stage TEXT NOT NULL,
  funding_ask TEXT,
  website TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Investors table
CREATE TABLE investors (
  investor_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  firm TEXT NOT NULL,
  website TEXT,
  investment_thesis TEXT NOT NULL,
  stage_focus TEXT NOT NULL,
  check_size TEXT NOT NULL,
  contact_email TEXT,
  linkedin_profile TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Investment criteria table (for investor filtering)
CREATE TABLE investment_criteria (
  criteria_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  investor_id UUID NOT NULL REFERENCES investors(investor_id) ON DELETE CASCADE,
  industry TEXT NOT NULL,
  stage TEXT NOT NULL,
  location TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Outreach messages table
CREATE TABLE outreach_messages (
  message_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  investor_id UUID NOT NULL REFERENCES investors(investor_id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'replied', 'bounced')),
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Response templates table
CREATE TABLE response_templates (
  template_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('response', 'followup', 'custom')),
  is_public BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(user_id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Usage tracking table
CREATE TABLE usage_tracking (
  usage_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  action_type TEXT NOT NULL CHECK (action_type IN ('outreach', 'search', 'template_create', 'ai_generation')),
  month_year TEXT NOT NULL, -- Format: YYYY-MM
  count INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, action_type, month_year)
);

-- Subscriptions table (for Stripe integration)
CREATE TABLE subscriptions (
  subscription_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT NOT NULL,
  plan_id TEXT NOT NULL CHECK (plan_id IN ('free', 'pro', 'premium')),
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid')),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_companies_user_id ON companies(user_id);
CREATE INDEX idx_investment_criteria_investor_id ON investment_criteria(investor_id);
CREATE INDEX idx_outreach_messages_user_id ON outreach_messages(user_id);
CREATE INDEX idx_outreach_messages_investor_id ON outreach_messages(investor_id);
CREATE INDEX idx_usage_tracking_user_month ON usage_tracking(user_id, month_year);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_id ON subscriptions(stripe_subscription_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_investors_updated_at BEFORE UPDATE ON investors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_outreach_messages_updated_at BEFORE UPDATE ON outreach_messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_response_templates_updated_at BEFORE UPDATE ON response_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE outreach_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = user_id);

-- Companies policies
CREATE POLICY "Users can view own companies" ON companies FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own companies" ON companies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own companies" ON companies FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own companies" ON companies FOR DELETE USING (auth.uid() = user_id);

-- Outreach messages policies
CREATE POLICY "Users can view own messages" ON outreach_messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own messages" ON outreach_messages FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own messages" ON outreach_messages FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own messages" ON outreach_messages FOR DELETE USING (auth.uid() = user_id);

-- Usage tracking policies
CREATE POLICY "Users can view own usage" ON usage_tracking FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own usage" ON usage_tracking FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own usage" ON usage_tracking FOR UPDATE USING (auth.uid() = user_id);

-- Subscriptions policies
CREATE POLICY "Users can view own subscriptions" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own subscriptions" ON subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own subscriptions" ON subscriptions FOR UPDATE USING (auth.uid() = user_id);

-- Investors and templates are public (read-only for users)
CREATE POLICY "Anyone can view investors" ON investors FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can view investment criteria" ON investment_criteria FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can view public templates" ON response_templates FOR SELECT TO authenticated USING (is_public = true);

-- Insert sample investors data
INSERT INTO investors (name, firm, website, investment_thesis, stage_focus, check_size, contact_email, linkedin_profile) VALUES
('Sarah Chen', 'Accel Partners', 'https://accel.com', 'B2B SaaS, fintech, and developer tools with strong product-market fit', 'Series A', '$2M - $10M', 'sarah@accel.com', 'https://linkedin.com/in/sarahchen'),
('Michael Rodriguez', 'Sequoia Capital', 'https://sequoiacap.com', 'Early-stage consumer and enterprise technology companies', 'Seed', '$500K - $3M', 'michael@sequoiacap.com', 'https://linkedin.com/in/michaelrodriguez'),
('Emily Johnson', 'Bessemer Venture Partners', 'https://bvp.com', 'Cloud infrastructure, developer tools, and vertical SaaS', 'Series B', '$5M - $25M', 'emily@bvp.com', 'https://linkedin.com/in/emilyjohnson'),
('David Kim', 'Andreessen Horowitz', 'https://a16z.com', 'AI/ML, crypto, and consumer applications with network effects', 'Series A', '$3M - $15M', 'david@a16z.com', 'https://linkedin.com/in/davidkim'),
('Lisa Wang', 'General Catalyst', 'https://generalcatalyst.com', 'Healthcare technology and B2B marketplaces', 'Seed', '$1M - $5M', 'lisa@generalcatalyst.com', 'https://linkedin.com/in/lisawang');

-- Insert investment criteria for sample investors
INSERT INTO investment_criteria (investor_id, industry, stage, location) VALUES
((SELECT investor_id FROM investors WHERE name = 'Sarah Chen'), 'SaaS', 'Series A', 'San Francisco'),
((SELECT investor_id FROM investors WHERE name = 'Sarah Chen'), 'Fintech', 'Series A', 'San Francisco'),
((SELECT investor_id FROM investors WHERE name = 'Michael Rodriguez'), 'Consumer Tech', 'Seed', 'Palo Alto'),
((SELECT investor_id FROM investors WHERE name = 'Michael Rodriguez'), 'Enterprise', 'Seed', 'Palo Alto'),
((SELECT investor_id FROM investors WHERE name = 'Emily Johnson'), 'Cloud Infrastructure', 'Series B', 'New York'),
((SELECT investor_id FROM investors WHERE name = 'Emily Johnson'), 'Developer Tools', 'Series B', 'New York'),
((SELECT investor_id FROM investors WHERE name = 'David Kim'), 'AI/ML', 'Series A', 'Menlo Park'),
((SELECT investor_id FROM investors WHERE name = 'David Kim'), 'Crypto', 'Series A', 'Menlo Park'),
((SELECT investor_id FROM investors WHERE name = 'Lisa Wang'), 'Healthcare', 'Seed', 'Boston'),
((SELECT investor_id FROM investors WHERE name = 'Lisa Wang'), 'Marketplace', 'Seed', 'Boston');

-- Insert sample response templates
INSERT INTO response_templates (name, content, type, is_public) VALUES
('Initial Interest Response', 'Thank you for your interest in [COMPANY_NAME]. I''m excited to share more details about our progress.

Here are some key updates since our last conversation:
- [KEY_METRIC_1]
- [KEY_METRIC_2] 
- [KEY_ACHIEVEMENT]

I''d love to schedule a call to discuss how we align with your investment thesis. Are you available for a 30-minute call next week?

Best regards,
[FOUNDER_NAME]', 'response', true),

('Follow-up After Meeting', 'Hi [INVESTOR_NAME],

Thank you for taking the time to meet with our team yesterday. It was great to discuss [SPECIFIC_TOPIC] and learn more about [FIRM_NAME]''s approach to [INVESTMENT_AREA].

As promised, I''m attaching:
- Updated pitch deck with the financial projections we discussed
- Customer testimonials and case studies
- Technical architecture overview

I''m happy to arrange introductions to our key customers or advisors if that would be helpful for your due diligence process.

Looking forward to your feedback!

Best,
[FOUNDER_NAME]', 'followup', true),

('Due Diligence Information', 'Hi [INVESTOR_NAME],

Thanks for moving forward with due diligence. I''ve prepared the information you requested:

Financial Information:
- 3-year financial projections
- Current burn rate and runway
- Revenue breakdown by customer segment

Legal & Corporate:
- Cap table and employee equity breakdown
- IP portfolio and pending patents
- Key contracts and partnerships

I''ll have our legal team share the data room access shortly. Please let me know if you need any additional information.

Best regards,
[FOUNDER_NAME]', 'response', true);
