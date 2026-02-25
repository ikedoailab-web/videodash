import { useMemo } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Line,
    ComposedChart,
    Legend
} from 'recharts';
import { useProjects } from '../../context/ProjectContext';

export function RevenueChart() {
    const { projects } = useProjects();

    const data = useMemo(() => {
        // Group by month
        const grouped = projects.reduce((acc, curr) => {
            const month = curr.month;
            if (!acc[month]) {
                acc[month] = { month, revenue: 0, count: 0 };
            }
            acc[month].revenue += Number(curr.price);
            acc[month].count += 1;
            return acc;
        }, {});

        // Sort chronologically and calc average
        return Object.values(grouped)
            .sort((a, b) => a.month.localeCompare(b.month))
            .map(item => ({
                ...item,
                avgPrice: Math.round(item.revenue / item.count)
            }));
    }, [projects]);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-card border border-border p-4 rounded-xl shadow-lg">
                    <p className="font-bold mb-2">{label}</p>
                    <p className="text-primary text-sm">総報酬: ¥{payload[0].value.toLocaleString()}</p>
                    {payload[1] && (
                        <p className="text-orange-500 text-sm mt-1">平均単価: ¥{payload[1].value.toLocaleString()}</p>
                    )}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-6 flex items-center">
                <span className="w-1.5 h-6 bg-primary rounded-full mr-3"></span>
                月別 総報酬 & 平均単価推移
            </h3>
            <div className="h-80 w-full">
                {data.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                            <XAxis dataKey="month" stroke="hsl(var(--foreground)/0.5)" tick={{ fill: 'hsl(var(--foreground)/0.7)' }} />
                            <YAxis yAxisId="left" stroke="hsl(var(--primary))" tick={{ fill: 'hsl(var(--foreground)/0.7)' }} tickFormatter={(value) => `¥${value.toLocaleString()}`} />
                            <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--foreground)/0.5)" tick={{ fill: 'hsl(var(--foreground)/0.7)' }} tickFormatter={(value) => `¥${value.toLocaleString()}`} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            <Bar yAxisId="left" dataKey="revenue" name="月間総報酬" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} maxBarSize={50} />
                            <Line yAxisId="right" type="monotone" dataKey="avgPrice" name="平均単価" stroke="#f97316" strokeWidth={3} dot={{ r: 6, fill: "#f97316", strokeWidth: 2, stroke: "hsl(var(--card))" }} />
                        </ComposedChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex h-full items-center justify-center text-foreground/50">
                        データがありません
                    </div>
                )}
            </div>
        </div>
    );
}
