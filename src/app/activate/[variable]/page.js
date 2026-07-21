import { SetPasswordForm } from '@/features/auth';

export const metadata = {
  title: 'Establecer contraseña | Sistema de Tickets',
  description: 'Crea una contraseña nueva para activar tu cuenta.',
};

export default function ActivatePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-radial from-slate-50 to-slate-200 p-4">
      <div className="w-full flex justify-center animate-fade-in">
        <SetPasswordForm />
      </div>
    </main>
  );
}
