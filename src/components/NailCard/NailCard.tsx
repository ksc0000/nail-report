import type { NailItem } from '../../types/nail';
import styles from './NailCard.module.css';

interface Props {
  nail: NailItem;
  onClick: (nail: NailItem) => void;
}

const SHAPE_CLASS: Record<NailItem['shape'], string> = {
  almond:   styles.almond,
  oval:     styles.oval,
  square:   styles.square,
  coffin:   styles.coffin,
  stiletto: styles.stiletto,
  round:    styles.round,
};

export default function NailCard({ nail, onClick }: Props) {
  const gradientCss = nail.gradient.length >= 2
    ? `linear-gradient(145deg, ${nail.gradient.join(', ')})`
    : nail.gradient[0] ?? nail.color;

  return (
    <div className={styles.card} onClick={() => onClick(nail)}>
      <div className={`${styles.chip} ${SHAPE_CLASS[nail.shape]}`}>
        <div className={styles.fill} style={{ background: gradientCss }} />
        <div className={styles.highlight} />
        {nail.sparkle && <div className={styles.sparkle} />}
        {nail.favorite && <span className={styles.favBadge}>♥</span>}
      </div>
      <span className={styles.title}>{nail.title}</span>
    </div>
  );
}
