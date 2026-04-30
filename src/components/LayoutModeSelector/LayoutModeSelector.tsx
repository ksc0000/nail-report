import { LAYOUT_LABELS, LAYOUT_MODES } from '../../types/nail';
import type { LayoutMode } from '../../types/nail';
import styles from './LayoutModeSelector.module.css';

const ICONS: Record<LayoutMode, string> = {
  sphere: '◉',
  grid:   '⊞',
  spiral: '◎',
};

interface Props {
  mode: LayoutMode;
  onClick: () => void;
}

export default function LayoutModeSelector({ mode, onClick }: Props) {
  const next = LAYOUT_MODES[(LAYOUT_MODES.indexOf(mode) + 1) % LAYOUT_MODES.length];

  return (
    <button className={styles.btn} onClick={onClick} aria-label={`Switch to ${next} layout`}>
      <span className={styles.icon}>{ICONS[mode]}</span>
      {LAYOUT_LABELS[mode]}
    </button>
  );
}
