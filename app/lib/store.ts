import { AppData, PlanData, PlanItem, Program } from './types';

const KEY = 'spira';

export const emptyPlan: PlanData = {
  brandImages: [],
  brandingKeywords: [],
  tagline: '',
  problems: [],
  mission: '',
  vision: '',
  concept: '',
  valueProposition: { personal: '', social: '', environmental: '' },
  targetCustomers: [],
  solutions: [],
  revenueModel: [],
  growthStages: [],
  workAreas: [],
};

export const empty: AppData = {
  activeWorkspaceId: null,
  workspaces: [],
  homeHiddenTodos: {},
};

export function load(): AppData {
  if (typeof window === 'undefined') return empty;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw);

    // migrate from old single-workspace format
    if ('workspace' in parsed && !('workspaces' in parsed)) {
      if (!parsed.workspace) return empty;
      return {
        activeWorkspaceId: parsed.workspace.id,
        workspaces: [{
          workspace: { id: parsed.workspace.id, name: parsed.workspace.name },
          plan: { ...emptyPlan, vision: parsed.workspace.vision ?? '' },
          programs: parsed.programs ?? [],
          routineSystems: parsed.routineSystems ?? [],
          resources: parsed.resources ?? [],
          subscriptions: parsed.subscriptions ?? [],
          completions: parsed.completions ?? {},
          skipped: parsed.skipped ?? {},
          quickTasks: parsed.quickTasks ?? [],
          events: parsed.events ?? [],
          proofs: parsed.proofs ?? [],
          timeRecords: parsed.timeRecords ?? [],
        }],
      };
    }

    // ensure each entry has plan
    if (parsed.workspaces) {
      parsed.workspaces = parsed.workspaces.map((e: WorkspaceEntry) => {
        const plan = { ...emptyPlan, ...(e.plan ?? {}) };
        // migrate single brandImage → brandImages array
        if (!plan.brandImages?.length && (e.plan as { brandImage?: string })?.brandImage) {
          plan.brandImages = [(e.plan as { brandImage: string }).brandImage];
        }
        // migrate string[] → PlanItem[] for solutions and revenueModel
        const toItems = (arr: unknown[]): PlanItem[] =>
          (arr ?? []).map(i => typeof i === 'string' ? { title: i, memo: '' } : i as PlanItem);
        plan.solutions = toItems(plan.solutions);
        plan.revenueModel = toItems(plan.revenueModel);
        // 프로그램에 연도/분기/데드라인 기본값 부여 (기존 데이터 보존)
        const programs = (e.programs ?? []).map((p: Program) => {
          const ref = p.deadline || p.startDate;
          const refDate = ref ? new Date(ref) : new Date();
          const year = p.year ?? refDate.getFullYear();
          const quarter = p.quarter ?? (Math.floor(refDate.getMonth() / 3) + 1);
          return { ...p, year, quarter, deadlines: p.deadlines ?? [] };
        });
        return { ...e, plan, programs, subscriptions: e.subscriptions ?? [], events: e.events ?? [], annualGoals: e.annualGoals ?? {}, revenueTarget: e.revenueTarget };
      });
    }

    return { ...empty, ...parsed };
  } catch {
    return empty;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type WorkspaceEntry = any;

// 서버 동기화 훅 — SyncProvider가 로그인 후 등록한다. (디바운스는 pusher 쪽에서 처리)
let serverPusher: ((d: AppData) => void) | null = null;
export function setServerPusher(fn: ((d: AppData) => void) | null): void {
  serverPusher = fn;
}

// localStorage 에만 기록 (서버로 되쏘지 않음) — 서버에서 받은 데이터를 로컬에 반영할 때 사용
export function writeLocalRaw(data: AppData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // localStorage 용량 초과 시 이미지 데이터만 제거 후 재시도
    const stripped = {
      ...data,
      workspaces: data.workspaces.map(e => ({
        ...e,
        proofs: (e.proofs ?? []).map(p => ({ ...p, image: '' })),
      })),
    };
    try {
      localStorage.setItem(KEY, JSON.stringify(stripped));
    } catch {
      // 그래도 실패하면 무시
    }
    throw new Error('이미지가 너무 커서 저장에 실패했습니다. 이미지 없이 저장되었습니다.');
  }
}

export function save(data: AppData): void {
  let err: unknown = null;
  try {
    writeLocalRaw(data);
  } catch (e) {
    err = e; // 로컬 저장 실패해도 서버 저장은 시도
  }
  serverPusher?.(data); // 로그인 상태면 서버에도 저장(디바운스)
  if (err) throw err;
}

export function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

export function todayDow(): number {
  return new Date().getDay();
}
