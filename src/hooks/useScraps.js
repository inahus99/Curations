import { useState, useEffect } from 'react';
import { supabase, getUserId } from '../services/supabase';

export default function useScraps() {
  const [scraps, setScraps] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = getUserId();

  useEffect(() => {
    let insertChannel, deleteChannel;

    async function loadAndSubscribe() {
      //  initial fetch
      const { data, error } = await supabase
        .from('scraps')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) console.error('Fetch error:', error);
      else setScraps(data);
      setLoading(false);

      //  real‑time INSERTs
      insertChannel = supabase
        .channel(`scraps_insert_user_${userId}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'scraps',
          filter: `user_id=eq.${userId}`
        }, ({ new: row }) => {
          setScraps(cur => [row, ...cur]);
        })
        .subscribe();

      // real‑time DELETEs
      deleteChannel = supabase
        .channel(`scraps_delete_user_${userId}`)
        .on('postgres_changes', {
          event: 'DELETE',
          schema: 'public',
          table: 'scraps',
          filter: `user_id=eq.${userId}`
        }, ({ old: row }) => {
          setScraps(cur => cur.filter(s => s.id !== row.id));
        })
        .subscribe();
    }

    loadAndSubscribe();
    return () => {
      if (insertChannel) supabase.removeChannel(insertChannel);
      if (deleteChannel) supabase.removeChannel(deleteChannel);
    };
  }, [userId]);

  // ———————— UPDATED remove() ————————
  const remove = async (id) => {
    const { error } = await supabase
      .from('scraps')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('Delete error:', error);
    } else {

      setScraps(cur => cur.filter(s => s.id !== id));
    }
  };


  return { scraps, loading, remove };
}
