import AdminSidebar from '@/components/AdminSidebar'

export default function AdminLayout({ children }) {
    return (
        <div className="w-screen h-screen flex flex-col lg:flex-row">
            <div className="w-full lg:w-[20%] h-auto lg:h-full">
                <AdminSidebar />
            </div>
            <div className="w-full lg:w-[80%] h-full overflow-y-auto p-2 sm:p-4">
                {children}
            </div>
        </div>
    );
}
