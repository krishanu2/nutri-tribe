import AdminSidebar from './_components/AdminSidebar';

export const metadata = { title: 'NutriTribe Admin' };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#f8f6f2]">
      <AdminSidebar />
      <div className="flex-1 overflow-auto min-w-0">
        {children}
      </div>
    </div>
  );
}
