import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase URL or Anon Key is missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
  );
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

/**
 * Get the current authenticated user
 */
export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Error getting current user:', error);
    return null;
  }
  return data?.user || null;
};

/**
 * Sign up a new user
 */
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) {
    throw error;
  }
  return data;
};

/**
 * Sign in a user
 */
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    throw error;
  }
  return data;
};

/**
 * Sign out the current user
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
};

/**
 * Listen to auth state changes
 */
export const onAuthStateChange = (callback: (user: any) => void) => {
  return supabase.auth.onAuthStateChange(async (event, session) => {
    callback(session?.user || null);
  });
};

/**
 * Query data from a Supabase table
 */
export const queryTable = async <T>(
  table: string,
  filter?: { column: string; value: any; operator?: string }
) => {
  let query = supabase.from(table).select('*');

  if (filter) {
    const operator = filter.operator || 'eq';
    query = query.filter(filter.column, operator, filter.value);
  }

  const { data, error } = await query;
  if (error) {
    console.error(`Error querying ${table}:`, error);
    throw error;
  }
  return data as T[];
};

/**
 * Insert a new record into a Supabase table
 */
export const insertRecord = async <T>(table: string, record: T) => {
  const { data, error } = await supabase.from(table).insert([record]).select();
  if (error) {
    console.error(`Error inserting into ${table}:`, error);
    throw error;
  }
  return data?.[0];
};

/**
 * Update a record in a Supabase table
 */
export const updateRecord = async <T>(
  table: string,
  id: string | number,
  updates: Partial<T>
) => {
  const { data, error } = await supabase
    .from(table)
    .update(updates)
    .eq('id', id)
    .select();
  if (error) {
    console.error(`Error updating ${table}:`, error);
    throw error;
  }
  return data?.[0];
};

/**
 * Delete a record from a Supabase table
 */
export const deleteRecord = async (table: string, id: string | number) => {
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) {
    console.error(`Error deleting from ${table}:`, error);
    throw error;
  }
};

/**
 * Upload a file to Supabase Storage
 */
export const uploadFile = async (
  bucket: string,
  path: string,
  file: File
) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: false });
  if (error) {
    console.error(`Error uploading file to ${bucket}:`, error);
    throw error;
  }
  return data;
};

/**
 * Get a public URL for a file in Supabase Storage
 */
export const getPublicFileUrl = (bucket: string, path: string) => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data?.publicUrl;
};
