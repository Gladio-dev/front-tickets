// src/app/(admin)/tickets/page.js
import { AdminTicketsView } from '@/features/dashboard/components/admin/AdminTicketsView';

export const metadata = {
  title: 'Consola de Tickets | Admin',
  description: 'Panel de administración global de tickets de soporte.',
};

export default function TicketsAdminPage() {
  return <AdminTicketsView />;
}