import { SummaryCards } from './SummaryCards';
import { RevenueChart } from './RevenueChart';
import { CategoryPieChart } from './CategoryPieChart';

export function DashboardView() {
    return (
        <div className="grid gap-6 animate-in fade-in duration-500 slide-in-from-bottom-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">ダッシュボード</h1>
                    <p className="text-foreground/60 mt-1">動画制作の収益と活動状況の概要</p>
                </div>
            </div>

            <SummaryCards />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <RevenueChart />
                </div>
                <div className="lg:col-span-1">
                    <CategoryPieChart />
                </div>
            </div>
        </div>
    );
}
