// app/login/page.js
import { LoginForm } from '@/features/auth';

export const metadata = {
  title: 'Iniciar Sesión | Sistema de Tickets',
  description: 'Accede a tu cuenta para gestionar tus reportes y tickets de soporte.',
};

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-radial from-slate-50 to-slate-200 p-4">
      <div className="w-full flex justify-center animate-fade-in">
        <LoginForm />
      </div>
    </main>
  );
}