# InvestorMatch AI

**Craft personalized investor outreach in seconds.**

InvestorMatch AI helps founders find and craft personalized outreach messages for investors, increasing their chances of getting funded through AI-powered personalization and a curated investor database.

## 🚀 Features

### Core Features
- **Investor Discovery Engine**: Search and filter investors by industry, stage, check size, location, and investment thesis
- **AI-Powered Outreach Generator**: Generate personalized outreach emails using OpenAI's GPT models
- **Response Templates & Follow-up**: Pre-written templates and automated follow-up scheduling
- **Usage Analytics**: Track outreach performance and response rates
- **Subscription Management**: Tiered pricing with usage limits and Stripe integration

### Technical Features
- **Real-time Authentication**: Supabase Auth integration
- **Database Management**: PostgreSQL with Row Level Security
- **AI Integration**: OpenAI GPT-4 for message generation
- **Payment Processing**: Stripe for subscription billing
- **Responsive Design**: Mobile-first UI with Tailwind CSS
- **Error Handling**: Comprehensive error boundaries and user feedback

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **AI**: OpenAI GPT-4
- **Payments**: Stripe
- **Deployment**: Docker, Vercel/Netlify ready

## 📋 Prerequisites

Before running this application, make sure you have:

- Node.js 18+ installed
- A Supabase account and project
- An OpenAI API key
- A Stripe account (for payments)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/vistara-apps/this-is-a-1862.git
cd this-is-a-1862
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the example environment file and configure your API keys:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual API keys:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI Configuration
VITE_OPENAI_API_KEY=your_openai_api_key

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# App Configuration
VITE_APP_URL=http://localhost:5173
```

### 4. Database Setup

Run the Supabase migration to set up your database:

```bash
# If you have Supabase CLI installed
supabase db reset

# Or manually run the SQL in supabase/migrations/001_initial_schema.sql
# in your Supabase dashboard
```

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AppShell.jsx    # Main app layout
│   ├── ErrorBoundary.jsx
│   └── LoadingSpinner.jsx
├── contexts/           # React contexts
│   ├── AuthContext.jsx # Authentication state
│   └── DataContext.jsx # Application data
├── pages/              # Route components
│   ├── Dashboard.jsx
│   ├── InvestorDiscovery.jsx
│   ├── OutreachGenerator.jsx
│   ├── ResponseTemplates.jsx
│   ├── AuthPage.jsx
│   └── Onboarding.jsx
├── services/           # API integrations
│   ├── supabase.js     # Database & auth
│   ├── openai.js       # AI message generation
│   └── stripe.js       # Payment processing
├── utils/              # Utility functions
│   └── prompts.js      # AI prompt templates
└── config/             # Configuration
    └── index.js        # Environment config
```

## 🔧 Configuration

### Supabase Setup

1. Create a new Supabase project
2. Run the migration script in `supabase/migrations/001_initial_schema.sql`
3. Configure Row Level Security policies
4. Add your Supabase URL and anon key to `.env.local`

### OpenAI Setup

1. Get an API key from OpenAI
2. Add it to your `.env.local` file
3. Configure usage limits in your OpenAI dashboard

### Stripe Setup

1. Create a Stripe account
2. Set up your products and pricing
3. Add your publishable key to `.env.local`
4. Configure webhooks for subscription events

## 💳 Subscription Plans

- **Free**: 5 outreach messages/month, 10 investor searches, 3 templates
- **Pro ($29/month)**: 50 outreach messages/month, 100 searches, 10 templates, analytics
- **Premium ($79/month)**: Unlimited usage, advanced features, priority support

## 🚀 Deployment

### Docker Deployment

```bash
# Build the Docker image
docker build -t investormatch-ai .

# Run the container
docker run -p 3000:3000 investormatch-ai
```

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Environment Variables for Production

Make sure to set all required environment variables in your deployment platform:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_OPENAI_API_KEY`
- `VITE_STRIPE_PUBLISHABLE_KEY`

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint (when configured)

### Code Style

- Use functional components with hooks
- Follow React best practices
- Use Tailwind CSS for styling
- Implement proper error handling
- Add loading states for async operations

## 🔒 Security

- Row Level Security (RLS) enabled on all user data
- API keys stored securely in environment variables
- Input validation on all forms
- XSS protection through React's built-in escaping
- HTTPS enforced in production

## 📊 Analytics & Monitoring

- Usage tracking for subscription limits
- Error boundary for crash reporting
- Performance monitoring ready
- User analytics integration points

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, please contact:
- Email: support@investormatch.ai
- Documentation: [docs.investormatch.ai](https://docs.investormatch.ai)
- Issues: [GitHub Issues](https://github.com/vistara-apps/this-is-a-1862/issues)

## 🎯 Roadmap

- [ ] Email integration (Gmail, Outlook)
- [ ] CRM integrations (HubSpot, Salesforce)
- [ ] Advanced analytics dashboard
- [ ] Mobile app
- [ ] API for third-party integrations
- [ ] Multi-language support

---

Built with ❤️ by the InvestorMatch AI team
