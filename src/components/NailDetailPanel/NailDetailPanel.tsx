import type { NailItem } from '../../types/nail';
import styles from './NailDetailPanel.module.css';

interface Props {
  nail: NailItem | null;
  onClose: () => void;
}

function formatDate(iso: string): string {
  return iso.slice(0, 10).replace(/-/g, '.');
}

export default function NailDetailPanel({ nail, onClose }: Props) {
  const visible = nail !== null;

  const gradientCss = nail
    ? nail.gradient.length >= 2
      ? `linear-gradient(145deg, ${nail.gradient.join(', ')})`
      : nail.gradient[0] ?? nail.color
    : '';

  return (
    <div className={`${styles.overlay} ${visible ? styles.visible : ''}`} aria-hidden={!visible}>
      <div className={styles.backdrop} onClick={onClose} />

      <div className={styles.sheet} role="dialog" aria-modal="true">
        <div className={styles.handle} />

        {nail && (
          <>
            <div className={styles.preview}>
              <div className={styles.previewChip}>
                <div className={styles.previewFill} style={{ background: gradientCss }} />
                <div className={styles.previewShine} />
              </div>
            </div>

            <div className={styles.name}>{nail.title}</div>
            <div className={styles.date}>{formatDate(nail.createdAt)}</div>

            {nail.parts.length > 0 && (
              <div className={styles.tags}>
                {nail.parts.map((p) => (
                  <span key={p} className={styles.tag}>{p}</span>
                ))}
              </div>
            )}

            <div className={styles.meta}>
              <div className={styles.metaItem}>
                <div className={styles.metaLabel}>SHAPE</div>
                <div className={styles.metaValue}>{nail.shape.charAt(0).toUpperCase() + nail.shape.slice(1)}</div>
              </div>
              <div className={styles.metaItem}>
                <div className={styles.metaLabel}>TEXTURE</div>
                <div className={styles.metaValue}>{nail.texture.charAt(0).toUpperCase() + nail.texture.slice(1)}</div>
              </div>
              {nail.memo && (
                <div className={styles.metaItem}>
                  <div className={styles.metaLabel}>MEMO</div>
                  <div className={styles.metaValue}>{nail.memo}</div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
