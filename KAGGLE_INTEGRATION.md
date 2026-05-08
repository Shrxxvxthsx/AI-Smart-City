# Kaggle Dataset Integration Guide

This project can now use **real traffic data** from Kaggle's Bangalore Traffic Dataset instead of mock data.

## 📊 What You Get

- **Real-world traffic conditions** from Bangalore
- **Actual traffic patterns** and congestion data
- **Historical data** to populate your dashboards
- **AI-ready metrics** for analysis and predictions

---

## 🚀 Quick Start (5 minutes)

### Step 1: Install Kaggle Integration

```bash
python scripts/setup_kaggle.py
```

This will:
1. Install `kagglehub` package
2. Guide you through Kaggle API setup
3. Download the traffic dataset

### Step 2: Load Traffic Data

```bash
python scripts/seed_with_kaggle.py
```

This generates `traffic_reports.json` with real data.

### Step 3: Seed Your Database

```bash
npm run seed:firebase
# or
npm run seed:supabase
```

The seed scripts will automatically use the Kaggle data if available!

---

## 📋 Manual Setup (If Preferred)

### 1. Get Kaggle API Credentials

**Windows/Mac/Linux:**

1. Go to: https://www.kaggle.com/settings/account
2. Scroll to **API** section
3. Click **"Create New API Token"** (downloads `kaggle.json`)
4. Save to:
   - **Windows**: `C:\Users\YourUsername\.kaggle\kaggle.json`
   - **Mac/Linux**: `~/.kaggle/kaggle.json`

### 2. Install Python Package

```bash
pip install kagglehub pandas
```

### 3. Load the Dataset

```bash
python scripts/load_kaggle_traffic.py
```

### 4. Transform & Seed

```bash
python scripts/seed_with_kaggle.py
```

---

## 📁 Dataset Details

**Dataset**: [preethamgouda/banglore-city-traffic-dataset](https://www.kaggle.com/datasets/preethamgouda/banglore-city-traffic-dataset)

**Includes**:
- Traffic conditions (Light, Moderate, Heavy, Very Heavy)
- Average speeds
- Congestion levels
- Geographic data for Bangalore areas

---

## 🔄 Workflow

### Scenario 1: Quick Demo (No Kaggle Setup)

```bash
npm run seed:firebase
```
→ Uses mock traffic data (12 sample reports)

### Scenario 2: With Real Data (Recommended)

```bash
# Setup once
python scripts/setup_kaggle.py

# Then seed with real data
python scripts/seed_with_kaggle.py
npm run seed:firebase
```
→ Uses real Bangalore traffic data

### Scenario 3: Manual Data Processing

```bash
# Load and inspect the data
python scripts/load_kaggle_traffic.py

# Check the generated JSON
cat traffic_reports.json

# Then seed
npm run seed:firebase
```

---

## 📊 Data Transformation

The Python scripts transform raw Kaggle data into our report format:

**Raw Kaggle Data** →
```json
{
  "Traffic_Condition": "Heavy",
  "Average_Speed": 25,
  "Congestion_Level": "High"
}
```

↓ Transforms to ↓

**Our Report Format** →
```json
{
  "category": "traffic",
  "description": "Traffic condition: Heavy. Average speed: 25 km/h.",
  "priority": "high",
  "severity_score": 75,
  "aiAnalysis": {
    "summary": "Heavy traffic detected at Koramangala",
    "predictedImpact": "Affects approximately 50,000 commuters",
    "suggestedActions": [
      "Deploy traffic personnel",
      "Send public alerts",
      "Suggest alternate routes"
    ]
  }
}
```

---

## 🛠️ Troubleshooting

### "kagglehub not installed"
```bash
pip install kagglehub
```

### "Kaggle API credentials not found"
1. Download kaggle.json from https://www.kaggle.com/settings/account
2. Place in `~/.kaggle/kaggle.json` (or Windows equivalent)
3. Run again

### "Dataset not found"
- Make sure you have internet connection
- Verify Kaggle API credentials are correct
- Try: `python scripts/load_kaggle_traffic.py`

### "Permission denied" on kaggle.json
**Windows**:
```powershell
icacls "$env:USERPROFILE\.kaggle\kaggle.json" /inheritance:r /grant:r "$env:USERNAME":"(F)"
```

**Mac/Linux**:
```bash
chmod 600 ~/.kaggle/kaggle.json
```

---

## 📝 Customization

### Modify Traffic Data Processing

Edit `scripts/load_kaggle_traffic.py`:

```python
# Change severity mapping
severity_map = {
    'Light': 'low',
    'Moderate': 'medium',
    'Heavy': 'high',
    'Very Heavy': 'critical'
}

# Add more Bangalore locations
bangalore_locations = [
    {"name": "Your Location", "lat": 12.9XX, "lng": 77.6XX},
    # ...
]
```

### Generate Custom Traffic Data

Edit `scripts/seed_with_kaggle.py` → `generate_fallback_traffic_data()` function

---

## 🔗 Integration with TypeScript Seeding

The TypeScript seed scripts (`seed-firebase.ts`, `seed-supabase.ts`) automatically:

1. Check for `traffic_reports.json` in project root
2. Use real data if available
3. Fall back to mock data otherwise

**No code changes needed!** Just run:
```bash
python scripts/seed_with_kaggle.py
npm run seed:firebase
```

---

## 📈 Example: Using Traffic Data in Your App

### Display Real Traffic Reports

```tsx
import { useSupabaseQuery } from '@/hooks/useSupabase';

export function TrafficDashboard() {
  const { data: trafficReports } = useSupabaseQuery(
    'reports',
    { 
      column: 'category',
      value: 'traffic'
    }
  );

  return (
    <div>
      <h2>Real Bangalore Traffic Data</h2>
      {trafficReports.map(report => (
        <div key={report.id}>
          <h3>{report.location.address}</h3>
          <p>{report.description}</p>
          <p>Priority: {report.priority}</p>
        </div>
      ))}
    </div>
  );
}
```

### Analyze Traffic Patterns

```tsx
import { useSupabaseSubscription } from '@/hooks/useSupabase';

export function TrafficAnalytics() {
  const { data: liveTraffic } = useSupabaseSubscription(
    'reports',
    (payload) => {
      console.log('New traffic report:', payload);
      // Update charts, alerts, etc.
    }
  );
  
  // Your analytics here
}
```

---

## 🚀 Next Steps

1. **Set Up Kaggle**: `python scripts/setup_kaggle.py`
2. **Download Data**: `python scripts/seed_with_kaggle.py`
3. **Seed Database**: `npm run seed:firebase`
4. **View Results**: `npm run dev` → http://localhost:3000
5. **Explore**: Check Admin Dashboard, Public Map, etc.

---

## 📚 Resources

- [Kaggle Dataset](https://www.kaggle.com/datasets/preethamgouda/banglore-city-traffic-dataset)
- [KaggleHub Documentation](https://github.com/Kaggle/kagglehub)
- [Project Seeding Guide](SEED_DATABASE.md)
- [Supabase Integration](SUPABASE_SETUP.md)

---

## 💡 Tips

**Tip 1**: Run setup once, then you can regenerate traffic data anytime:
```bash
python scripts/seed_with_kaggle.py  # Updates traffic_reports.json
npm run seed:firebase               # Seeds new data
```

**Tip 2**: Combine with other data sources:
```bash
python scripts/seed_with_kaggle.py  # Traffic from Kaggle
npm run seed:firebase                # Mock data + real traffic
```

**Tip 3**: Check generated data before seeding:
```bash
cat traffic_reports.json | head -50
```

**Tip 4**: Keep seed data version controlled:
```bash
git add traffic_reports.json  # Track generated data
git commit -m "Update traffic data from Kaggle"
```

---

## Support

For issues:
1. Check [SEED_DATABASE.md](SEED_DATABASE.md) troubleshooting section
2. Review Python script error messages
3. Verify Kaggle credentials: `python scripts/load_kaggle_traffic.py`

Enjoy your real-world traffic data! 🚦📊
