import { useState, useRef, useCallback } from 'react';
import { SKIN_CONFIGS, LAYOUT_MODES } from '../../types/nail';
import type { NailItem, SkinType, LayoutMode } from '../../types/nail';
import { SAMPLE_NAILS } from '../../data/sampleNails';
import JewelryBoxStage from '../JewelryBoxStage/JewelryBoxStage';
import LayoutModeSelector from '../LayoutModeSelector/LayoutModeSelector';
import SkinSelector from '../SkinSelector/SkinSelector';
import NailDetailPanel from '../NailDetailPanel/NailDetailPanel';
import styles from './JewelryBoxPage.module.css';

export default function JewelryBoxPage() {
  const [skin, setSkin] = useState<SkinType>('glass');
  const [layout, setLayout] = useState<LayoutMode>('sphere');
  const [selectedNail, setSelectedNail] = useState<NailItem | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const config = SKIN_CONFIGS[skin];

  const handleSkinChange = useCallback((newSkin: SkinType) => {
    setSkin(newSkin);
    setToastVisible(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastVisible(false), 2200);
  }, []);

  const handleLayoutChange = useCallback(() => {
    setLayout((prev) => {
      const idx = LAYOUT_MODES.indexOf(prev);
      return LAYOUT_MODES[(idx + 1) % LAYOUT_MODES.length];
    });
  }, []);

  return (
    <div
      className={styles.page}
      style={{
        background: config.bgGradient,
        '--jb-bg': config.bgColor,
        '--jb-accent': config.accentColor,
      } as React.CSSProperties}
    >
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.title}>JEWELRY BOX</div>
        <div className={styles.subtitle}>YOUR NAIL COLLECTION</div>
      </header>

      {/* Top controls */}
      <div className={styles.controlsRow}>
        <LayoutModeSelector mode={layout} onClick={handleLayoutChange} />
        <span className={styles.counter}>{SAMPLE_NAILS.length} / 30</span>
      </div>

      {/* Scrollable nail stage */}
      <main className={styles.stageArea}>
        <JewelryBoxStage
          nails={SAMPLE_NAILS}
          layout={layout}
          onSelect={setSelectedNail}
        />
      </main>

      {/* Bottom: skin toast + selector */}
      <div className={styles.bottomArea}>
        <div className={`${styles.skinToast} ${toastVisible ? styles.skinToastVisible : ''}`}>
          <div className={styles.skinToastName}>{config.label.toUpperCase()}</div>
          <div className={styles.skinToastDesc}>{config.desc}</div>
        </div>
        <div className={styles.skinSelectorWrap}>
          <SkinSelector current={skin} onChange={handleSkinChange} />
        </div>
      </div>

      {/* Detail overlay */}
      <NailDetailPanel nail={selectedNail} onClose={() => setSelectedNail(null)} />
    </div>
  );
}
