"""
Load Bengaluru Air Quality Dataset
Fetches real air quality data from OpenCity API and transforms it for the app
"""

import requests
import pandas as pd
import json
from datetime import datetime, timedelta
from pathlib import Path

# OpenCity API endpoints
OPENCITY_API_BASE = "https://api.opencity.in/api"
DATASET_ID = "bengaluru-hourly-air-quality-reports"

def fetch_air_quality_data():
    """
    Fetch air quality data from OpenCity API
    
    Dataset: Bengaluru Hourly Air Quality Reports
    Source: https://data.opencity.in/dataset/bengaluru-hourly-air-quality-reports
    """
    try:
        print("📥 Fetching air quality data from OpenCity API...")
        
        # OpenCity provides data via CSV download
        # We'll construct the data URL
        csv_url = f"https://data.opencity.in/dataset/bengaluru-hourly-air-quality-reports/download"
        
        print(f"  URL: {csv_url}")
        print("  Note: If this fails, manually download from:")
        print("  https://data.opencity.in/dataset/bengaluru-hourly-air-quality-reports")
        
        # Alternative: Try fetching from GitHub if available
        github_url = "https://raw.githubusercontent.com/OpenCity-Foundation/AQI-Dataset/main/bengaluru_aqi.csv"
        
        try:
            response = requests.get(csv_url, timeout=10)
            if response.status_code == 200:
                df = pd.read_csv(pd.io.common.StringIO(response.text))
                print("✓ Data fetched from OpenCity API")
                return df
        except:
            pass
        
        # Try GitHub fallback
        try:
            print("  Trying GitHub mirror...")
            response = requests.get(github_url, timeout=10)
            if response.status_code == 200:
                df = pd.read_csv(pd.io.common.StringIO(response.text))
                print("✓ Data fetched from GitHub mirror")
                return df
        except:
            pass
        
        print("⚠️  Could not fetch from online sources")
        return None
        
    except Exception as e:
        print(f"❌ Error fetching data: {e}")
        return None


def load_air_quality_csv(csv_path=None):
    """
    Load air quality data from local CSV file
    
    If no path provided, looks for common names
    """
    if csv_path is None:
        # Try common filenames
        possible_paths = [
            Path("bengaluru_air_quality.csv"),
            Path("bengaluru_aqi.csv"),
            Path("data/air_quality.csv"),
            Path("./air_quality.csv"),
        ]
        
        for path in possible_paths:
            if path.exists():
                csv_path = path
                break
    
    if csv_path is None:
        print("❌ No CSV file found")
        print("  Download from: https://data.opencity.in/dataset/bengaluru-hourly-air-quality-reports")
        return None
    
    try:
        print(f"📂 Loading air quality data from: {csv_path}")
        df = pd.read_csv(csv_path)
        print(f"✓ Data loaded successfully!")
        print(f"  Shape: {df.shape}")
        print(f"  Columns: {list(df.columns)}\n")
        return df
    except Exception as e:
        print(f"❌ Error loading CSV: {e}")
        return None


def get_aqi_category(aqi_value):
    """Convert AQI number to category and priority"""
    try:
        aqi = float(aqi_value)
    except (ValueError, TypeError):
        return 'medium', 'Moderate'
    
    if aqi <= 50:
        return 'low', 'Good'
    elif aqi <= 100:
        return 'low', 'Satisfactory'
    elif aqi <= 200:
        return 'medium', 'Moderate'
    elif aqi <= 300:
        return 'high', 'Poor'
    elif aqi <= 400:
        return 'high', 'Very Poor'
    else:
        return 'critical', 'Severe'


def get_station_location(station_name):
    """Map station names to Bangalore coordinates"""
    locations = {
        'Fort': {'lat': 12.9689, 'lng': 77.5906, 'name': 'Fort, Bangalore'},
        'Jayanagar': {'lat': 12.9395, 'lng': 77.5960, 'name': 'Jayanagar, Bangalore'},
        'Sanjay Nagar': {'lat': 13.0050, 'lng': 77.6200, 'name': 'Sanjay Nagar, Bangalore'},
        'Yelahanka': {'lat': 13.1068, 'lng': 77.6010, 'name': 'Yelahanka, Bangalore'},
        'BTM': {'lat': 12.9149, 'lng': 77.6245, 'name': 'BTM Layout, Bangalore'},
        'Hosa Road': {'lat': 12.9716, 'lng': 77.5946, 'name': 'Koramangala, Bangalore'},
        'Kanteerava': {'lat': 12.9716, 'lng': 77.5746, 'name': 'Kanteerava, Bangalore'},
        'KR Puram': {'lat': 13.0154, 'lng': 77.6597, 'name': 'KR Puram, Bangalore'},
    }
    
    # Try to match station name
    for key, value in locations.items():
        if key.lower() in str(station_name).lower():
            return value
    
    # Default to random Bangalore location
    return {
        'lat': 12.9716,
        'lng': 77.5946,
        'name': f'{station_name}, Bangalore'
    }


def transform_air_quality_data(df):
    """Transform air quality data to our report format"""
    
    if df is None or df.empty:
        print("❌ No data to transform")
        return []
    
    print("🔄 Transforming air quality data...")
    
    reports = []
    
    # Process each row
    for idx, row in df.iterrows():
        if idx >= 12:  # Limit to 12 reports
            break
        
        # Extract data
        station = row.get('Station', row.get('station', f'Station {idx}'))
        aqi = row.get('AQI', row.get('aqi', row.get('Air Quality Index', 150)))
        pm25 = row.get('PM2.5', row.get('pm25', row.get('PM25', 'N/A')))
        pm10 = row.get('PM10', row.get('pm10', 'N/A'))
        timestamp = row.get('Timestamp', row.get('timestamp', row.get('DateTime', datetime.now().isoformat())))
        
        # Get priority from AQI
        priority, aqi_category = get_aqi_category(aqi)
        
        # Get location
        location = get_station_location(station)
        
        # Format description
        description = f"Air Quality: {aqi_category} (AQI: {aqi}). "
        if pm25 != 'N/A':
            description += f"PM2.5: {pm25} µg/m³. "
        if pm10 != 'N/A':
            description += f"PM10: {pm10} µg/m³."
        
        report = {
            "citizenId": f"aqi_sensor_{idx:03d}",
            "citizenName": f"Air Quality Monitor - {location['name']}",
            "category": "pollution",
            "description": description,
            "imageUrl": "https://via.placeholder.com/400?text=air_quality",
            "location": {
                "lat": location["lat"],
                "lng": location["lng"],
                "address": location["name"]
            },
            "status": "pending" if idx % 3 == 0 else "in-progress",
            "priority": priority,
            "aiAnalysis": {
                "summary": f"{aqi_category} air quality at {location['name']}",
                "predictedImpact": f"Health risk for {(idx + 1) * 10000} residents",
                "suggestedActions": [
                    "Issue air quality alert",
                    "Recommend indoor activities",
                    "Suggest wearing masks outdoors"
                ],
                "severityScore": min(int(aqi) // 4, 100)  # Normalize AQI to 0-100
            },
            "assignedDept": "Pollution",
            "createdAt": pd.to_datetime(timestamp).isoformat() if timestamp != 'N/A' else datetime.now().isoformat()
        }
        
        reports.append(report)
    
    print(f"✓ Transformed {len(reports)} air quality reports\n")
    return reports


def display_sample(reports):
    """Display sample of transformed data"""
    if reports:
        print("📋 Sample transformed air quality report:")
        print(json.dumps(reports[0], indent=2))


def save_to_json(reports, filename="air_quality_reports.json"):
    """Save transformed data to JSON file"""
    output_path = Path(__file__).parent.parent / filename
    
    with open(output_path, 'w') as f:
        json.dump(reports, f, indent=2)
    
    print(f"✓ Saved to {output_path}")
    return str(output_path)


def main():
    """Main execution"""
    print("=" * 60)
    print("🌍 Bengaluru Air Quality Dataset Integration")
    print("=" * 60 + "\n")
    
    # Try to fetch data
    df = fetch_air_quality_data()
    
    # If fetch fails, try local CSV
    if df is None:
        print("\n📂 Trying to load local CSV file...")
        df = load_air_quality_csv()
    
    if df is not None:
        # Transform data
        reports = transform_air_quality_data(df)
        
        # Save to JSON
        if reports:
            output_file = save_to_json(reports)
            display_sample(reports)
            
            print("\n" + "=" * 60)
            print("✅ Next Steps:")
            print("=" * 60)
            print(f"1. Review the data in: {output_file}")
            print("2. Run the seed script:")
            print("   npm run seed:firebase")
            print("   or")
            print("   npm run seed:supabase")
    else:
        print("\n⚠️  Could not load air quality data")
        print("\n📥 Options to get the data:")
        print("1. Download manually from:")
        print("   https://data.opencity.in/dataset/bengaluru-hourly-air-quality-reports")
        print("2. Place CSV in project root with name like:")
        print("   - bengaluru_air_quality.csv")
        print("   - bengaluru_aqi.csv")
        print("3. Run this script again")


if __name__ == "__main__":
    main()
