'use client';
import { useEffect } from 'react';
import { useStore } from '../lib/useStore';
import { useChatContext } from '../lib/ChatContext';

export default function AppContextBridge() {
  const store = useStore();
  const chat = useChatContext();

  useEffect(() => {
    if (!chat || !store.ready) return;

    const entries = store.allWorkspacesEntries;
    const today = new Date().toISOString().split('T')[0];
    const lines: string[] = [];

    for (const entry of entries) {
      const wsId = entry.workspace.id;
      const wsName = entry.workspace.name;
      lines.push(`\n## 워크스페이스: ${wsName} (wsId: ${wsId})`);

      if (entry.programs.length > 0) {
        lines.push(`### 프로그램`);
        for (const p of entry.programs) {
          const started = !p.startDate || p.startDate <= today;
          lines.push(`- id:${p.id} | ${p.name} | color:${p.color ?? ''} | weight:${p.weight ?? 1}${p.startDate ? ` | startDate:${p.startDate}` : ''}${started ? '' : ' (미시작)'}`);
        }
      }

      if (entry.routineSystems.length > 0) {
        lines.push(`### 루틴 시스템`);
        for (const rs of entry.routineSystems) {
          const prog = entry.programs.find(p => p.id === rs.programId);
          const progLabel = prog ? ` | program:${prog.name}(programId:${rs.programId})` : '';
          lines.push(`- id:${rs.id} | ${rs.name}${progLabel}${rs.startDate ? ` | startDate:${rs.startDate}` : ''}`);
          for (const t of rs.tasks) {
            const dline = t.deadline ? ` | deadline:${t.deadline}` : '';
            lines.push(`  - taskId:${t.id} | ${t.name}${dline}`);
          }
        }
      }
    }

    chat.setAppContext(lines.join('\n'));
  });

  return null;
}
