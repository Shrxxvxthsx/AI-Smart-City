"""
Kaggle Traffic Dataset Integration
Fetches real Bangalore traffic data from Kaggle and transforms it for the smart city app
"""

import kagglehub
import pandas as pd
import json
from datetime import datetime, timedelta
from pathlib import Path

def load_traffic_dataset():
    """Load the Bangalore traffic dataset from Kaggle"""
    try:
        print("📥 Downloading Bangalore traffic dataset from Kaggle...")
        
        # Load the dataset
        df = kagglehub.load_dataset(
            "preethamgouda/banglore-city-traffic-dataset",
            # Download to a local path
            path="."
        )
        
        print(f"✓ Dataset loaded successfully!")
        print(f"  Shape: {df.shape}")
        print(f"  Columns: {list(df.columns)}")
        print(f"\nFirst few records:\n{df.head()}\n")
        
        return df
    except Exception as e:
        print(f"❌ Error loading dataset: {e}")
        print("\nTo use Kaggle datasets, you need to:")
        print("1. Install kagglehub: pip install kagglehub")
        print("2. Set up Kaggle API credentials:")
        print("   - Go to https://www.kaggle.com/settings/account")
        print("   - Click 'Create New API Token' to download kaggle.json")
        print("   - Place it at ~/.kaggle/kaggle.json (or %USERPROFILE%\\.kaggle\\kaggle.json on Windows)")
        print("3. Run this script again")
        return None


def transform_traffic_data(df):
    """Transform Kaggle traffic data to match our report schema"""
    
    if df is None or df.empty:
        print("❌ No data to transform")
        return []
    
    print("🔄 Transforming traffic data...")
    
    # Map traffic conditions to our severity levels
    severity_map = {
        'Light': 'low',
        'Moderate': 'medium',
        'Heavy': 'high',
        'Very Heavy': 'critical'
    }
    
    # Bangalore area coordinates (sample locations)
    bangalore_locations = [
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
    
    # Transform each traffic record into a report
    for idx, row in df.iterrows():
        if idx >= 12:  # Limit to 12 reports for consistency with seed data
            break
        
        # Get traffic condition
        traffic_condition = str(row.get('Traffic Condition', 'Moderate')).strip()
        priority = severity_map.get(traffic_condition, 'medium')
        
        # Get location (cycle through our predefined locations)
        location = bangalore_locations[idx % len(bangalore_locations)]
        
        # Create report
        report = {
            "citizenId": f"traffic_sensor_{idx:03d}",
            "citizenName": f"Traffic Sensor - {location['name']}",
            "category": "traffic",
            "description": f"Traffic condition: {traffic_condition}. " + 
                          f"Average speed: {row.get('Average Speed', 'N/A')} km/h. " +
                          f"Congestion: {row.get('Congestion Level', 'Normal')}",
            "imageUrl": "https://via.placeholder.com/400?text=traffic",
            "location": {
                "lat": location["lat"],
                "lng": location["lng"],
                "address": location["name"] + ", Bangalore"
            },
            "status": "pending" if idx % 3 == 0 else "in-progress",
            "priority": priority,
            "aiAnalysis": {
                "summary": f"{traffic_condition} traffic detected at {location['name']}",
                "predictedImpact": f"Affects approximately {(idx + 1) * 5000} commuters",
                "suggestedActions": [
                    "Deploy traffic personnel to manage flow",
                    "Send alerts to commuters",
                    "Suggest alternate routes"
                ],
                "severityScore": {"low": 25, "medium": 50, "high": 75, "critical": 90}.get(priority, 50)
            },
            "assignedDept": "Traffic",
            "createdAt": (datetime.now() - timedelta(hours=idx)).isoformat()
        }
        
        reports.append(report)
    
    print(f"✓ Transformed {len(reports)} traffic reports\n")
    return reports


def save_to_json(reports, filename="traffic_reports.json"):
    """Save transformed data to JSON file"""
    output_path = Path(__file__).parent / filename
    
    with open(output_path, 'w') as f:
        json.dump(reports, f, indent=2)
    
    print(f"✓ Saved to {output_path}")
    return str(output_path)


def display_sample(reports):
    """Display sample of transformed data"""
    if reports:
        print("📋 Sample transformed report:")
        print(json.dumps(reports[0], indent=2))


def main():
    """Main execution"""
    print("=" * 60)
    print("🚦 Kaggle Traffic Dataset Integration")
    print("=" * 60 + "\n")
    
    # Load dataset
    df = load_traffic_dataset()
    
    if df is not None:
        # Transform data
        reports = transform_traffic_data(df)
        
        # Save to JSON
        if reports:
            output_file = save_to_json(reports)
            display_sample(reports)
            
            print("\n" + "=" * 60)
            print("✅ Next Steps:")
            print("=" * 60)
            print(f"1. Review the transformed data in: {output_file}")
            print("2. To use this in Firebase/Supabase seeding:")
            print("   - Run: npm run seed:firebase -- --use-kaggle")
            print("   - Or manually import the JSON into your database")
            print("\nOr use the Python seeding script:")
            print("   python scripts/seed_with_kaggle.py")
    else:
        print("\n⚠️  Could not load Kaggle dataset.")
        print("Please install kagglehub and set up Kaggle API credentials.")


if __name__ == "__main__":
    main()
