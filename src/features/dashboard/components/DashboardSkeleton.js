// src/features/dashboard/components/DashboardSkeleton.js
export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <div className="space-y-2 text-center">
        <div className="h-4 w-32 bg-slate-200 rounded-sm animate-pulse mx-auto"></div>
        <div className="h-3 w-48 bg-slate-200 rounded-sm animate-pulse mx-auto"></div>
      </div>
    </div>
  );
}