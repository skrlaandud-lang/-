import { ParseResult, WorkItem, WorkStatus, WorkType } from './types';
import { rulesByType } from './rules';

const stopTokens = new Set(['견적서', '청구서', '계약서', '도면', '발주서', '사진', '출력', '회사이름', 'v2']);

function cleanToken(token: string) {
  return token.trim().replace(/[()]/g, '');
}

export function parseRequestName(fileName: string): ParseResult {
  const base = fileName.replace(/\.[^.]+$/, '');
  const parts = base
    .split('-')
    .map(cleanToken)
    .filter(Boolean)
    .filter((part) => !/^\d{8}$/.test(part))
    .filter((part) => !/^\d{3,5}x\d{3,5}$/i.test(part));

  const middle = parts.slice(1, Math.max(2, parts.length - 1));
  const useful = (middle.length > 0 ? middle : parts).filter((part) => !stopTokens.has(part));
  const requestName = (useful[0] ?? parts[0] ?? base).replace(/\s+/g, ' ').trim();
  return { requestName, normalizedName: requestName.toLowerCase() };
}

export function computeStatus(dots: boolean[]): WorkStatus {
  const filled = dots.filter(Boolean).length;
  if (filled === 0) return '대기';
  if (filled === dots.length) return '완료';
  return '진행중';
}

function inferGroupType(files: string[]): WorkType {
  const score = { advertising: 0, construction: 0 };
  const lowerFiles = files.map((f) => f.toLowerCase());
  (Object.keys(rulesByType) as WorkType[]).forEach((type) => {
    for (const rule of rulesByType[type]) {
      if (rule.keywords.some((keyword) => lowerFiles.some((file) => file.includes(keyword.toLowerCase())))) {
        score[type] += 1;
      }
    }
  });
  return score.construction > score.advertising ? 'construction' : 'advertising';
}

export function groupFilesByRequest(fileNames: string[], workType: WorkType): WorkItem[] {
  const grouped = new Map<string, { requestName: string; files: string[] }>();

  for (const file of fileNames) {
    const parsed = parseRequestName(file);
    const found = grouped.get(parsed.normalizedName);
    if (found) found.files.push(file);
    else grouped.set(parsed.normalizedName, { requestName: parsed.requestName, files: [file] });
  }

  return [...grouped.values()]
    .map((group) => {
      const inferredType = inferGroupType(group.files);
      const rules = rulesByType[workType];
      const lowerFiles = group.files.map((f) => f.toLowerCase());
      const dotMatches = rules.map((rule) => ({
        ruleKey: rule.key,
        ruleLabel: rule.label,
        matchedFiles: group.files.filter((file, idx) => rule.keywords.some((kw) => lowerFiles[idx].includes(kw.toLowerCase()))),
      }));
      const dots = dotMatches.map((match) => match.matchedFiles.length > 0);

      return {
        requestName: group.requestName,
        files: group.files,
        inferredType,
        dots,
        dotMatches,
        status: computeStatus(dots),
      };
    })
    .filter((item) => item.inferredType === workType)
    .sort((a, b) => a.requestName.localeCompare(b.requestName, 'ko'));
}
