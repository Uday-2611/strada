import AdminSidebar from '@/components/AdminSidebar'

export default function AdminLayout({ children }) {
    return (
        <div className="w-screen h-screen flex">
            <div className="w-[20%] h-full">
                <AdminSidebar />
            </div>
            <div className="w-[80%] h-full overflow-y-auto p-4">
                {children}
            </div>
        </div>
    );
}
