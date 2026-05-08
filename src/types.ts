export interface CitizenReport {
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
    severityScore: number;
  };
  assignedDept?: string;
  createdAt: any;
  updatedAt: any;
}

export interface CityMetric {
  id: string;
  type: 'aqi' | 'traffic_load' | 'water_level' | 'energy_efficiency' | 'waste_collected';
  value: number;
  unit: string;
  timestamp: any;
  region: string;
}

export type Language = 'en' | 'kn' | 'hi' | 'ta' | 'te' | 'ml';
