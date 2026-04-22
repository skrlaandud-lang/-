import { WorkRule, WorkType } from './types';

export const rulesByType: Record<WorkType, WorkRule[]> = {
  advertising: [
    { key: 'source', label: '원본', keywords: ['psd', 'ai', '원본', 'source'] },
    { key: 'draft', label: '시안', keywords: ['시안', 'draft'] },
    { key: 'estimate', label: '견적', keywords: ['견적', 'estimate', 'quote'] },
    { key: 'invoice', label: '청구', keywords: ['청구', 'invoice'] },
    { key: 'photo', label: '사진', keywords: ['사진', '대지', 'photo'] },
    { key: 'output', label: '출력', keywords: ['출력', 'print'] },
  ],
  construction: [
    { key: 'estimate', label: '견적', keywords: ['견적', 'estimate', 'quote'] },
    { key: 'contract', label: '계약', keywords: ['계약', 'contract'] },
    { key: 'drawing', label: '도면', keywords: ['도면', 'cad', 'dwg'] },
    { key: 'order', label: '발주', keywords: ['발주', 'order'] },
    { key: 'photo', label: '사진', keywords: ['현장', '사진', 'photo'] },
    { key: 'extra', label: '추가', keywords: ['추가', '기타', 'extra'] },
  ],
};
