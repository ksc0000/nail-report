import { SKIN_CONFIGS } from '../../types/nail';
import type { SkinType } from '../../types/nail';
import styles from './SkinSelector.module.css';

const SKIN_ORDER: SkinType[] = ['glass', 'snow', 'velvet', 'showcase'];

interface Props {
  current: SkinType;
  onChange: (skin: SkinType) => void;
}

export default function SkinSelector({ current, onChange }: Props) {
  return (
    <div className={styles.row}>
      {SKIN_ORDER.map((skin) => (
        <button
          key={skin}
          className={`${styles.btn} ${current === skin ? styles.active : ''}`}
          onClick={() => onChange(skin)}
          aria-pressed={current === skin}
        >
          {SKIN_CONFIGS[skin].label}
        </button>
      ))}
    </div>
  );
}
