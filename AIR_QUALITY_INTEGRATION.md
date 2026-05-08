# Air Quality Dataset Integration Guide

Integrate **real air quality data from Bengaluru** into your smart city application using the OpenCity dataset.

## 📊 Dataset Details

**Name**: Bengaluru Hourly Air Quality Reports  
**Source**: [OpenCity Data Portal](https://data.opencity.in/dataset/bengaluru-hourly-air-quality-reports)  
**Data**: Hourly AQI readings from monitoring stations across Bangalore

**Includes**:
- Air Quality Index (AQI) values
- PM2.5 concentrations
- PM10 measurements
- Timestamp data
- Multiple monitoring stations

---

## 🚀 Quick Start (5 minutes)

### Option 1: Automatic Download (If Python packages installed)

```bash
python scripts/load_air_quality.py
```

This will attempt to:
1. Fetch data from OpenCity API
2. Transform it to app format
3. Save as `air_quality_reports.json`

### Option 2: Manual Download

1. **Download Dataset**
   - Go to: https://data.opencity.in/dataset/bengaluru-hourly-air-quality-reports
   - Click "Download" → CSV format
   - Save to project root as `bengaluru_air_quality.csv`

2. **Transform & Seed**
   ```bash
   python scripts/load_air_quality.py
   npm run seed:firebase
   ```

### Option 3: Use Fallback Data

If you don't have the dataset, the seeding scripts automatically generate realistic air quality data:

```bash
npm run seed:firebase
```

---

## 🔄 Workflow

### Full Integration with Real Data

```bash
# 1. Download/load air quality data
python scripts/load_air_quality.py

# 2. Check the generated file
cat air_quality_reports.json

# 3. Seed your database
npm run seed:firebase
# or
npm run seed:supabase
```

### Combine with Traffic Data

```bash
# Load both datasets
python scripts/seed_with_kaggle.py       # Kaggle traffic data
python scripts/seed_with_air_quality.py  # OpenCity air quality data

# Seed with combined data
npm run seed:firebase
```

---

## 📈 Data Mapping

### AQI Category Mapping

| AQI Range | Category | Priority | Health Impact |
|-----------|----------|----------|---------------|
| 0-50 | Good | Low | Minimal risk |
| 51-100 | Satisfactory | Low | Acceptable |
| 101-200 | Moderate | Medium | Caution for sensitive groups |
| 201-300 | Poor | High | Health advisory issued |
| 301-400 | Very Poor | High | Everyone affected |
| 401+ | Severe | Critical | Health emergency |

### Monitoring Stations Tracked

- **Fort** - Central Bangalore
- **Jayanagar** - South Bangalore
- **Sanjay Nagar** - East Bangalore
- **Yelahanka** - North Bangalore
- **BTM Layout** - South-East
- **Koramangala** - Central South
- **Kanteerava** - West Central
- **KR Puram** - East

---

## 🛠️ Script Details

### load_air_quality.py

Fetches and transforms raw OpenCity data:

```python
# Fetch from OpenCity API
df = fetch_air_quality_data()

# Or load from local CSV
df = load_air_quality_csv("bengaluru_air_quality.csv")

# Transform to app format
reports = transform_air_quality_data(df)
```

**Features**:
- Automatic API fetching
- Local CSV fallback
- AQI to priority conversion
- Station location mapping
- JSON output

### seed_with_air_quality.py

Python seeding script that:
- Loads air quality data
- Generates fallback data if needed
- Saves as `air_quality_reports.json`
- Works with TypeScript seed scripts

---

## 📋 Integration with Seeding

The TypeScript seed scripts automatically detect and use air quality data:

### In seed-firebase.ts

```typescript
// Automatically loads air_quality_reports.json if it exists
const kaggleTrafficData = loadKaggleTrafficData();
const airQualityData = loadAirQualityData();

// Combines all data
const allReports = [...trafficReports, ...airQualityReports, ...mockReports];
```

### In seed-supabase.ts

Same automatic detection and combination.

---

## 📊 Sample Transformed Data

**Input (Raw CSV)**:
```csv
Station,Timestamp,AQI,PM2.5,PM10
Fort,2026-05-08 12:00,185,120,200
Jayanagar,2026-05-08 12:00,95,45,75
```

**Output (App Format)**:
```json
{
  "citizenId": "aqi_sensor_001",
  "citizenName": "Air Quality Monitor - Fort, Bangalore",
  "category": "pollution",
  "description": "Air Quality: Poor (AQI: 185). PM2.5: 120 µg/m³. PM10: 200 µg/m³.",
  "location": {
    "lat": 12.9689,
    "lng": 77.5906,
    "address": "Fort, Bangalore"
  },
  "status": "in-progress",
  "priority": "high",
  "aiAnalysis": {
    "summary": "Poor air quality at Fort, Bangalore",
    "severityScore": 46,
    "suggestedActions": [
      "Issue air quality alert",
      "Recommend indoor activities",
      "Suggest wearing masks outdoors"
    ]
  }
}
```

---

## ✅ Verification

### Check Generated Data

```bash
# View first air quality report
head -50 air_quality_reports.json

# Count total reports
grep -c "citizenId" air_quality_reports.json

# View all AQI values
grep "AQI:" air_quality_reports.json
```

### In Dashboard

After seeding:

1. Go to **Public Map** → See air quality markers
2. Go to **Admin Dashboard** → Filter by "pollution" category
3. Go to **Intelligence Center** → View air quality trends

---

## 🔗 Display in Components

### Show Air Quality Reports

```tsx
import { useSupabaseQuery } from '@/hooks/useSupabase';

export function AirQualityDashboard() {
  const { data: aqiReports } = useSupabaseQuery(
    'reports',
    {
      column: 'category',
      value: 'pollution'
    }
  );

  return (
    <div>
      {aqiReports.map(report => (
        <div key={report.id}>
          <h3>{report.location.address}</h3>
          <p>AQI Score: {report.aiAnalysis.severityScore}</p>
          <p>Status: {report.priority}</p>
        </div>
      ))}
    </div>
  );
}
```

### Real-time Air Quality Updates

```tsx
export function LiveAQI() {
  const { data: liveAQI } = useSupabaseSubscription(
    'reports',
    (payload) => console.log('AQI Updated:', payload)
  );
  
  // Your real-time display
}
```

---

## 🚀 Combined Data Sources

You can now use multiple real datasets:

```bash
# Traffic data from Kaggle
python scripts/seed_with_kaggle.py

# Air quality data from OpenCity
python scripts/seed_with_air_quality.py

# Seed all together
npm run seed:firebase
```

**Result**: Dashboard with both **real traffic AND air quality** data!

---

## 📊 Dashboard Insights

With air quality data, your dashboard can show:

✅ **Heatmaps**: Air pollution concentration across the city  
✅ **Trends**: Hourly/daily AQI patterns  
✅ **Alerts**: High pollution areas needing attention  
✅ **Health Impact**: Estimated residents affected  
✅ **Correlation**: Traffic ↔ Air Quality relationship  
✅ **Predictions**: AI-based AQI forecasting  

---

## 🛠️ Troubleshooting

### "Could not fetch from OpenCity API"
- Check internet connection
- The API may be temporarily unavailable
- Download CSV manually and save as `bengaluru_air_quality.csv`

### "No data to transform"
- Ensure CSV has columns: `Station`, `AQI`, `PM2.5`, `Timestamp`
- Check file encoding is UTF-8
- Try: `file bengaluru_air_quality.csv`

### "ModuleNotFoundError: load_air_quality"
- Ensure you're running from project root
- Run: `python scripts/seed_with_air_quality.py`

### File Permission Issues

**Windows**:
```powershell
# Grant write permissions
icacls ".\air_quality_reports.json" /grant:r "$env:USERNAME":"(M)"
```

**Mac/Linux**:
```bash
chmod 644 air_quality_reports.json
```

---

## 📈 Next Steps

1. ✅ **Download** air quality data
2. ✅ **Transform** to app format
3. ✅ **Seed** your database
4. ✅ **View** in dashboard
5. 🔄 **Schedule** regular updates
6. 📊 **Analyze** trends over time
7. 🤖 **Enable** AI predictions

---

## 🔗 Resources

- [OpenCity Data Portal](https://data.opencity.in/)
- [Bengaluru Air Quality Dataset](https://data.opencity.in/dataset/bengaluru-hourly-air-quality-reports)
- [AQI Standards](https://en.wikipedia.org/wiki/Air_quality_index)
- [Project Documentation](README.md)

---

## 💡 Tips

**Tip 1**: Set up a cron job to periodically update air quality data:
```bash
# Once daily
0 0 * * * cd /path/to/project && python scripts/seed_with_air_quality.py
```

**Tip 2**: Use both traffic and air quality for correlations:
```bash
python scripts/seed_with_kaggle.py
python scripts/seed_with_air_quality.py
npm run seed:firebase
```

**Tip 3**: Archive historical data:
```bash
cp air_quality_reports.json backups/air_quality_$(date +%Y%m%d).json
```

Enjoy analyzing Bengaluru's air quality! 🌍💨📊
