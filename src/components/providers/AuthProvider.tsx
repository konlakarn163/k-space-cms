'use client';

import { useEffect } from 'react';
import { supabase } from '@/utils/supabase/client';
import { useAuthStore } from '@/store/useAuthStore';
import { apiFetch } from '@/lib/api';
import { fetchMyProfile } from '@/services/profileService';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const setUser = useAuthStore((state) => state.setUser);
    const setRole = useAuthStore((state) => state.setRole);

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);

            if (session) {
                await apiFetch('/api/profile/sync', { method: 'POST' }, session).catch(() => null);
                const profile = await fetchMyProfile(session).catch(() => null);
                setRole(profile?.role ?? null);
            } else {
                setRole(null);
            }
        };

        getSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setUser(session?.user ?? null);

            if (session) {
                await apiFetch('/api/profile/sync', { method: 'POST' }, session).catch(() => null);
                const profile = await fetchMyProfile(session).catch(() => null);
                console.log('profile',profile);
                
                setRole(profile?.role ?? null);
            } else {
                setRole(null);
            }
        });

        return () => subscription.unsubscribe();
    }, [setRole, setUser]);

    return <>{children}</>;
}