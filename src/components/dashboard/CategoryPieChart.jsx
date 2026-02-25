import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useProjects } from '../../context/ProjectContext';

const COLORS = ['hsl(var(--primary))', '#8b5cf6', '#ec4899', '#f97316'];

export function CategoryPieChart() {
    const { projects } = useProjects();

    const data = useMemo(() => {
        const grouped = projects.reduce((acc, curr) => {
            const cat = curr.category || 'その他';
            if (!acc[cat]) {
                acc[cat] = 0;
            }
            acc[cat] += Number(curr.price);
            return acc;
        }, {});

        return Object.entries(grouped).map(([name, value]) => ({ name, value }));
    }, [projects]);

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-card border border-border p-3 rounded-lg shadow-lg">
                    <p className="font-bold">{payload[0].name}</p>
                    <p className="text-foreground/80 text-sm mt-1">
                        ¥{payload[0].value.toLocaleString()}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col h-full">
            <h3 className="text-lg font-bold mb-6 flex items-center">
                <span className="w-1.5 h-6 bg-purple-500 rounded-full mr-3"></span>
                カテゴリ別 収益比率
            </h3>
            <div className="flex-1 min-h-[300px]">
                {data.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="hsl(var(--card))"
                                strokeWidth={3}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                        </PieChart>
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
