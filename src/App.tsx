import { ChangeEvent, useMemo, useRef, useState } from 'react';
import { groupFilesByRequest } from './parser';
import { rulesByType } from './rules';
import { sampleFiles } from './sampleData';
import { WorkType } from './types';
import './styles.css';

export default function App() {
  const [workType, setWorkType] = useState<WorkType>('advertising');
  const [query, setQuery] = useState('');
  const [folderLabel, setFolderLabel] = useState('샘플 데이터');
  const [sourceFiles, setSourceFiles] = useState<string[]>(sampleFiles);
  const [scanAt, setScanAt] = useState<string>(new Date().toLocaleString('ko-KR'));
  const fileInputRef = useRef<HTMLInputElement>(null);

  const items = useMemo(() => {
    const grouped = groupFilesByRequest(sourceFiles, workType);
    const q = query.trim().toLowerCase();
    return q ? grouped.filter((item) => item.requestName.toLowerCase().includes(q)) : grouped;
  }, [query, sourceFiles, workType, scanAt]);

  const handlePickFolder = () => {
    fileInputRef.current?.click();
  };

  const handleFolderChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    const names = files.map((file) => file.webkitRelativePath || file.name);
    const folderName = names[0].split('/')[0] || '선택 폴더';
    setSourceFiles(names);
    setFolderLabel(folderName);
    setScanAt(new Date().toLocaleString('ko-KR'));
  };

  const handleScan = () => {
    setScanAt(new Date().toLocaleString('ko-KR'));
  };

  return (
    <div className="app">
      <header>
        <h1>작업기억판</h1>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="의뢰명 검색" aria-label="의뢰명 검색" />
        <div className="controls">
          <button className={workType === 'advertising' ? 'active' : ''} onClick={() => setWorkType('advertising')}>광고</button>
          <button className={workType === 'construction' ? 'active' : ''} onClick={() => setWorkType('construction')}>건설</button>
          <button onClick={handlePickFolder}>폴더</button>
          <button onClick={handleScan}>스캔</button>
        </div>
        <input ref={fileInputRef} type="file" webkitdirectory="" directory="" multiple hidden onChange={handleFolderChange} />
        <p className="meta">폴더: {folderLabel}</p>
        <p className="meta">마지막 스캔: {scanAt}</p>
        <p className="meta">범례: {rulesByType[workType].map((rule) => rule.label).join(' · ')}</p>
      </header>

      <main>
        {items.map((item) => (
          <article key={item.requestName} className="row">
            <div className="name">{item.requestName}</div>
            <div className="status">{item.status}</div>
            <div className="dots">{item.dots.map((dot, i) => <span key={i}>{dot ? '●' : '○'}</span>)}</div>
            <ul className="explain">
              {item.dotMatches.map((match) => (
                <li key={match.ruleKey}>
                  {match.ruleLabel}: {match.matchedFiles.length > 0 ? match.matchedFiles.join(', ') : '없음'}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </main>
    </div>
  );
}
