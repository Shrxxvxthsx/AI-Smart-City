import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

// Initialize Firebase Admin - make sure to set GOOGLE_APPLICATION_CREDENTIALS
// or download your service account key from Firebase Console
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY || './firebase-admin-key.json';

if (!fs.existsSync(serviceAccountPath)) {
  console.error(`
❌ ERROR: Firebase service account key not found at ${serviceAccountPath}

To set up:
1. Go to Firebase Console > Project Settings > Service Accounts
2. Click "Generate New Private Key"
3. Save it as "firebase-admin-key.json" in the project root
4. Or set FIREBASE_SERVICE_ACCOUNT_KEY environment variable
  `);
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

const db = admin.firestore();
const auth = admin.auth();

// Load Kaggle traffic data if available
const loadKaggleTrafficData = () => {
  const trafficReportsPath = path.join(process.cwd(), 'traffic_reports.json');
  
  if (fs.existsSync(trafficReportsPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(trafficReportsPath, 'utf8'));
      console.log('📥 Loaded real traffic data from Kaggle');
      return data;
    } catch (err) {
      console.log('⚠️  Could not load traffic_reports.json, using mock data');
      return null;
    }
  }
  
  return null;
};

// Convert loaded Kaggle data to Firestore format
const convertTrafficDataForFirestore = (trafficData: any[]) => {
  return trafficData.map(report => ({
    ...report,
    createdAt: admin.firestore.Timestamp.fromDate(new Date(report.createdAt || Date.now())),
    updatedAt: admin.firestore.Timestamp.fromDate(new Date(report.updatedAt || Date.now()))
  }));
};

// Load air quality data if available
const loadAirQualityData = () => {
  const airQualityPath = path.join(process.cwd(), 'air_quality_reports.json');
  
  if (fs.existsSync(airQualityPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(airQualityPath, 'utf8'));
      console.log('📥 Loaded real air quality data from OpenCity');
      return data;
    } catch (err) {
      console.log('⚠️  Could not load air_quality_reports.json, using mock data');
      return null;
    }
  }
  
  return null;
};

// Convert air quality data to Firestore format
const convertAirQualityDataForFirestore = (airQualityData: any[]) => {
  return airQualityData.map(report => ({
    ...report,
    createdAt: admin.firestore.Timestamp.fromDate(new Date(report.createdAt || Date.now())),
    updatedAt: admin.firestore.Timestamp.fromDate(new Date(report.updatedAt || Date.now()))
  }));
};

// Seed data generators
const generateCitizenReports = () => {
  const categories: Array<'traffic' | 'pollution' | 'waste' | 'water' | 'energy' | 'agriculture' | 'safety'> = 
    ['traffic', 'pollution', 'waste', 'water', 'energy', 'agriculture', 'safety'];
  
  const statuses: Array<'pending' | 'in-progress' | 'resolved' | 'escalated'> = 
    ['pending', 'in-progress', 'resolved', 'escalated'];
  
  const priorities: Array<'low' | 'medium' | 'high' | 'critical'> = 
    ['low', 'medium', 'high', 'critical'];

  const descriptions: Record<string, string[]> = {
    traffic: [
      'Heavy congestion at main intersection during peak hours',
      'Traffic signal malfunction at Central Park Avenue',
      'Unusual traffic pattern blocking major arterial road',
      'Road accident causing traffic slowdown',
      'Construction zone creating bottleneck'
    ],
    pollution: [
      'Air quality severely degraded this morning',
      'Industrial smoke visible from residential area',
      'Foul odor detected near industrial zone',
      'Unusual pollution spike near highway',
      'Particulate matter exceeding safe limits'
    ],
    waste: [
      'Garbage not collected from residential block',
      'Waste overflow at public dumping site',
      'Illegal dumping observed in park',
      'Waste containers overflowing on main street',
      'Hazardous waste spotted near water body'
    ],
    water: [
      'Water pipeline burst causing spillage',
      'Water quality issues at public supply point',
      'Unusual algae growth in reservoir',
      'Contaminated water reported',
      'Low water pressure in district'
    ],
    energy: [
      'Power outage affecting residential area',
      'Street lights non-functional on main road',
      'Power grid instability detected',
      'Streetlight maintenance required',
      'Energy consumption anomaly detected'
    ],
    agriculture: [
      'Crop disease outbreak in farming area',
      'Pest infestation affecting crops',
      'Soil quality degradation',
      'Irrigation system failure',
      'Unusual weather affecting harvest'
    ],
    safety: [
      'Suspicious activity reported in park',
      'Public safety concern at transit hub',
      'Street lighting inadequate in area',
      'Fire hazard identified in building',
      'Safety barrier damaged on highway'
    ]
  };

  const locations = [
    { lat: 12.9716, lng: 77.5946, address: 'Koramangala, Bangalore' },
    { lat: 12.9352, lng: 77.6245, address: 'Indiranagar, Bangalore' },
    { lat: 13.0489, lng: 77.6170, address: 'Whitefield, Bangalore' },
    { lat: 12.9689, lng: 77.5906, address: 'MG Road, Bangalore' },
    { lat: 12.9716, lng: 77.6412, address: 'Marathahalli, Bangalore' },
    { lat: 13.0344, lng: 77.6345, address: 'Kalyan Nagar, Bangalore' },
    { lat: 12.8395, lng: 77.6245, address: 'Jayanagar, Bangalore' },
    { lat: 12.9698, lng: 77.7499, address: 'HSR Layout, Bangalore' },
  ];

  const depts = ['Traffic', 'Pollution', 'Waste Management', 'Water Supply', 'Energy', 'Agriculture', 'Public Safety'];

  const reports = [];
  for (let i = 0; i < 12; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    
    const desc = descriptions[category];
    const description = desc[Math.floor(Math.random() * desc.length)];

    reports.push({
      citizenId: `citizen_${String(i).padStart(3, '0')}`,
      citizenName: `Citizen ${i + 1}`,
      category,
      description,
      imageUrl: `https://via.placeholder.com/400?text=${category}`,
      location,
      status,
      priority,
      aiAnalysis: {
        summary: `Analysis of ${category} issue: ${description.substring(0, 50)}...`,
        predictedImpact: `Potential impact on ${Math.floor(Math.random() * 10000) + 1000} residents`,
        suggestedActions: [
          'Dispatch inspection team',
          'Monitor situation in real-time',
          'Issue public alert if necessary'
        ],
        severityScore: Math.floor(Math.random() * 100)
      },
      assignedDept: status !== 'pending' ? depts[Math.floor(Math.random() * depts.length)] : undefined,
      createdAt: admin.firestore.Timestamp.fromDate(
        new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
      ),
      updatedAt: admin.firestore.Timestamp.fromDate(new Date())
    });
  }

  return reports;
};

const generateCityMetrics = () => {
  const metrics = [];
  const now = new Date();
  
  // Generate 24 hourly data points
  for (let hour = 0; hour < 24; hour++) {
    const timestamp = new Date(now.getTime() - (23 - hour) * 60 * 60 * 1000);

    metrics.push({
      type: 'aqi',
      value: 80 + Math.floor(Math.random() * 100),
      unit: 'µg/m³',
      timestamp: admin.firestore.Timestamp.fromDate(timestamp),
      region: 'Central Bangalore'
    });

    metrics.push({
      type: 'traffic_load',
      value: 30 + Math.floor(Math.random() * 80),
      unit: 'vehicles/min',
      timestamp: admin.firestore.Timestamp.fromDate(timestamp),
      region: 'Main Roads'
    });

    metrics.push({
      type: 'water_level',
      value: 60 + Math.floor(Math.random() * 35),
      unit: '%',
      timestamp: admin.firestore.Timestamp.fromDate(timestamp),
      region: 'Reservoirs'
    });

    metrics.push({
      type: 'energy_efficiency',
      value: 70 + Math.floor(Math.random() * 25),
      unit: '%',
      timestamp: admin.firestore.Timestamp.fromDate(timestamp),
      region: 'City Grid'
    });

    metrics.push({
      type: 'waste_collected',
      value: 200 + Math.floor(Math.random() * 300),
      unit: 'tons',
      timestamp: admin.firestore.Timestamp.fromDate(timestamp),
      region: 'All Districts'
    });
  }

  return metrics;
};

// Main seed function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Create test users
    console.log('📝 Creating authentication users...');
    const testUsers = [
      { email: 'admin@iks-smartcity.gov', password: 'Admin@123456', displayName: 'Admin Officer' },
      { email: 'traffic@iks-smartcity.gov', password: 'Traffic@123456', displayName: 'Traffic Manager' },
      { email: 'pollution@iks-smartcity.gov', password: 'Pollution@123456', displayName: 'Environmental Officer' },
    ];

    for (const user of testUsers) {
      try {
        await auth.createUser({
          email: user.email,
          password: user.password,
          displayName: user.displayName,
          emailVerified: true
        });
        console.log(`  ✓ Created user: ${user.email}`);
      } catch (err: any) {
        if (err.code === 'auth/email-already-exists') {
          console.log(`  ℹ User already exists: ${user.email}`);
        } else {
          throw err;
        }
      }
    }

    console.log('\n📊 Generating citizen reports...');
    
    // Try to load real Kaggle traffic data
    let trafficReports: any[] = [];
    const kaggleTrafficData = loadKaggleTrafficData();
    
    if (kaggleTrafficData && kaggleTrafficData.length > 0) {
      trafficReports = convertTrafficDataForFirestore(kaggleTrafficData);
      console.log(`  ✓ Loaded ${trafficReports.length} real traffic reports from Kaggle`);
    } else {
      console.log('  ℹ Using mock traffic data (run: python scripts/seed_with_kaggle.py to use real data)');
    }
    
    // Try to load real air quality data
    let airQualityReports: any[] = [];
    const openCityAirQualityData = loadAirQualityData();
    
    if (openCityAirQualityData && openCityAirQualityData.length > 0) {
      airQualityReports = convertAirQualityDataForFirestore(openCityAirQualityData);
      console.log(`  ✓ Loaded ${airQualityReports.length} real air quality reports from OpenCity`);
    } else {
      console.log('  ℹ Using mock air quality data (run: python scripts/seed_with_air_quality.py to use real data)');
    }
    
    // Generate mock reports for other categories
    const mockReports = generateCitizenReports();
    const allReports = [...trafficReports, ...airQualityReports, ...mockReports];
    
    console.log(`  Total reports to add: ${allReports.length}`);

    console.log('💾 Writing reports to Firestore...');
    for (const report of allReports) {
      await db.collection('reports').add(report);
    }
    console.log(`  ✓ Added ${allReports.length} reports (${trafficReports.length} real traffic + ${airQualityReports.length} real air quality + ${mockReports.length} other categories)`);

    console.log('\n📈 Generating city metrics...');
    const metrics = generateCityMetrics();
    console.log(`  Generated ${metrics.length} metric data points`);

    console.log('💾 Writing metrics to Firestore...');
    for (const metric of metrics) {
      await db.collection('metrics').add(metric);
    }
    console.log(`  ✓ Added ${metrics.length} metric entries`);

    console.log('\n✅ Database seeding completed successfully!\n');
    console.log('📋 Test Credentials:');
    console.log('─'.repeat(50));
    testUsers.forEach(user => {
      console.log(`Email: ${user.email}`);
      console.log(`Password: ${user.password}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await admin.app().delete();
    process.exit(0);
  }
};

seedDatabase();
