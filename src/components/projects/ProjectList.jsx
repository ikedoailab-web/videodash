import { useState } from 'react';
import { useProjects } from '../../context/ProjectContext';
import { PlusCircle, Search } from 'lucide-react';

export function ProjectList() {
    const { projects, updateProjectStatus, deleteProject } = useProjects();
    const [searchTerm, setSearchTerm] = useState('');

    const statusColors = {
        '制作中': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        'チェック待ち': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
        '完遂': 'bg-green-500/10 text-green-500 border-green-500/20',
    };

    const filteredProjects = projects.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500 slide-in-from-bottom-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">案件一覧・進捗管理</h1>
                    <p className="text-foreground/60 mt-1">案件の状況と進捗を管理します</p>
                </div>
            </div>

            <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-border flex items-center gap-4 bg-muted/20">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50" />
                        <input
                            type="text"
                            placeholder="案件名やカテゴリで検索..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-foreground/60 uppercase bg-muted/40 border-b border-border">
                            <tr>
                                <th className="px-6 py-4 font-semibold">案件名</th>
                                <th className="px-6 py-4 font-semibold">カテゴリ</th>
                                <th className="px-6 py-4 font-semibold">納品日</th>
                                <th className="px-6 py-4 font-semibold text-right">単価・時間</th>
                                <th className="px-6 py-4 font-semibold text-center">ステータス</th>
                                <th className="px-6 py-4 font-semibold text-center">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProjects.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-foreground/50">
                                        表示する案件がありません
                                    </td>
                                </tr>
                            ) : (
                                filteredProjects.map((project) => (
                                    <tr key={project.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4 font-medium text-foreground">
                                            {project.title}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="bg-primary/10 text-primary px-2.5 py-1 rounded-md text-xs font-medium">
                                                {project.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-foreground/80">
                                            {project.deliveryDate}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="font-semibold">¥{Number(project.price).toLocaleString()}</div>
                                            <div className="text-xs text-foreground/50">{project.hours}h</div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <select
                                                value={project.status}
                                                onChange={(e) => updateProjectStatus(project.id, e.target.value)}
                                                className={`text-xs font-medium px-3 py-1.5 rounded-full border cursor-pointer outline-none transition-colors ${statusColors[project.status] || 'bg-card text-foreground'}`}
                                            >
                                                <option value="制作中">制作中</option>
                                                <option value="チェック待ち">チェック待ち</option>
                                                <option value="完遂">完遂</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => deleteProject(project.id)}
                                                className="text-foreground/40 hover:text-red-500 transition-colors px-2 py-1 rounded"
                                            >
                                                削除
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
