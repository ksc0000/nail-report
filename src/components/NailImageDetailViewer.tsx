import React, { useEffect, useRef } from 'react';
import type { NailItemDoc } from '../lib/firestore';

interface NailImageDetailViewerProps {
  item: NailItemDoc;
  onClose: () => void;
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

const NailImageDetailViewer: React.FC<NailImageDetailViewerProps> = ({ item, onClose }) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    closeButtonRef.current?.focus();
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const createdDate = formatDate(item.createdAt);
  const updatedDate =
    item.updatedAt &&
    item.createdAt &&
    item.updatedAt.seconds !== item.createdAt.seconds
      ? formatDate(item.updatedAt)
      : null;

  return (
    <div
      className="nail-detail-backdrop"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="nail-detail-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="nail-detail-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="nail-detail-header">
          <div>
            <p className="nail-detail-kicker">Jewelry Box Detail</p>
            <p className="nail-detail-close-hint">背景クリックまたはEscで閉じる</p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            className="nail-detail-close"
            onClick={onClose}
            aria-label="ネイル詳細カードを閉じる"
          >
            <span aria-hidden="true">×</span>
            閉じる
          </button>
        </div>
        <div className="nail-detail-image-frame">
          {item.imageUrl ? (
            <img
              className="nail-detail-image"
              src={item.imageUrl}
              alt={item.title + ' のネイル画像'}
            />
          ) : (
            <div className="nail-detail-no-image">画像なし</div>
          )}
        </div>
        {item.imageUrl && (
          <section className="nail-charm-panel" aria-labelledby="nail-charm-title">
            <div className="nail-charm-copy">
              <p className="nail-detail-kicker">Nail Charm</p>
              <h3 id="nail-charm-title" className="nail-charm-title">浮遊ビュー</h3>
            </div>
            <div className="nail-charm-stage" aria-hidden="true">
              <span className="nail-charm-orbit nail-charm-orbit--one" />
              <span className="nail-charm-orbit nail-charm-orbit--two" />
              {['left', 'center', 'right'].map((position) => (
                <div key={position} className={`nail-charm-shell nail-charm-shell--${position}`}>
                  <div className="nail-charm-chip">
                    <img
                      className="nail-charm-image"
                      src={item.imageUrl}
                      alt=""
                    />
                    <span className="nail-charm-shine" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        <div className="nail-detail-body">
          <h2 id="nail-detail-title" className="nail-detail-title">
            {item.title}
          </h2>
          <div className="nail-detail-section">
            <h3 className="nail-detail-label">タグ</h3>
            {item.tags.length > 0 ? (
              <div className="nail-item-tags">
                {item.tags.map((t) => (
                  <span key={t} className="nail-tag">
                    #{t}
                  </span>
                ))}
              </div>
            ) : (
              <p className="nail-detail-empty">タグなし</p>
            )}
          </div>
          {item.memo && (
            <div className="nail-detail-section">
              <h3 className="nail-detail-label">メモ</h3>
              <p className="nail-detail-memo">{item.memo}</p>
            </div>
          )}
          <dl className="nail-detail-meta">
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
      </div>
    </div>
  );
};

export default NailImageDetailViewer;
