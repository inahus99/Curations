// // src/hooks/useScraps.js
import { useEffect, useState } from 'react';
import { supabase, getUserId } from '../services/supabase';

export default function useScraps() {
  const [scraps, setScraps]   = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = getUserId();   // or supabase.auth.user().id

  useEffect(() => {
    if (!userId) return;

    // 1) Fetch only this user's scraps
    supabase
      .from('scraps')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setScraps(data ?? []);
        setLoading(false);
      });

    // 2) Subscribe only to this user's inserts
    const channel = supabase
      .channel(`realtime:scraps:user=${userId}`)
      .on(
        'postgres_changes',
        { 
          event: 'INSERT',
          schema: 'public',
          table: 'scraps',
          filter: `user_id=eq.${userId}` 
        },
        ({ new: newScrap }) => {
          setScraps(prev => [newScrap, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const addScrap = async (scrap) => {
    // ensure you include user_id in the record
    const { data, error } = await supabase
      .from('scraps')
      .insert({ ...scrap, user_id: userId })
      .select()
      .single();

    if (!error && data) {
      setScraps(prev => [data, ...prev]);
    }
    return { data, error };
  };

  const deleteScrap = async (id) => {
    await supabase
      .from('scraps')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);  // extra safety
    setScraps(prev => prev.filter(s => s.id !== id));
  };

  return { scraps, loading, addScrap, deleteScrap };
}
