# 🚀 Quick Start: Seeding Your Database

This guide will get you up and running with sample data in minutes.

---

## Choose Your Database

### Option 1: Firebase (Recommended for Quick Start)

**Fastest Setup - 5 minutes**

1. **Get Service Account Key**
   - Go to: https://console.firebase.google.com → Your Project → Settings → Service Accounts
   - Click "Generate New Private Key"
   - Save as `firebase-admin-key.json` in project root

2. **Run Seed**
   ```bash
   npm run seed:firebase
   ```

3. **Done!** You'll see:
   ```
   ✅ Database seeding completed successfully!
   
   📋 Test Credentials:
   ──────────────────────────────────────────────
   Email: admin@iks-smartcity.gov
   Password: Admin@123456
   ```

---

### Option 2: Supabase

**More Setup - but excellent for production**

1. **Create Tables**
   - Go to: https://app.supabase.com → Your Project → SQL Editor
   - Paste the SQL from [SEED_DATABASE.md](SEED_DATABASE.md#create-required-tables-in-supabase)
   - Execute

2. **Get Credentials**
   - Go to: Settings → API
   - Copy Project URL and SERVICE ROLE KEY (⚠️ not the anon key)

3. **Add to .env.local**
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
   ```

4. **Run Seed**
   ```bash
   npm run seed:supabase
   ```

---

## View the Data

### Start the App
```bash
npm run dev
```
Opens at: http://localhost:3000

### Login & Explore

1. **Department Portal**
   - Go to "Department Login" 
   - Email: `admin@iks-smartcity.gov`
   - Password: `Admin@123456`
   - View all reports in Admin Dashboard

2. **Public Map**
   - See all citizen reports on an interactive map
   - Filter by category

3. **Intelligence Center**
   - View AI-powered city metrics and insights
   - See hourly trends for AQI, traffic, water, energy, waste

4. **Citizen Portal**
   - Submit new reports (gets added to database in real-time)

---

## What Data Gets Created?

### ✅ 3 Test User Accounts
```
admin@iks-smartcity.gov       → Password: Admin@123456
traffic@iks-smartcity.gov     → Password: Traffic@123456
pollution@iks-smartcity.gov   → Password: Pollution@123456
```

### ✅ 12 Realistic City Reports
- **Categories**: Traffic, Pollution, Waste, Water, Energy, Agriculture, Safety
- **Statuses**: Pending, In-Progress, Resolved, Escalated
- **Locations**: 8 different areas of Bangalore
- **AI Analysis**: Each report has severity scores and suggested actions

### ✅ 120 City Metrics
- **5 Metric Types**: Air Quality (AQI), Traffic Load, Water Level, Energy Efficiency, Waste Collected
- **24 Hours of Data**: Hourly data points showing realistic patterns
- **Real Values**: AQI in µg/m³, Traffic in vehicles/min, etc.

---

## Example Data Points

### Sample Report
```json
{
  "citizenId": "citizen_001",
  "citizenName": "Citizen 1",
  "category": "traffic",
  "description": "Heavy congestion at main intersection during peak hours",
  "location": {
    "lat": 12.9716,
    "lng": 77.5946,
    "address": "Koramangala, Bangalore"
  },
  "status": "in-progress",
  "priority": "high",
  "assignedDept": "Traffic",
  "aiAnalysis": {
    "summary": "Analysis of traffic issue...",
    "severityScore": 87,
    "suggestedActions": [
      "Deploy traffic personnel",
      "Reroute traffic",
      "Notify public"
    ]
  }
}
```

### Sample Metrics
```json
{
  "type": "aqi",
  "value": 156,
  "unit": "µg/m³",
  "timestamp": "2026-05-08T12:00:00Z",
  "region": "Central Bangalore"
}
```

---

## Troubleshooting

### "Cannot find firebase-admin-key.json"
**Solution**: Download from Firebase Console or set environment variable:
```bash
export FIREBASE_SERVICE_ACCOUNT_KEY=/path/to/key.json
```

### "Supabase tables don't exist"
**Solution**: Run the SQL creation commands in Supabase SQL Editor first

### "Permission denied" errors
**Firebase**: Enable Firestore read/write in Security Rules
**Supabase**: Create Row Level Security policies (see SEED_DATABASE.md)

---

## Customizing the Data

Edit these files to change seed data:
- **Firebase**: `scripts/seed-firebase.ts` → Change `descriptions`, `locations`, etc.
- **Supabase**: `scripts/seed-supabase.ts` → Same customizations

Regenerate by running the seed command again (old data will be overwritten).

---

## Next Steps

✅ **Data seeded!** Now:

1. **Customize Reports**: Edit `scripts/seed-*.ts` files
2. **Configure AI**: Set up GEMINI_API_KEY for AI insights
3. **Enable Real-time**: Use WebSockets for live updates
4. **Deploy**: Follow deployment guide in README.md

---

## Need Help?

See detailed docs:
- [SEED_DATABASE.md](SEED_DATABASE.md) - Comprehensive seeding guide
- [SUPABASE_SETUP.md](SUPABASE_SETUP.md) - Supabase integration details
- [README.md](README.md) - Full project documentation
