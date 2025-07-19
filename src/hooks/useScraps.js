// useScraps.js
import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

export default function useScraps() {
  const [scraps, setScraps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('scraps')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setScraps(data || []);
        setLoading(false);
      });

    // Enable real-time subscription
    const channel = supabase
      .channel('realtime:scraps')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'scraps' },
        payload => {
          setScraps(prev => [payload.new, ...prev]); 
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const remove = async id => {
    await supabase.from('scraps').delete().eq('id', id);
    setScraps(prev => prev.filter(s => s.id !== id));
  };

  return { scraps, loading, remove };
}
