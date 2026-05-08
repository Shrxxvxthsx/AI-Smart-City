import { useEffect, useState } from 'react';
import { supabase, onAuthStateChange, getCurrentUser } from '../services/supabase';

/**
 * Hook to get the current authenticated user
 */
export const useSupabaseAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get current user on mount
    const getCurrentUserAsync = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to get user');
      } finally {
        setLoading(false);
      }
    };

    getCurrentUserAsync();

    // Listen to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return { user, loading, error };
};

/**
 * Hook to query data from a Supabase table
 */
export const useSupabaseQuery = <T,>(
  table: string,
  filter?: { column: string; value: any; operator?: string }
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let query = supabase.from(table).select('*');

        if (filter) {
          const operator = filter.operator || 'eq';
          query = query.filter(filter.column, operator, filter.value);
        }

        const { data: result, error: err } = await query;

        if (err) {
          throw err;
        }

        setData(result as T[]);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [table, filter?.column, filter?.value, filter?.operator]);

  return { data, loading, error };
};

/**
 * Hook to get a single record from a Supabase table
 */
export const useSupabaseRecord = <T,>(table: string, id?: string | number) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setData(null);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const { data: result, error: err } = await supabase
          .from(table)
          .select('*')
          .eq('id', id)
          .single();

        if (err) {
          throw err;
        }

        setData(result as T);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch record');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [table, id]);

  return { data, loading, error };
};

/**
 * Hook for real-time subscriptions to a Supabase table
 */
export const useSupabaseSubscription = <T,>(
  table: string,
  onUpdate?: (payload: any) => void
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: result, error: err } = await supabase
          .from(table)
          .select('*');

        if (err) {
          throw err;
        }

        setData(result as T[]);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Subscribe to real-time changes
    const channel = supabase
      .channel(`public:${table}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table,
        },
        (payload) => {
          if (onUpdate) {
            onUpdate(payload);
          }
          // Re-fetch data on changes
          fetchData();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [table, onUpdate]);

  return { data, loading, error };
};
