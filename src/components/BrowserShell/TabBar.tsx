import {
  Fragment,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactElement,
} from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { TAB_BY_ID, type TabId } from '../../types/tab';

type TabBarProps = {
  order: TabId[];
  activeTab: TabId;
  onTabChange: (tabId: TabId) => void;
  onReorder: (next: TabId[]) => void;
};

const DRAG_THRESHOLD = 4;
const SLIDE = 'transform 200ms cubic-bezier(0.2, 0, 0, 1)';

type DragState = {
  id: TabId;
  grabOffset: number;
  startX: number;
  lastX: number;
  started: boolean;
};

export function TabBar({ order, activeTab, onTabChange, onReorder }: TabBarProps) {
  const { currentUser, logout } = useAuth();
  const [draggingId, setDraggingId] = useState<TabId | null>(null);
  const rowRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef(new Map<TabId, HTMLDivElement>());
  const prevLefts = useRef(new Map<TabId, number>());
  const orderRef = useRef(order);
  const dragRef = useRef<DragState | null>(null);

  function positionDragged(id: TabId, clientX: number) {
    const el = tabRefs.current.get(id);
    const row = rowRef.current;
    const drag = dragRef.current;
    if (!el || !row || !drag) return;
    const rowRect = row.getBoundingClientRect();
    const tabWidth = el.offsetWidth;
    const desiredLeft = clientX - drag.grabOffset;
    const clampedLeft = Math.max(rowRect.left, Math.min(desiredLeft, rowRect.right - tabWidth));
    const slotLeft = rowRect.left + el.offsetLeft;
    el.style.transition = 'none';
    el.style.transform = `translateX(${clampedLeft - slotLeft}px)`;
    el.style.zIndex = '20';
    el.style.cursor = 'grabbing';
  }

  function reorderDuringDrag(clientX: number, id: TabId) {
    const el = tabRefs.current.get(id);
    const row = rowRef.current;
    const drag = dragRef.current;
    if (!el || !row || !drag) return;
    const rowRect = row.getBoundingClientRect();
    const tabWidth = el.offsetWidth;
    const desiredLeft = clientX - drag.grabOffset;
    const clampedLeft = Math.max(rowRect.left, Math.min(desiredLeft, rowRect.right - tabWidth));
    const center = clampedLeft + tabWidth / 2;
    const current = orderRef.current;
    const index = current.indexOf(id);
    if (index === -1) return;

    if (index < current.length - 1) {
      const neighbor = tabRefs.current.get(current[index + 1]);
      if (neighbor) {
        const neighborCenter = rowRect.left + neighbor.offsetLeft + neighbor.offsetWidth / 2;
        if (center > neighborCenter) {
          const next = [...current];
          next.splice(index, 1);
          next.splice(index + 1, 0, id);
          onReorder(next);
          return;
        }
      }
    }
    if (index > 0) {
      const neighbor = tabRefs.current.get(current[index - 1]);
      if (neighbor) {
        const neighborCenter = rowRect.left + neighbor.offsetLeft + neighbor.offsetWidth / 2;
        if (center < neighborCenter) {
          const next = [...current];
          next.splice(index, 1);
          next.splice(index - 1, 0, id);
          onReorder(next);
        }
      }
    }
  }

  function handlePointerMove(event: PointerEvent) {
    const drag = dragRef.current;
    if (!drag) return;
    drag.lastX = event.clientX;
    if (!drag.started) {
      if (Math.abs(event.clientX - drag.startX) < DRAG_THRESHOLD) return;
      drag.started = true;
      setDraggingId(drag.id);
    }
    positionDragged(drag.id, event.clientX);
    reorderDuringDrag(event.clientX, drag.id);
  }

  function handlePointerUp() {
    const drag = dragRef.current;
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);
    dragRef.current = null;
    if (!drag || !drag.started) return;
    const el = tabRefs.current.get(drag.id);
    if (el) {
      el.style.transition = SLIDE;
      el.style.transform = '';
      el.style.zIndex = '';
      el.style.cursor = '';
      const clear = () => {
        el.style.transition = '';
        el.removeEventListener('transitionend', clear);
      };
      el.addEventListener('transitionend', clear);
    }
    setDraggingId(null);
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>, id: TabId) {
    if (event.button !== 0) return;
    const el = tabRefs.current.get(id);
    if (!el) return;
    dragRef.current = {
      id,
      grabOffset: event.clientX - el.getBoundingClientRect().left,
      startX: event.clientX,
      lastX: event.clientX,
      started: false,
    };
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  }

  useLayoutEffect(() => {
    orderRef.current = order;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    tabRefs.current.forEach((el, id) => {
      const left = el.offsetLeft;
      const prev = prevLefts.current.get(id);
      if (!reduce && prev !== undefined && id !== draggingId) {
        const dx = prev - left;
        if (dx) {
          el.style.transition = 'none';
          el.style.transform = `translateX(${dx}px)`;
          requestAnimationFrame(() => {
            el.style.transition = SLIDE;
            el.style.transform = '';
            const clear = () => {
              el.style.transition = '';
              el.removeEventListener('transitionend', clear);
            };
            el.addEventListener('transitionend', clear);
          });
        }
      }
      prevLefts.current.set(id, left);
    });
    if (draggingId) {
      const drag = dragRef.current;
      if (drag) positionDragged(draggingId, drag.lastX);
    }
  });

  function showDivider(index: number): boolean {
    if (draggingId) return false;
    return order[index - 1] !== activeTab && order[index] !== activeTab;
  }

  return (
    <nav className="flex select-none items-end justify-between gap-4 bg-zinc-200 px-2 pt-2">
      <div ref={rowRef} className="flex items-end">
        {order.map((id, index) => {
          const tab = TAB_BY_ID[id];
          const active = id === activeTab;
          const dragging = id === draggingId;
          return (
            <Fragment key={id}>
              {index > 0 && (
                <span
                  aria-hidden="true"
                  className={`mb-3 h-4 w-px ${showDivider(index) ? 'bg-zinc-400' : 'bg-transparent'}`}
                />
              )}
              <div
                ref={(el) => {
                  if (el) tabRefs.current.set(id, el);
                  else tabRefs.current.delete(id);
                }}
                onPointerDown={(event) => handlePointerDown(event, id)}
                onClick={() => onTabChange(id)}
                role="tab"
                aria-selected={active}
                className={`flex w-44 touch-none items-center gap-2 rounded-t-lg px-3 py-2.5 text-sm transition-[background-color,color,opacity] duration-200 ${
                  active
                    ? 'bg-white text-zinc-900'
                    : 'text-zinc-600 hover:bg-zinc-300/70 hover:text-zinc-900'
                } ${dragging ? 'opacity-90' : ''}`}
              >
                <TabIcon id={id} active={active} />
                <span className="truncate">{tab.label}</span>
              </div>
            </Fragment>
          );
        })}
      </div>

      <div className="flex items-center gap-3 pb-2 pr-1">
        <span className="text-sm font-medium text-zinc-600">{currentUser?.username}</span>
        <span aria-hidden="true" className="h-4 w-px bg-zinc-300" />
        <button
          type="button"
          onClick={logout}
          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
        >
          <LogoutIcon />
          Sair
        </button>
      </div>
    </nav>
  );
}

type TabIconProps = {
  id: TabId;
  active: boolean;
};

function TabIcon({ id, active }: TabIconProps) {
  const color = active ? 'text-indigo-600' : 'text-zinc-500';
  return (
    <span className={`shrink-0 ${color}`} aria-hidden="true">
      {ICONS[id]}
    </span>
  );
}

function LogoutIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M15 12H4m0 0l3.5-3.5M4 12l3.5 3.5M9 7V5a2 2 0 012-2h7a2 2 0 012 2v14a2 2 0 01-2 2h-7a2 2 0 01-2-2v-2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const ICONS: Record<TabId, ReactElement> = {
  'training-call': (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path
        d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 005 5l1.5-2 4 1.5v3a2 2 0 01-2.2 2A16 16 0 014.5 5.7 2 2 0 016.5 3.5z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  ),
  'client-hub': (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 20V6a2 2 0 012-2h7a2 2 0 012 2v14M15 20V10h3a2 2 0 012 2v8M4 20h16M7 8h4M7 12h4M7 16h4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  'link-test': (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 14l4 4 4-8 4 12 4-16"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  'service-orders': (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path
        d="M8 4h8a2 2 0 012 2v13a1 1 0 01-1.5.9L15 19l-1.5 1-1.5-1-1.5 1-1.5-1-1.5.9A1 1 0 016 19V6a2 2 0 012-2z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M9 8h6M9 11h6M9 14h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  ),
};
