'use client';
import { useState, useRef, useEffect } from 'react';
import { TargetCustomer } from '../lib/types';

interface Props {
  initial?: TargetCustomer;
  onSave: (c: Omit<TargetCustomer, 'id'>) => void;
  onClose: () => void;
}

function Avatar({ image, name, size }: { image: string; name: string; size: number }) {
  const initials = name.trim().split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() || '?';
  if (image) {
    return (
      <img
        src={image}
        alt={name}
        style={{ width: size, height: size }}
        className="rounded-full object-cover"
      />
    );
  }
  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0"
    >
      <span className="text-neutral-700 font-semibold text-sm">{initials}</span>
    </div>
  );
}

export { Avatar };

export default function TargetCustomerModal({ initial, onSave, onClose }: Props) {
  const [image, setImage] = useState(initial?.image ?? '');
  const [name, setName] = useState(initial?.name ?? '');
  const [occupation, setOccupation] = useState(initial?.occupation ?? '');
  const [age, setAge] = useState(initial?.age ?? '');
  const [personality, setPersonality] = useState(initial?.personality ?? '');
  const [lifestyle, setLifestyle] = useState(initial?.lifestyle ?? '');
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({ image, name: name.trim(), occupation: occupation.trim(), age: age.trim(), personality: personality.trim(), lifestyle: lifestyle.trim(), notes: notes.trim() });
    onClose();
  };

  const field = (label: string, value: string, onChange: (v: string) => void, placeholder: string, textarea = false) => (
    <div>
      <label className="text-xs text-neutral-400 mb-1.5 block">{label}</label>
      {textarea ? (
        <textarea
          rows={3}
          className="w-full bg-neutral-100 border border-neutral-300 rounded-lg px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-violet-500 resize-none transition-colors"
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
        />
      ) : (
        <input
          className="w-full bg-neutral-100 border border-neutral-300 rounded-lg px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-violet-500 transition-colors"
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
        />
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 p-4" onClick={onClose}>
      <div
        className="bg-neutral-50 border border-neutral-300 rounded-2xl w-full max-w-lg shadow-2xl overflow-y-auto max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <h2 className="text-base font-semibold mb-5">
            {initial ? '페르소나 편집' : '타겟 페르소나 추가'}
          </h2>

          {/* Image picker */}
          <div className="flex items-center gap-4 mb-6">
            <Avatar image={image} name={name || '?'} size={64} />
            <div>
              <button
                onClick={() => fileRef.current?.click()}
                className="text-xs text-neutral-600 hover:text-neutral-500 transition-colors"
              >
                {image ? '이미지 변경' : '이미지 업로드'}
              </button>
              {image && (
                <button onClick={() => setImage('')} className="ml-3 text-xs text-neutral-500 hover:text-red-400 transition-colors">
                  삭제
                </button>
              )}
              <p className="text-xs text-neutral-600 mt-1">JPG, PNG 권장</p>
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
          </div>

          <div className="space-y-4">
            {field('이름 *', name, setName, '페르소나 이름')}
            <div className="grid grid-cols-2 gap-3">
              {field('직업', occupation, setOccupation, '예: 프리랜서 디자이너')}
              {field('나이', age, setAge, '예: 28세')}
            </div>
            {field('성격', personality, setPersonality, '예: 꼼꼼하고 계획적인 편')}
            {field('라이프스타일', lifestyle, setLifestyle, '예: 아침 루틴을 중시하며 자기계발에 관심')}
            {field('메모', notes, setNotes, '기타 특징, 니즈, 불편함 등', true)}
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button onClick={onClose} className="px-4 py-2 text-sm text-neutral-400 hover:text-neutral-800 transition-colors">
              취소
            </button>
            <button
              onClick={handleSave}
              disabled={!name.trim()}
              className="px-4 py-2 text-sm bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-neutral-900 transition-colors"
            >
              저장
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
