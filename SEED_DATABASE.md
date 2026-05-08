# Database Seeding Guide

This document explains how to populate the project database with realistic test data.

## Overview

The project includes two seed scripts:
- **Firebase Seeding**: For Firebase/Firestore database
- **Supabase Seeding**: For Supabase database

Both scripts will create:
- 3 test user accounts for authentication
- 12 citizen reports (varied categories, locations, statuses)
- 120 city metric data points (hourly data for 5 metric types over 24 hours)

---

## Prerequisites

1. Ensure all dependencies are installed:
   ```bash
   npm install
   ```

2. Choose your database (Firebase or Supabase) and have credentials ready

---

## Firebase Seeding

### Setup Steps

1. **Download Service Account Key**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Select your project
   - Navigate to: **Project Settings** → **Service Accounts** → **Firebase Admin SDK**
   - Click **Generate New Private Key**
   - Save the downloaded JSON file as `firebase-admin-key.json` in the project root

2. **Alternative: Use Environment Variable**
   ```bash
   export FIREBASE_SERVICE_ACCOUNT_KEY=/path/to/your/service-account-key.json
   ```

3. **Create Required Collections in Firestore**
   
   Make sure these collections exist in your Firestore database:
   - `reports` - for citizen reports
   - `metrics` - for city metrics

   If they don't exist, the seed script will create documents in them.

4. **Run Seed Script**
   ```bash
   npm run seed:firebase
   ```

### What Gets Created

```
✓ 3 Test Users in Firebase Auth:
  - admin@iks-smartcity.gov (Admin@123456)
  - traffic@iks-smartcity.gov (Traffic@123456)
  - pollution@iks-smartcity.gov (Pollution@123456)

✓ 12 Citizen Reports in 'reports' collection:
  - Categories: traffic, pollution, waste, water, energy, agriculture, safety
  - Status: pending, in-progress, resolved, escalated
  - Priority: low, medium, high, critical
  - Includes AI analysis with severity scores
  - Geolocations in Bangalore region

✓ 120 City Metrics in 'metrics' collection:
  - Types: aqi, traffic_load, water_level, energy_efficiency, waste_collected
  - 24 hourly data points for each metric type
  - Realistic values with hourly variations
```

---

## Supabase Seeding

### Setup Steps

1. **Create Required Tables in Supabase**

   Go to Supabase SQL Editor and run these commands:

   ```sql
   -- Create reports table
   CREATE TABLE reports (
     id BIGSERIAL PRIMARY KEY,
     citizen_id TEXT NOT NULL,
     citizen_name TEXT NOT NULL,
     category TEXT NOT NULL CHECK (category IN ('traffic', 'pollution', 'waste', 'water', 'energy', 'agriculture', 'safety')),
     description TEXT NOT NULL,
     image_url TEXT,
     location JSONB,
     status TEXT NOT NULL CHECK (status IN ('pending', 'in-progress', 'resolved', 'escalated')),
     priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
     ai_analysis JSONB,
     assigned_dept TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create metrics table
   CREATE TABLE metrics (
     id BIGSERIAL PRIMARY KEY,
     type TEXT NOT NULL CHECK (type IN ('aqi', 'traffic_load', 'water_level', 'energy_efficiency', 'waste_collected')),
     value DECIMAL NOT NULL,
     unit TEXT NOT NULL,
     timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     region TEXT NOT NULL
   );

   -- Create indexes for better performance
   CREATE INDEX idx_reports_category ON reports(category);
   CREATE INDEX idx_reports_status ON reports(status);
   CREATE INDEX idx_metrics_type ON metrics(type);
   CREATE INDEX idx_metrics_timestamp ON metrics(timestamp);
   ```

2. **Get Supabase Credentials**
   - Go to [Supabase Dashboard](https://app.supabase.com)
   - Select your project
   - Navigate to: **Settings** → **API**
   - Copy the **Project URL** and **Service Role Key** (NOT the anon key)

3. **Add Credentials to .env.local**
   ```bash
   VITE_SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs... # your service role key
   ```

4. **Run Seed Script**
   ```bash
   npm run seed:supabase
   ```

### What Gets Created

```
✓ 3 Test Users in Supabase Auth:
  - admin@iks-smartcity.gov (Admin@123456)
  - traffic@iks-smartcity.gov (Traffic@123456)
  - pollution@iks-smartcity.gov (Pollution@123456)

✓ 12 Citizen Reports in 'reports' table:
  - Same as Firebase seeding above

✓ 120 City Metrics in 'metrics' table:
  - Same as Firebase seeding above
```

---

## Testing the Seeded Data

### 1. View Reports in Admin Dashboard
```
1. Start the dev server: npm run dev
2. Navigate to: http://localhost:3000
3. Go to Department Login page
4. Sign in with: admin@iks-smartcity.gov / Admin@123456
5. View all reports in the Admin Dashboard
```

### 2. View Map with Live Reports
```
1. Go to Public Map page
2. See all citizen reports plotted on the map
3. Filter by category using the sidebar
```

### 3. View Intelligence Center
```
1. Go to Intelligence Center page
2. See the city metrics displayed as charts
3. Get AI insights about the data
```

### 4. Submit New Report as Citizen
```
1. Go to Citizen Portal page
2. Submit a new report (creates new data in database)
3. View it appears in Admin Dashboard and Public Map
```

---

## Data Structure Details

### CitizenReport Schema
```typescript
{
  id: string;
  citizenId: string;
  citizenName: string;
  category: 'traffic' | 'pollution' | 'waste' | 'water' | 'energy' | 'agriculture' | 'safety';
  description: string;
  imageUrl?: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  status: 'pending' | 'in-progress' | 'resolved' | 'escalated';
  priority: 'low' | 'medium' | 'high' | 'critical';
  aiAnalysis?: {
    summary: string;
    predictedImpact: string;
    suggestedActions: string[];
    severityScore: number; // 0-100
  };
  assignedDept?: string;
  createdAt: timestamp;
  updatedAt: timestamp;
}
```

### CityMetric Schema
```typescript
{
  id: string;
  type: 'aqi' | 'traffic_load' | 'water_level' | 'energy_efficiency' | 'waste_collected';
  value: number;
  unit: string;
  timestamp: timestamp;
  region: string;
}
```

---

## Troubleshooting

### Firebase Issues

**Error: "firebase-admin-key.json not found"**
- Ensure the service account key file is in the project root
- Or set the `FIREBASE_SERVICE_ACCOUNT_KEY` environment variable
- Check file permissions

**Error: "Permission denied"**
- Make sure your Firestore security rules allow writes to `reports` and `metrics` collections
- During development, you can use permissive rules:
  ```
  match /{document=**} {
    allow read, write: if true;
  }
  ```

### Supabase Issues

**Error: "Missing Supabase credentials"**
- Verify `VITE_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set in `.env.local`
- Make sure you're using the SERVICE ROLE KEY, not the anon key
- Restart the dev server after updating `.env.local`

**Error: "Table does not exist"**
- Run the SQL commands above to create the tables
- Ensure RLS policies allow inserts (see next section)

**Enable Row Level Security (RLS)**

For development, allow authenticated users to access data:

```sql
-- Enable RLS on tables
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read all data
CREATE POLICY "Allow authenticated read" ON reports
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated read" ON metrics
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to insert their own reports
CREATE POLICY "Allow users to insert reports" ON reports
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow service role to insert metrics (for seeding)
CREATE POLICY "Allow service role all access" ON metrics
  FOR ALL
  TO service_role
  USING (true);
```

---

## Clearing Data

### Clear Firebase Data
```bash
# Delete collection from Firebase Console:
# 1. Go to Firestore Database
# 2. Right-click on 'reports' collection → Delete collection
# 3. Right-click on 'metrics' collection → Delete collection
# 4. Re-run seed script
```

### Clear Supabase Data
```sql
-- Delete all data from tables
DELETE FROM reports;
DELETE FROM metrics;

-- Reset sequences
ALTER SEQUENCE reports_id_seq RESTART WITH 1;
ALTER SEQUENCE metrics_id_seq RESTART WITH 1;
```

---

## Customizing Seed Data

Edit the respective seed file to customize:

**For Firebase** (`scripts/seed-firebase.ts`):
- Modify `descriptions` object for different report text
- Change `locations` array for different coordinates
- Adjust data generation ranges (e.g., number of reports)

**For Supabase** (`scripts/seed-supabase.ts`):
- Same customizations as Firebase script
- Remember to use snake_case for database column names

---

## Running Multiple Seeds

You can run both seeds if your project needs to support both databases:

```bash
npm run seed:firebase
npm run seed:supabase
```

This is useful for testing or multi-backend support.

---

## Next Steps

After seeding:

1. **Explore the Dashboard**: View reports and metrics
2. **Test Features**: Submit new reports, update statuses
3. **Configure AI**: Set up Gemini API for AI analysis
4. **Set Up Monitoring**: Configure alerts and notifications
5. **Customize Data**: Modify seed data to match your city's needs

For more information, see [SUPABASE_SETUP.md](SUPABASE_SETUP.md) and [README.md](README.md).
