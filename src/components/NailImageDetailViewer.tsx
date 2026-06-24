import React, { useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import type { NailItemDoc } from '../lib/firestore';

type DetailDisplayMode = 'Glass' | 'Snow Globe' | 'Velvet' | 'Showcase';

const DISPLAY_MODE_CLASS_NAMES: Record<DetailDisplayMode, string> = {
  Glass: 'display-mode-glass',
  'Snow Globe': 'display-mode-snow-globe',
  Velvet: 'display-mode-velvet',
  Showcase: 'display-mode-showcase',
};

type CharmPosition = 'left' | 'center' | 'right';

type CharmPlacement = {
  position: CharmPosition;
  style: CSSProperties & {
    '--charm-left': string;
    '--charm-top': string;
    '--charm-base-width': string;
    '--charm-rotation': string;
    '--charm-opacity': string;
    '--charm-delay': string;
  };
};

interface NailImageDetailViewerProps {
  item: NailItemDoc;
  displayMode?: DetailDisplayMode;
  onClose: () => void;
}

const hashString = (value: string): number => {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const seededUnit = (seed: string, salt: number): number =>
  hashString(`${seed}:${salt}`) / 0xffffffff;

const buildCharmPlacements = (seed: string): CharmPlacement[] => {
  const base = [
    { position: 'left', left: 17, leftRange: 8, top: 31, topRange: 12, width: 70, rotation: -13 },
    { position: 'center', left: 50, leftRange: 5, top: 20, topRange: 8, width: 86, rotation: 1 },
    { position: 'right', left: 72, leftRange: 8, top: 33, topRange: 12, width: 70, rotation: 13 },
  ] satisfies Array<{
    position: CharmPosition;
    left: number;
    leftRange: number;
    top: number;
    topRange: number;
    width: number;
    rotation: number;
  }>;

  return base.map((slot, index) => {
    const signed = (salt: number) => seededUnit(seed, index * 7 + salt) - 0.5;
    const left = slot.left + signed(1) * slot.leftRange;
    const top = slot.top + signed(2) * slot.topRange;
    const width = slot.width + signed(3) * 10;
    const rotation = slot.rotation + signed(4) * 9;
    const opacity = 0.9 + seededUnit(seed, index * 7 + 5) * 0.1;
    const delay = -seededUnit(seed, index * 7 + 6) * 3.6;

    return {
      position: slot.position,
      style: {
        '--charm-left': `${left.toFixed(1)}%`,
        '--charm-top': `${top.toFixed(1)}%`,
        '--charm-base-width': `${width.toFixed(1)}px`,
        '--charm-rotation': `${rotation.toFixed(1)}deg`,
        '--charm-opacity': opacity.toFixed(2),
        '--charm-delay': `${delay.toFixed(2)}s`,
      },
    };
  });
};

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

const NailImageDetailViewer: React.FC<NailImageDetailViewerProps> = ({
  item,
  displayMode = 'Glass',
  onClose,
}) => {
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
  const charmPlacements = buildCharmPlacements(item.id);

  return (
    <div
      className="nail-detail-backdrop"
      role="presentation"
      onClick={onClose}
    >
      <div
        className={`nail-detail-dialog ${DISPLAY_MODE_CLASS_NAMES[displayMode]}`}
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
              {charmPlacements.map(({ position, style }) => (
                <div
                  key={position}
                  className={`nail-charm-shell nail-charm-shell--${position}`}
                  style={style}
                >
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
