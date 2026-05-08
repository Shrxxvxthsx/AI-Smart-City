# Supabase Integration Guide

This project now includes Supabase integration for database, authentication, and file storage capabilities.

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up or log in
2. Create a new project
3. Copy your project URL and anon key from the project settings

### 2. Configure Environment Variables

Create a `.env.local` file in the project root and add:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

**Note:** Variables starting with `VITE_` are automatically exposed to the browser in Vite projects.

### 3. Install Dependencies

```bash
npm install
```

## Usage

### Authentication

#### Using the Hook (Recommended for React Components)

```tsx
import { useSupabaseAuth } from '@/hooks/useSupabase';

export function MyComponent() {
  const { user, loading, error } = useSupabaseAuth();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <div>{user ? `Hello, ${user.email}!` : 'Please sign in'}</div>;
}
```

#### Using the Service Functions

```tsx
import { signUp, signIn, signOut } from '@/services/supabase';

// Sign up
await signUp('user@example.com', 'password');

// Sign in
await signIn('user@example.com', 'password');

// Sign out
await signOut();
```

### Database Operations

#### Query Data

```tsx
import { useSupabaseQuery } from '@/hooks/useSupabase';

interface City {
  id: number;
  name: string;
  population: number;
}

export function CityList() {
  const { data: cities, loading, error } = useSupabaseQuery<City>('cities');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {cities.map((city) => (
        <li key={city.id}>{city.name} - {city.population}</li>
      ))}
    </ul>
  );
}
```

#### Query with Filter

```tsx
const { data: smartCities } = useSupabaseQuery<City>(
  'cities',
  {
    column: 'is_smart',
    value: true,
    operator: 'eq'
  }
);
```

#### Get Single Record

```tsx
const { data: city } = useSupabaseRecord<City>('cities', cityId);
```

#### Real-time Subscription

```tsx
const { data: liveData } = useSupabaseSubscription<City>(
  'cities',
  (payload) => {
    console.log('Data updated:', payload);
  }
);
```

#### Insert Record

```tsx
import { insertRecord } from '@/services/supabase';

const newCity = await insertRecord('cities', {
  name: 'New City',
  population: 500000,
});
```

#### Update Record

```tsx
import { updateRecord } from '@/services/supabase';

await updateRecord('cities', cityId, {
  population: 600000,
});
```

#### Delete Record

```tsx
import { deleteRecord } from '@/services/supabase';

await deleteRecord('cities', cityId);
```

### File Storage

#### Upload File

```tsx
import { uploadFile } from '@/services/supabase';

const file = event.target.files[0];
await uploadFile('city-images', 'path/to/file.jpg', file);
```

#### Get Public URL

```tsx
import { getPublicFileUrl } from '@/services/supabase';

const imageUrl = getPublicFileUrl('city-images', 'path/to/file.jpg');
```

## Database Schema Example

Here's an example of tables you might create in Supabase for a smart city application:

### Cities Table

```sql
CREATE TABLE cities (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  population INTEGER,
  coordinates GEOMETRY(POINT, 4326),
  is_smart BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Alerts Table

```sql
CREATE TABLE alerts (
  id BIGSERIAL PRIMARY KEY,
  city_id BIGINT REFERENCES cities(id),
  title TEXT NOT NULL,
  description TEXT,
  severity TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Users Table (if using custom user data)

```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT,
  department TEXT,
  role TEXT,
  city_id BIGINT REFERENCES cities(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Row Level Security (RLS)

Enable Row Level Security for your tables in Supabase to secure your data:

1. Go to the SQL Editor in Supabase
2. Create policies for your tables:

```sql
-- Example: Allow authenticated users to read all cities
CREATE POLICY "Cities are readable" 
  ON cities FOR SELECT 
  TO authenticated 
  USING (true);

-- Example: Allow only authorized users to insert
CREATE POLICY "Only authorized can insert cities" 
  ON cities FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);
```

## Combining with Firebase

This project includes both Firebase and Supabase. You can:

- Use Firebase for: Authentication (if already configured)
- Use Supabase for: Real-time database, file storage, additional auth options

Or migrate entirely to Supabase. Refer to each service's documentation for specific use cases.

## Troubleshooting

### "Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY"

Make sure your `.env.local` file is created and has the correct environment variables. Restart the development server after adding them.

### Authentication errors

- Verify your Supabase URL and anon key are correct
- Check that users are enabled in Supabase Authentication settings
- Enable the authentication providers you want to use

### Database query errors

- Ensure the table exists in your Supabase database
- Check Row Level Security policies if queries return empty results
- Verify you have the correct permissions

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Real-time Subscriptions](https://supabase.com/docs/guides/realtime)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
