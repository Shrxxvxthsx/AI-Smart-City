"""
Seed database with real air quality data from OpenCity
This script loads air quality data and seeds it into your database
"""

import json
import sys
from pathlib import Path
from datetime import datetime, timedelta

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent))

try:
    from load_air_quality import fetch_air_quality_data, load_air_quality_csv, transform_air_quality_data
    AIR_QUALITY_AVAILABLE = True
except ImportError:
    AIR_QUALITY_AVAILABLE = False
    print("⚠️  load_air_quality module not available")


def generate_fallback_air_quality_data():
    """Generate realistic air quality data if loading fails"""
    print("📊 Generating realistic air quality data...")
    
    descriptions = [
        "Air quality degraded due to traffic emissions",
        "Industrial pollution affecting air quality",
        "Dust storm causing air quality issues",
        "Vehicular emissions raising pollution levels",
        "Construction dust affecting air quality",
        "Crop burning in neighboring regions",
        "Factory emissions visible",
        "High particulate matter concentration",
        "Poor air quality index recorded",
        "Moderate air quality with improving trend",
        "Air quality alert issued",
        "Pollution levels exceeding safe limits"
    ]
    
    locations = [
        {"name": "Fort", "lat": 12.9689, "lng": 77.5906},
        {"name": "Jayanagar", "lat": 12.9395, "lng": 77.5960},
        {"name": "Sanjay Nagar", "lat": 13.0050, "lng": 77.6200},
        {"name": "Yelahanka", "lat": 13.1068, "lng": 77.6010},
        {"name": "BTM Layout", "lat": 12.9149, "lng": 77.6245},
        {"name": "Koramangala", "lat": 12.9716, "lng": 77.5946},
        {"name": "Kanteerava", "lat": 12.9716, "lng": 77.5746},
        {"name": "KR Puram", "lat": 13.0154, "lng": 77.6597},
    ]
    
    reports = []
    priorities = ['low', 'medium', 'high', 'critical']
    
    aqi_values = [35, 45, 85, 120, 180, 250, 150, 90, 75, 110, 165, 290]
    aqi_categories = ['Good', 'Satisfactory', 'Moderate', 'Poor', 'Very Poor', 'Severe', 
                      'Moderate', 'Satisfactory', 'Satisfactory', 'Moderate', 'Poor', 'Severe']
    
    for i in range(12):
        location = locations[i % len(locations)]
        priority = priorities[i % len(priorities)]
        aqi = aqi_values[i]
        category = aqi_categories[i]
        
        report = {
            "citizenId": f"aqi_sensor_{i:03d}",
            "citizenName": f"Air Quality Monitor - {location['name']}",
            "category": "pollution",
            "description": f"{descriptions[i]}. AQI: {aqi} ({category}). PM2.5: {50 + i*10} µg/m³",
            "imageUrl": "https://via.placeholder.com/400?text=air_quality",
            "location": {
                "lat": location["lat"],
                "lng": location["lng"],
                "address": location["name"] + ", Bangalore"
            },
            "status": "pending" if i % 3 == 0 else "in-progress",
            "priority": priority,
            "aiAnalysis": {
                "summary": f"{category} air quality at {location['name']}",
                "predictedImpact": f"Health risk for {(i + 1) * 10000} residents",
                "suggestedActions": [
                    "Issue air quality alert",
                    "Recommend indoor activities",
                    "Suggest wearing masks outdoors"
                ],
                "severityScore": min(aqi // 4, 100)
            },
            "assignedDept": "Pollution",
            "createdAt": (datetime.now() - timedelta(hours=i)).isoformat()
        }
        reports.append(report)
    
    return reports


def get_air_quality_data():
    """Get air quality data from OpenCity or generate fallback"""
    if AIR_QUALITY_AVAILABLE:
        print("📥 Loading air quality data...")
        try:
            # Try online fetch first
            df = fetch_air_quality_data()
            if df is not None and not df.empty:
                return transform_air_quality_data(df)
            
            # Try local CSV
            df = load_air_quality_csv()
            if df is not None and not df.empty:
                return transform_air_quality_data(df)
        except Exception as e:
            print(f"⚠️  Could not load air quality data: {e}")
    
    return generate_fallback_air_quality_data()


def main():
    """Main execution"""
    print("=" * 60)
    print("🌍 Seeding Database with Air Quality Data")
    print("=" * 60 + "\n")
    
    air_quality_data = get_air_quality_data()
    
    # Save to JSON for use in TypeScript seeding
    output_file = Path(__file__).parent.parent / "air_quality_reports.json"
    with open(output_file, 'w') as f:
        json.dump(air_quality_data, f, indent=2)
    
    print(f"\n✓ Air quality data saved to: {output_file}")
    print(f"\n📊 Generated {len(air_quality_data)} air quality reports")
    
    print("\n" + "=" * 60)
    print("✅ Next Steps:")
    print("=" * 60)
    print("To use this data in your database:")
    print("\n1. For Firebase:")
    print("   npm run seed:firebase")
    print("\n2. For Supabase:")
    print("   npm run seed:supabase")
    print("\nBoth seed scripts will automatically use air_quality_reports.json")


if __name__ == "__main__":
    main()
