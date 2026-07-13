'use client';

import { RoleShell } from '@/features/dashboard/components/RoleShell';
import { AdminUsersView } from '@/features/dashboard/components/admin/AdminUsersView';

export default function UsuariosPage() {
  return (
    <RoleShell requireRole="ADMIN">
      <AdminUsersView />
    </RoleShell>
  );
}
