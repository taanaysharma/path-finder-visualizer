import { CATEGORIES, CATEGORY_ORDER, ALGORITHMS } from '../../algorithms/registry';

export default function Sidebar({ activeAlgo, setActiveAlgo, collapsed, setCollapsed }) {
  return (
    <aside
      className={`shrink-0 h-full bg-[var(--color-ink-925)] border-r border-[var(--color-ink-700)]/60 flex flex-col transition-all duration-200 ${collapsed ? 'w-14' : 'w-64'}`}
    >
      <div className="flex items-center gap-2 h-14 px-3 border-b border-[var(--color-ink-700)]/60 shrink-0">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-8 h-8 grid place-items-center rounded-md text-[var(--color-ink-300)] hover:text-[var(--color-signal-400)] hover:bg-[var(--color-ink-800)] transition-colors shrink-0"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="1" y="2" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.4" />
            <line x1="6" y1="2" x2="6" y2="14" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </button>
        {!collapsed && (
          <div className="flex items-center gap-1.5 overflow-hidden">
            <span className="w-2 h-2 rounded-full bg-[var(--color-signal-500)] shrink-0 scanline-glow" />
            <span className="font-display font-bold text-[15px] text-[var(--color-ink-50)] truncate">Pathfinder</span>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-4">
        {CATEGORY_ORDER.map(catKey => {
          const cat = CATEGORIES[catKey];
          const algos = Object.entries(ALGORITHMS).filter(([, a]) => a.category === catKey);
          if (algos.length === 0) return null;
          return (
            <div key={catKey}>
              {!collapsed && (
                <div className="px-2 mb-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink-400)] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: cat.color }} />
                  {cat.label}
                </div>
              )}
              <div className="space-y-0.5">
                {algos.map(([key, algo]) => {
                  const isActive = activeAlgo === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setActiveAlgo(key)}
                      title={collapsed ? algo.label : undefined}
                      className={`w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] transition-colors group relative
                        ${isActive
                          ? 'bg-[var(--color-ink-800)] text-[var(--color-signal-400)]'
                          : 'text-[var(--color-ink-300)] hover:bg-[var(--color-ink-850)] hover:text-[var(--color-ink-100)]'}`}
                    >
                      {isActive && (
                        <span
                          className="absolute left-0 top-1 bottom-1 w-[2.5px] rounded-full"
                          style={{ background: cat.color }}
                        />
                      )}
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0 ml-0.5"
                        style={{ background: isActive ? cat.color : 'var(--color-ink-600)' }}
                      />
                      {!collapsed && <span className="truncate font-mono-tight">{algo.label}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="px-3 py-3 border-t border-[var(--color-ink-700)]/60 text-[10px] text-[var(--color-ink-500)] leading-relaxed shrink-0">
          15 algorithms · step debugger
        </div>
      )}
    </aside>
  );
}
