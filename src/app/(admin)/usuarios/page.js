// src/app/(admin)/usuarios/page.js
import { AdminUsersView } from '@/features/dashboard/components/admin/AdminUsersView';

export const metadata = {
  title: 'Gestión de Usuarios | Admin',
  description: 'Consola para administrar cuentas de clientes y agentes.',
};

export default function UsersAdminPage() {
  return <AdminUsersView />;
}