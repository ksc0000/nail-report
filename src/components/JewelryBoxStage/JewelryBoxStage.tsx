import type { NailItem, LayoutMode } from '../../types/nail';
import NailCard from '../NailCard/NailCard';
import styles from './JewelryBoxStage.module.css';

const MODE_CLASS: Record<LayoutMode, string> = {
  grid:   styles.modeGrid,
  sphere: styles.modeSphere,
  spiral: styles.modeSpiral,
};

interface Props {
  nails: NailItem[];
  layout: LayoutMode;
  onSelect: (nail: NailItem) => void;
}

export default function JewelryBoxStage({ nails, layout, onSelect }: Props) {
  return (
    <div className={`${styles.stage} ${MODE_CLASS[layout]}`}>
      {nails.map((nail) => (
        <div key={nail.id} className={styles.item}>
          <NailCard nail={nail} onClick={onSelect} />
        </div>
      ))}
    </div>
  );
}
