import { createContext, useContext, useState, useEffect } from 'react';
import { format } from 'date-fns';
import { supabase } from '../lib/supabase';

const ProjectContext = createContext();

export function ProjectProvider({ children }) {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCloudConnected, setIsCloudConnected] = useState(!!supabase);

    // Initial load
    useEffect(() => {
        const loadData = async () => {
            if (supabase) {
                // Fetch from Supabase
                try {
                    const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
                    if (error) throw error;
                    // Transform snake_case from DB to camelCase for UI
                    const formattedData = data.map(item => ({
                        id: item.id,
                        title: item.title,
                        category: item.category,
                        price: item.price,
                        hours: item.hours,
                        deliveryDate: item.delivery_date,
                        status: item.status,
                        month: item.delivery_date ? item.delivery_date.substring(0, 7) : format(new Date(), 'yyyy-MM')
                    }));
                    setProjects(formattedData);
                    setIsCloudConnected(true);
                } catch (error) {
                    console.error('Error fetching from Supabase:', error);
                    setIsCloudConnected(false);
                    // Supabase接続失敗時はlocalStorageにフォールバック
                    const saved = localStorage.getItem('videodash_projects');
                    if (saved) {
                        try { setProjects(JSON.parse(saved)); } catch (e) { /* ignore */ }
                    }
                }
            } else {
                // Fallback to localStorage (モックデータは使用しない)
                const saved = localStorage.getItem('videodash_projects');
                if (saved) {
                    try {
                        setProjects(JSON.parse(saved));
                    } catch (e) {
                        setProjects([]);
                    }
                } else {
                    setProjects([]);
                }
            }
            setIsLoading(false);
        };
        loadData();
    }, []);

    // Effect for local storage sync (only if not using Supabase)
    useEffect(() => {
        if (!supabase || !isCloudConnected) {
            localStorage.setItem('videodash_projects', JSON.stringify(projects));
        }
    }, [projects, isLoading, isCloudConnected]);

    const addProject = async (project) => {
        const generatedId = Math.random().toString(36).substr(2, 9);
        const month = project.deliveryDate ? project.deliveryDate.substring(0, 7) : format(new Date(), 'yyyy-MM');

        let newProject = { ...project, id: generatedId, month };

        // Optimistic UI update
        setProjects((prev) => [newProject, ...prev]);

        if (supabase && isCloudConnected) {
            try {
                const { data, error } = await supabase.from('projects').insert([{
                    title: project.title,
                    category: project.category,
                    price: project.price,
                    hours: project.hours,
                    delivery_date: project.deliveryDate,
                    status: project.status
                }]).select('*').single();

                if (error) throw error;

                // Replace optimistic ID with real DB ID
                setProjects((prev) => prev.map(p => p.id === generatedId ? {
                    ...p,
                    id: data.id,
                    month: data.delivery_date.substring(0, 7)
                } : p));
            } catch (error) {
                console.error('Error inserting to Supabase:', error);
                setIsCloudConnected(false);
                // Supabaseが使えない場合でもローカルには保存したままにする
                alert(`通信エラーが発生しましたが、データはこの端末には保存されています。\n\n詳細: ${error.message ?? error}`);
            }
        }
    };

    const updateProjectStatus = async (id, newStatus) => {
        const previousProjects = [...projects];
        setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p)));

        if (supabase && isCloudConnected) {
            try {
                const { error } = await supabase.from('projects').update({ status: newStatus }).eq('id', id);
                if (error) throw error;
            } catch (error) {
                console.error('Error updating Supabase:', error);
                setIsCloudConnected(false);
                // ローカルの変更はそのまま維持する
            }
        }
    };

    const deleteProject = async (id) => {
        const previousProjects = [...projects];
        setProjects((prev) => prev.filter((p) => p.id !== id));

        if (supabase && isCloudConnected) {
            try {
                const { error } = await supabase.from('projects').delete().eq('id', id);
                if (error) throw error;
            } catch (error) {
                console.error('Error deleting from Supabase:', error);
                setIsCloudConnected(false);
                // ローカルの削除はそのまま維持する
            }
        }
    };

    const editProject = async (id, updatedData) => {
        const month = updatedData.deliveryDate ? updatedData.deliveryDate.substring(0, 7) : format(new Date(), 'yyyy-MM');
        const updatedProject = { ...updatedData, id, month };

        const previousProjects = [...projects];
        setProjects((prev) => prev.map((p) => (p.id === id ? updatedProject : p)));

        if (supabase && isCloudConnected) {
            try {
                const { error } = await supabase.from('projects').update({
                    title: updatedData.title,
                    category: updatedData.category,
                    price: updatedData.price,
                    hours: updatedData.hours,
                    delivery_date: updatedData.deliveryDate,
                    status: updatedData.status
                }).eq('id', id);
                if (error) throw error;
            } catch (error) {
                console.error('Error updating project in Supabase:', error);
                setIsCloudConnected(false);
                // ローカルの変更はそのまま維持しつつ、ユーザーには詳細を伝える
                alert(`通信エラーが発生しましたが、データはこの端末には保存されています。\n\n詳細: ${error.message ?? error}`);
            }
        }
    };

    // CSV出力機能
    const exportToCSV = () => {
        if (projects.length === 0) {
            alert('エクスポートする案件データがありません。');
            return;
        }
        const headers = ['案件名', 'カテゴリ', '単価(円)', '作業時間(h)', '納品日', 'ステータス'];
        const rows = projects.map(p => [
            p.title, p.category, p.price, p.hours, p.deliveryDate, p.status
        ]);
        const csvContent = [headers, ...rows].map(r => r.join(',')).join('\n');
        const bom = '\uFEFF';
        const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `videodash_projects_${format(new Date(), 'yyyyMMdd')}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <ProjectContext.Provider value={{ projects, addProject, editProject, updateProjectStatus, deleteProject, exportToCSV, isLoading, isCloudConnected }}>
            {children}
        </ProjectContext.Provider>
    );
}

export const useProjects = () => useContext(ProjectContext);

