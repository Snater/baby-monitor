const FALLBACK_MAX_ML = 240;

export const MAX_ML = parseInt(process.env.NEXT_PUBLIC_BOTTLE_MAX ?? '', 10) || FALLBACK_MAX_ML;

// The interval for displaying ticks and snapping input to per unit
export enum STEP {
	ml = 10,
	oz = 0.5,
}
