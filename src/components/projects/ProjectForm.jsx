import { useState, useEffect } from 'react';
import { useProjects } from '../../context/ProjectContext';
import { Calendar, Clock, DollarSign, Tag, Type, X } from 'lucide-react';

export function ProjectForm({ onSuccess, onCancel, initialDeliveryDate, isModal = false }) {
    const { addProject } = useProjects();

    const [formData, setFormData] = useState({
        title: '',
        category: '編集',
        price: '',
        hours: '',
        deliveryDate: initialDeliveryDate || new Date().toISOString().split('T')[0],
        status: '制作中'
    });

    // Sync if prop changes (e.g., calendar selection changes)
    useEffect(() => {
        if (initialDeliveryDate) {
            setFormData(prev => ({ ...prev, deliveryDate: initialDeliveryDate }));
        }
    }, [initialDeliveryDate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title || !formData.price || !formData.hours) return;

        addProject(formData);

        if (!isModal) {
            setFormData({
                title: '',
                category: '編集',
                price: '',
                hours: '',
                deliveryDate: new Date().toISOString().split('T')[0],
                status: '制作中'
            });
        }

        if (onSuccess) onSuccess();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className={`space-y-6 ${!isModal ? "animate-in fade-in duration-500 slide-in-from-bottom-4 max-w-3xl mx-auto" : ""}`}>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className={`${isModal ? "text-2xl" : "text-3xl"} font-bold tracking-tight`}>新規案件登録</h1>
                    <p className="text-foreground/60 mt-1">新しい案件の詳細情報を入力して追加してください</p>
                </div>
                {isModal && onCancel && (
                    <button onClick={onCancel} className="p-2 hover:bg-muted rounded-full transition-colors text-foreground/50 hover:text-foreground">
                        <X className="h-5 w-5" />
                    </button>
                )}
            </div>

            <div className={`${!isModal ? "rounded-2xl border border-border shadow-sm" : ""} bg-card overflow-hidden`}>
                <form onSubmit={handleSubmit} className={`${isModal ? "py-4 space-y-6" : "p-6 md:p-8 space-y-8"}`}>

                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-foreground">案件名</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Type className="h-5 w-5 text-foreground/40" />
                            </div>
                            <input
                                type="text"
                                name="title"
                                required
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="例: 株式会社◯◯ PR動画制作"
                                className="block w-full pl-10 pr-3 py-3 border border-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-foreground">カテゴリ</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Tag className="h-5 w-5 text-foreground/40" />
                                </div>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-3 border border-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors outline-none appearance-none"
                                >
                                    <option value="編集">編集</option>
                                    <option value="撮影">撮影</option>
                                    <option value="ディレクション">ディレクション</option>
                                    <option value="その他">その他</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-foreground">納品予定日</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Calendar className="h-5 w-5 text-foreground/40" />
                                </div>
                                <input
                                    type="date"
                                    name="deliveryDate"
                                    required
                                    value={formData.deliveryDate}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-3 border border-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-foreground">単価 (円)</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <DollarSign className="h-5 w-5 text-foreground/40" />
                                </div>
                                <input
                                    type="number"
                                    name="price"
                                    min="0"
                                    required
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="0"
                                    className="block w-full pl-10 pr-3 py-3 border border-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-foreground">想定作業時間 (h)</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Clock className="h-5 w-5 text-foreground/40" />
                                </div>
                                <input
                                    type="number"
                                    name="hours"
                                    min="0"
                                    step="0.5"
                                    required
                                    value={formData.hours}
                                    onChange={handleChange}
                                    placeholder="0"
                                    className="block w-full pl-10 pr-3 py-3 border border-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-border flex justify-end">
                        <button
                            type="submit"
                            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-8 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95"
                        >
                            案件を登録する
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
