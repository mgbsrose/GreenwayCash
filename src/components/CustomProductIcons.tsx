import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

// All icons share Lucide's 24×24 viewBox and currentColor stroke so that
// the existing product-tile CSS controls their appearance and dimensions.
function FoodIcon({
  size = 24,
  children,
  ...props
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

/** A single grilled sausage with rounded ends and diagonal grill marks. */
export function BratwurstIcon(props: IconProps) {
  return (
    <FoodIcon {...props}>
      <path d="M3.5 15.5c-1.8-2-1.5-4.4.3-5.9L12.7 3c1.7-1.3 3.6-1.3 5 .2l3.1 3.5c1.4 1.6 1.1 3.6-.5 5l-8.8 7.2c-2 1.7-4.3 1.7-6.1-.1Z" />
      <path d="m9.3 7.4 2.4 2.8m2-5.9 2.5 2.9m-12 5.7 2.5 2.7m2.1-5.7 2.5 2.9" />
    </FoodIcon>
  );
}

/** Sliced sausage arranged in a shallow currywurst bowl. */
export function CurrywurstIcon(props: IconProps) {
  return (
    <FoodIcon {...props}>
      <path d="M2.5 13.5h19l-1.6 4.2a4 4 0 0 1-3.8 2.8H7.9a4 4 0 0 1-3.8-2.8Z" />
      <path d="M5 13.5c0-2.8 3.3-4.8 7-4.8s7 2 7 4.8" />
      <path d="m7.6 10.2 1.5 2.6m2-3.8 1 3.6m2.4-3.1-.7 3.3m3.2-2-1.5 2" />
      <path d="M7 7.2c.7-.9 1.8-1.3 2.8-1.1m4.4-.5c1.2-.2 2.4.3 3 1.3" />
    </FoodIcon>
  );
}

/** French fries standing in a paper tray. */
export function FriesIcon(props: IconProps) {
  return (
    <FoodIcon {...props}>
      <path d="m5 12-1-9 3-.3 1.5 8.6M9 11 8.8 2h3l.4 8.8M14 11l1.1-8.7 3 .5L17 12M18 11l2-6 2 .8-2 8" />
      <path d="M3 12h18l-2.2 8.5H5.2Z" />
      <path d="m8.7 13.2.8 5.4m5.8-5.4-.8 5.4M5 20.5h14" />
    </FoodIcon>
  );
}

/** Currywurst and fries combined on one tray (Mantaplatte). */
export function MantaplatteIcon(props: IconProps) {
  return (
    <FoodIcon {...props}>
      <path d="M2 14.5h20l-1.6 4.6a3 3 0 0 1-2.8 2H6.4a3 3 0 0 1-2.8-2Z" />
      <path d="m13 12.8-.3-9 2.5-.2.8 9m1.4-.1 1.1-8 2.4.5-1.3 8" />
      <path d="M4.1 11.8c1.3-2.7 5.1-4.8 8.3-2.2.6.5 1 1.2 1 2" />
      <path d="m6.3 9.9 1.4 2.2m1-3.2 1.6 2.6m.4-1.6 1.1 2" />
      <path d="M10 15.9h4" />
    </FoodIcon>
  );
}

/** A capped glass beverage bottle, used for alcohol-free beer and radler. */
export function BottleIcon(props: IconProps) {
  return (
    <FoodIcon {...props}>
      <path d="M10 2h4v3.6c0 1 .4 1.7 1.3 2.4.8.7 1.2 1.6 1.2 2.9v8.5a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2v-8.5c0-1.3.4-2.2 1.2-2.9.9-.7 1.3-1.4 1.3-2.4Z" />
      <path d="M10 5.5h4M8 12.4h8v5.3H8zM11 15h2" />
    </FoodIcon>
  );
}
