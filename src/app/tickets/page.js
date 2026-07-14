'use client';

import { useAuth } from '@/features/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { RoleShell } from '@/features/dashboard/components/RoleShell';
import { AdminTicketsView } from '@/features/dashboard/components/admin/AdminTicketsView';
import { UserTicketView } from '@/features/dashboard/components/user/UserTicketView';

export default function TicketsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  if (loading) {
    return null;
  }

  if (!user) return null;

  if (user.role === 'ADMIN') {
    return (
      <RoleShell requireRole={user.role}>
        <AdminTicketsView />
      </RoleShell>
    );
  }

  return (
    <RoleShell requireRole="USER">
      <UserTicketView />
    </RoleShell>
  );
}
