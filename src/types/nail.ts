export type NailShape = 'almond' | 'oval' | 'square' | 'coffin' | 'stiletto' | 'round';
export type NailTexture = 'plain' | 'marble' | 'glitter' | 'gradient' | 'floral' | 'custom';
export type CollectionType = 'real' | 'ai_generated' | 'uploaded';
export type LayoutMode = 'sphere' | 'grid' | 'spiral';
export type SkinType = 'glass' | 'snow' | 'velvet' | 'showcase';

export interface NailItem {
  id: string;
  title: string;
  imageUrl?: string;
  color: string;
  gradient: string[];
  texture: NailTexture;
  shape: NailShape;
  parts: string[];
  createdAt: string;
  memo?: string;
  favorite: boolean;
  collectionType: CollectionType;
  sparkle?: boolean;
}

export interface SkinConfig {
  label: string;
  bgColor: string;
  bgGradient: string;
  accentColor: string;
  desc: string;
}

export const SKIN_CONFIGS: Record<SkinType, SkinConfig> = {
  glass: {
    label: 'Glass',
    bgColor: '#050308',
    bgGradient: 'radial-gradient(ellipse at 50% 30%, #1a0835 0%, #050308 65%)',
    accentColor: '#ffd0e8',
    desc: 'Pure crystal display',
  },
  snow: {
    label: 'Snow Globe',
    bgColor: '#020812',
    bgGradient: 'radial-gradient(ellipse at 50% 20%, #0a1f40 0%, #020812 70%)',
    accentColor: '#b8d0f0',
    desc: 'Winter memories floating',
  },
  velvet: {
    label: 'Velvet',
    bgColor: '#0f0308',
    bgGradient: 'radial-gradient(ellipse at 50% 50%, #2a0820 0%, #0f0308 70%)',
    accentColor: '#f8bbd0',
    desc: 'Luxurious heritage',
  },
  showcase: {
    label: 'Showcase',
    bgColor: '#08060f',
    bgGradient: 'radial-gradient(ellipse at 50% 20%, #18102e 0%, #08060f 70%)',
    accentColor: '#c9a84c',
    desc: 'Boutique collection',
  },
};

export const LAYOUT_MODES: LayoutMode[] = ['sphere', 'grid', 'spiral'];
export const LAYOUT_LABELS: Record<LayoutMode, string> = {
  sphere: 'SPHERE',
  grid: 'GRID',
  spiral: 'SPIRAL',
};
