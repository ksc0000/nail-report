import React, { useMemo } from 'react';
import type { NailItemDoc } from '../lib/firestore';

interface NailComparisonPanelProps {
  comparisonItemIds: string[];
  nailItems: NailItemDoc[];
  isFetching: boolean;
  onClear: () => void;
}

const formatDate = (ts: { toDate(): Date } | null | undefined): string | null => {
  if (!ts) return null;
  try {
    return ts.toDate().toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
  } catch {
    return null;
  }
};

const getSortedComparisonItems = (items: NailItemDoc[]): NailItemDoc[] =>
  [...items].sort((a, b) => {
    const ta = (a.createdAt ?? a.updatedAt)?.seconds ?? 0;
    const tb = (b.createdAt ?? b.updatedAt)?.seconds ?? 0;
    return ta - tb;
  });

const NailComparisonPanel: React.FC<NailComparisonPanelProps> = ({
  comparisonItemIds,
  nailItems,
  isFetching,
  onClear,
}) => {
  const comparisonItems = useMemo(() => {
    const selected = comparisonItemIds
      .map((id) => nailItems.find((item) => item.id === id))
      .filter((item): item is NailItemDoc => Boolean(item));
    return selected.length === 2 ? getSortedComparisonItems(selected) : selected;
  }, [comparisonItemIds, nailItems]);

  if (isFetching || comparisonItems.length === 0) return null;

  const renderComparisonItem = (item: NailItemDoc, label: string) => {
    const createdDate = formatDate(item.createdAt);
    const updatedDate = formatDate(item.updatedAt);
    return (
      <article className="comparison-card">
        <p className="comparison-side-label">{label}</p>
        <div className="comparison-image-frame">
          {item.imageUrl ? (
            <img
              className="comparison-image"
              src={item.imageUrl}
              alt={item.title + ' の比較用ネイル画像'}
            />
          ) : (
            <div className="comparison-no-image">画像なし</div>
          )}
        </div>
        <div className="comparison-card-body">
          <h4 className="comparison-title">{item.title}</h4>
          <div className="comparison-section">
            <span className="comparison-label">タグ</span>
            {item.tags.length > 0 ? (
              <div className="nail-item-tags">
                {item.tags.map((t) => (
                  <span key={t} className="nail-tag">
                    #{t}
                  </span>
                ))}
              </div>
            ) : (
              <p className="comparison-empty">タグなし</p>
            )}
          </div>
          {item.memo && (
            <div className="comparison-section">
              <span className="comparison-label">メモ</span>
              <p className="comparison-memo">{item.memo}</p>
            </div>
          )}
          <dl className="comparison-meta">
            {createdDate && (
              <div>
                <dt>作成日</dt>
                <dd>{createdDate}</dd>
              </div>
            )}
            {updatedDate && (
              <div>
                <dt>更新日</dt>
                <dd>{updatedDate}</dd>
              </div>
            )}
          </dl>
        </div>
      </article>
    );
  };

  return (
    <section className="comparison-panel" aria-labelledby="comparison-heading">
      <div className="comparison-header">
        <div>
          <h3 id="comparison-heading" className="summary-heading">
            ネイル比較
          </h3>
          <p className="comparison-prompt">
            {comparisonItems.length === 1
              ? '比較するネイルをもう1つ選択してください'
              : '2つのネイルを日付順（前・後）で比較しています'}
          </p>
        </div>
        <button type="button" className="btn-export" onClick={onClear}>
          比較をクリア
        </button>
      </div>
      <div className="comparison-grid">
        {comparisonItems.length === 2 ? (
          <>
            {renderComparisonItem(comparisonItems[0], '前')}
            {renderComparisonItem(comparisonItems[1], '後')}
          </>
        ) : (
          <>
            {renderComparisonItem(comparisonItems[0], '選択中')}
            <div className="comparison-card-placeholder">
              <p>2つ目を選択してください</p>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default NailComparisonPanel;
