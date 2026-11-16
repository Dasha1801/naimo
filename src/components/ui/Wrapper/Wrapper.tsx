import { type CSSProperties, type ReactNode } from 'react';

type FlexDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse';
type JustifyContent =
  | 'flex-start'
  | 'flex-end'
  | 'center'
  | 'space-between'
  | 'space-around'
  | 'space-evenly';
type AlignItems = 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
type Gap = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface WrapperProps {
  children: ReactNode;
  direction?: FlexDirection;
  justify?: JustifyContent;
  align?: AlignItems;
  gap?: Gap;
  wrap?: boolean;
  className?: string;
  style?: CSSProperties;
}

const gapMap: Record<Gap, string> = {
  xs: 'var(--spacing-xs)',
  sm: 'var(--spacing-sm)',
  md: 'var(--spacing-md)',
  lg: 'var(--spacing-lg)',
  xl: 'var(--spacing-xl)',
  '2xl': 'var(--spacing-2xl)',
};

export function Wrapper({
  children,
  direction = 'row',
  justify = 'flex-start',
  align = 'stretch',
  gap,
  wrap = false,
  className,
  style,
}: WrapperProps) {
  return (
    <div
      className={`${className ?? ''}`}
      style={{
        display: 'flex',
        flexDirection: direction,
        justifyContent: justify,
        alignItems: align,
        flexWrap: wrap ? 'wrap' : 'nowrap',
        ...(gap ? { gap: gapMap[gap] } : {}),
        ...style,
      }}
    >
      {children}
    </div>
  );
}
