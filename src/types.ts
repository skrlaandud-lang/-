export type WorkType = 'advertising' | 'construction';

export type WorkStatus = '대기' | '진행중' | '완료';

export interface WorkRule {
  key: string;
  label: string;
  keywords: string[];
}

export interface DotMatch {
  ruleKey: string;
  ruleLabel: string;
  matchedFiles: string[];
}

export interface WorkItem {
  requestName: string;
  files: string[];
  dots: boolean[];
  dotMatches: DotMatch[];
  status: WorkStatus;
  inferredType: WorkType;
}

export interface ParseResult {
  requestName: string;
  normalizedName: string;
}
