// app/layout.js
import { AuthProvider } from '@/features/auth';
import './globals.css'; // Aquí es donde tienes tu @import "tailwindcss";

export const metadata = {
  title: 'ServHub',
  description: 'Gestión eficiente de tickets de soporte',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}