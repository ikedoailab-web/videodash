import { Bell, Search, Menu, Moon, Sun } from 'lucide-react';
import { cn } from '../../lib/utils';

export function Header({ setSidebarOpen, darkMode, toggleDarkMode, className }) {
    return (
        <header className={cn("sticky top-0 z-10 flex h-16 flex-shrink-0 items-center gap-x-4 border-b border-border bg-background/80 backdrop-blur-md px-4 sm:gap-x-6 sm:px-6 lg:px-8", className)}>
            <button
                type="button"
                className="-m-2.5 p-2.5 text-foreground/70 xl:hidden hover:text-foreground transition-colors"
                onClick={() => setSidebarOpen(true)}
            >
                <span className="sr-only">Open sidebar</span>
                <Menu className="h-5 w-5" aria-hidden="true" />
            </button>

            {/* Separator */}
            <div className="h-6 w-px bg-border xl:hidden" aria-hidden="true" />

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                <form className="relative flex flex-1" action="#" method="GET" onSubmit={(e) => e.preventDefault()}>
                    <label htmlFor="search-field" className="sr-only">
                        Search
                    </label>
                    <Search
                        className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-foreground/50"
                        aria-hidden="true"
                    />
                    <input
                        id="search-field"
                        className="block h-full w-full border-0 bg-transparent py-0 pl-8 pr-0 text-foreground focus:ring-0 sm:text-sm outline-none"
                        placeholder="Search projects..."
                        type="search"
                        name="search"
                    />
                </form>
                <div className="flex items-center gap-x-4 lg:gap-x-6">
                    <button
                        type="button"
                        className="-m-2.5 p-2.5 text-foreground/70 hover:text-foreground transition-colors"
                        onClick={toggleDarkMode}
                    >
                        <span className="sr-only">Toggle dark mode</span>
                        {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </button>
                    <button type="button" className="-m-2.5 p-2.5 text-foreground/70 hover:text-foreground transition-colors relative">
                        <span className="sr-only">View notifications</span>
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-primary" />
                    </button>

                    {/* Separator */}
                    <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-border" aria-hidden="true" />

                    {/* Profile dropdown */}
                    <div className="flex items-center gap-x-4 cursor-pointer hover:opacity-80 transition-opacity">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-primary-foreground font-bold text-sm shadow-sm">
                            U
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
