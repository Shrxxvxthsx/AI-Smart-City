"""
Seed database with real Kaggle traffic data
This script loads traffic data from Kaggle and seeds it into your database
"""

import json
import sys
from pathlib import Path
from datetime import datetime, timedelta

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent))

try:
    from load_kaggle_traffic import load_traffic_dataset, transform_traffic_data
    KAGGLE_AVAILABLE = True
except ImportError:
    KAGGLE_AVAILABLE = False
    print("⚠️  kagglehub not installed. Install with: pip install kagglehub")


def generate_fallback_traffic_data():
    """Generate realistic traffic data if Kaggle is not available"""
    print("📊 Generating realistic traffic data (Kaggle not available)...")
    
    descriptions = [
        "Heavy congestion at main intersection during peak hours",
        "Traffic signal malfunction at Central Park Avenue",
        "Unusual traffic pattern blocking major arterial road",
        "Road accident causing traffic slowdown",
        "Construction zone creating bottleneck",
        "Multiple vehicles stuck in gridlock on highway",
        "Sudden traffic buildup near commercial area",
        "School zone causing traffic delays",
        "Accident on main expressway affecting multiple lanes",
        "Festival area traffic congestion",
        "VIP movement causing lane blockage",
        "Equipment failure on busy intersection"
    ]
    
    locations = [
        {"name": "Koramangala", "lat": 12.9716, "lng": 77.5946},
        {"name": "Indiranagar", "lat": 12.9352, "lng": 77.6245},
        {"name": "Whitefield", "lat": 13.0489, "lng": 77.6170},
        {"name": "MG Road", "lat": 12.9689, "lng": 77.5906},
        {"name": "Marathahalli", "lat": 12.9716, "lng": 77.6412},
        {"name": "Kalyan Nagar", "lat": 13.0344, "lng": 77.6345},
        {"name": "Jayanagar", "lat": 12.8395, "lng": 77.6245},
        {"name": "HSR Layout", "lat": 12.9698, "lng": 77.7499},
    ]
    
    reports = []
    priorities = ['low', 'medium', 'high', 'critical']
    statuses = ['pending', 'in-progress', 'resolved']
    
    for i in range(12):
        location = locations[i % len(locations)]
        priority = priorities[i % len(priorities)]
        status = statuses[i % len(statuses)]
        
        report = {
            "citizenId": f"traffic_sensor_{i:03d}",
            "citizenName": f"Traffic Sensor - {location['name']}",
            "category": "traffic",
            "description": descriptions[i % len(descriptions)],
            "imageUrl": "https://via.placeholder.com/400?text=traffic",
            "location": {
                "lat": location["lat"],
                "lng": location["lng"],
                "address": location["name"] + ", Bangalore"
            },
            "status": status,
            "priority": priority,
            "aiAnalysis": {
                "summary": f"Traffic analysis at {location['name']}",
                "predictedImpact": f"Affects approximately {(i + 1) * 5000} commuters",
                "suggestedActions": [
                    "Deploy traffic personnel",
                    "Send public alerts",
                    "Suggest alternate routes"
                ],
                "severityScore": {'low': 25, 'medium': 50, 'high': 75, 'critical': 90}[priority]
            },
            "assignedDept": "Traffic",
            "createdAt": (datetime.now() - timedelta(hours=i)).isoformat()
        }
        reports.append(report)
    
    return reports


def get_traffic_data():
    """Get traffic data from Kaggle or generate fallback"""
    if KAGGLE_AVAILABLE:
        print("📥 Loading Kaggle traffic data...")
        try:
            df = load_traffic_dataset()
            if df is not None and not df.empty:
                return transform_traffic_data(df)
        except Exception as e:
            print(f"⚠️  Could not load Kaggle data: {e}")
    
    return generate_fallback_traffic_data()


def main():
    """Main execution"""
    print("=" * 60)
    print("🚦 Seeding Database with Traffic Data")
    print("=" * 60 + "\n")
    
    traffic_data = get_traffic_data()
    
    # Save to JSON for use in TypeScript seeding
    output_file = Path(__file__).parent.parent / "traffic_reports.json"
    with open(output_file, 'w') as f:
        json.dump(traffic_data, f, indent=2)
    
    print(f"\n✓ Traffic data saved to: {output_file}")
    print(f"\n📊 Generated {len(traffic_data)} traffic reports")
    
    print("\n" + "=" * 60)
    print("✅ Next Steps:")
    print("=" * 60)
    print("To use this data in your database:")
    print("\n1. For Firebase:")
    print("   npm run seed:firebase")
    print("\n2. For Supabase:")
    print("   npm run seed:supabase")
    print("\nBoth seed scripts will use the traffic_reports.json if available")


if __name__ == "__main__":
    main()
