import { LayoutDashboard, Video, ListTodo, Settings, PlusSquare, Calendar } from 'lucide-react';
import { cn } from '../../lib/utils';

export function Sidebar({ className, currentView, setCurrentView }) {
    const navigation = [
        { name: 'ダッシュボード', id: 'dashboard', icon: LayoutDashboard },
        { name: '案件追加', id: 'add', icon: PlusSquare },
        { name: '案件一覧・進捗', id: 'list', icon: ListTodo },
        { name: 'カレンダー', id: 'calendar', icon: Calendar },
    ];

    return (
        <div className={cn("flex h-full w-64 flex-col bg-card border-r border-border", className)}>
            <div className="flex h-16 shrink-0 items-center px-6 border-b border-border">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center mr-3 shadow-sm shadow-primary/20">
                    <Video className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold tracking-tight text-foreground">VideoDash</span>
            </div>
            <div className="flex flex-1 flex-col overflow-y-auto px-4 py-4">
                <nav className="flex-1 space-y-2">
                    {navigation.map((item) => {
                        const isCurrent = currentView === item.id;
                        return (
                            <button
                                key={item.name}
                                onClick={() => setCurrentView && setCurrentView(item.id)}
                                className={cn(
                                    isCurrent
                                        ? "bg-primary/10 text-primary border border-primary/20"
                                        : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground border border-transparent",
                                    "w-full group flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200"
                                )}
                            >
                                <item.icon
                                    className={cn(
                                        isCurrent ? "text-primary" : "text-foreground/50 group-hover:text-foreground",
                                        "mr-3 h-5 w-5 flex-shrink-0 transition-colors"
                                    )}
                                    aria-hidden="true"
                                />
                                {item.name}
                            </button>
                        )
                    })}
                </nav>
            </div>
            <div className="p-4 border-t border-border">
                <button className="w-full text-foreground/70 hover:bg-foreground/5 hover:text-foreground group flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 border border-transparent">
                    <Settings className="text-foreground/50 group-hover:text-foreground mr-3 h-5 w-5 flex-shrink-0 transition-colors" />
                    設定
                </button>
            </div>
        </div>
    );
}
