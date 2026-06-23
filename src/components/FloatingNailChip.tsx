import type { CSSProperties } from 'react'

type FloatingNailChipShape = 'oval' | 'almond' | 'square'

interface FloatingNailChipPosition {
  top?: string
  right?: string
  bottom?: string
  left?: string
}

interface FloatingNailChipProps {
  variant?: 'landing' | 'empty'
  color?: string
  shape?: FloatingNailChipShape
  position?: FloatingNailChipPosition
  width?: string
  rotation?: string
  scaleY?: string
  duration?: string
  className?: string
  showHighlight?: boolean
}

const FloatingNailChip = ({
  variant = 'landing',
  color,
  shape = 'oval',
  position,
  width,
  rotation,
  scaleY,
  duration,
  className = '',
  showHighlight = variant === 'landing',
}: FloatingNailChipProps) => {
  const style = {
    ...(color ? { '--tone': color } : {}),
    ...(width ? { '--w': width } : {}),
    ...(rotation ? { '--r': rotation } : {}),
    ...(scaleY ? { '--sy': scaleY } : {}),
    ...(duration ? { '--d': duration } : {}),
    ...position,
  } as CSSProperties
  const baseClassName = variant === 'empty' ? 'nail-empty-chip' : 'landing-charm'
  const classes = [baseClassName, `${baseClassName}--${shape}`, className].filter(Boolean).join(' ')

  return (
    <span className={classes} style={style} aria-hidden="true">
      {showHighlight ? <span className={`${baseClassName}-face`} /> : null}
    </span>
  )
}

export default FloatingNailChip
