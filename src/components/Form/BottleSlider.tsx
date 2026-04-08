import {
	type KeyboardEvent,
	type PointerEvent,
	type ReactNode,
	useCallback,
	useRef,
} from 'react';
import {useTranslations} from 'next-intl';

const DEFAULT_MAX_AMOUNT = 240;

// Value applied as the bottle body's transform attribute.
const BODY_TRANSFORM = 'matrix(0.949307,0,0,1.01048,-774.182,-530.833)';

// BODY is the area available for sliding.
// All x/y values are in viewBox units (viewBox="0 0 160 370"), derived by applying the body
// group's matrix transform (BODY_TRANSFORM) to the inner bottle path's key coordinates.
const BODY_TOP = 165;
const BODY_BOTTOM = 357;
const BODY_HEIGHT = BODY_BOTTOM - BODY_TOP;
const VIEW_BOX_HEIGHT = 370;

// Bottom of the fill, naturally >= BODY_BOTTOM
const FILL_BOTTOM = 375;

// Horizontal centre of the bottle body
const BODY_CENTER_X = 80;

const SNAP = 10;
const MAX_AMOUNT = parseInt(process.env.NEXT_PUBLIC_BOTTLE_MAX ?? '', 10) || DEFAULT_MAX_AMOUNT;

// Inner bottle interior outline pre-computed in viewBox coordinates (transform already applied),
// used directly without any transform inside <clipPath> to avoid coordinate system ambiguity.
const INNER_PATH_VIEWBOX =
	'M145.14,188.39' +
	'C145.14,168.94 132.94,152.25 115.78,145.64' +
	'L115.78,131.79' +
	'L43.79,131.79' +
	'C43.84,136.79 43.84,139.79 43.84,145.63' +
	'C26.87,152.22 14.67,168.93 14.67,188.39' +
	'C14.67,188.39 17.66,226.99 17.66,246.49' +
	'C17.66,267.18 14.67,312.50 14.67,312.50' +
	'C14.67,337.76 35.15,358.26 60.40,358.26' +
	'L99.61,358.26' +
	'C124.87,358.26 145.14,337.76 145.14,312.50' +
	'C145.14,312.50 142.25,267.18 142.25,246.49' +
	'C142.25,226.99 145.14,188.39 145.14,188.39' +
	'Z';

const CLIP_ID = "BOTTLE_CLIPPING_PATH";

const TICK_WIDTH = {MINOR: 20, MAJOR: 30} as const;
// Labels are right-aligned, but SVG cannot perform measurements during runtime, therefore:
// right edge = tick end + gap + estimated max label width
const LABEL_X = BODY_CENTER_X + (TICK_WIDTH.MAJOR / 2) + 3 + 20;

/**
 * Maps an amount to a viewBox y coordinate.
 */
function amountToY(amount: number): number {
	return BODY_BOTTOM - (amount / MAX_AMOUNT) * BODY_HEIGHT;
}

/**
 * Maps the pointer position to a valid amount, considering SNAP.
 * Uses getBoundingClientRect() for reliable cross-browser coordinate mapping.
 */
function pointerToAmount(svgEl: SVGSVGElement, clientY: number): number {
	const rect = svgEl.getBoundingClientRect();
	const svgY = ((clientY - rect.top) / rect.height) * VIEW_BOX_HEIGHT;
	const raw = ((BODY_BOTTOM - svgY) / BODY_HEIGHT) * MAX_AMOUNT;
	return Math.max(0, Math.min(MAX_AMOUNT, Math.round(raw / SNAP) * SNAP));
}

type Props = {
	amount: number;
	disabled?: boolean;
	onChange: (amount: number) => void;
};

export default function BottleSlider({amount, disabled, onChange}: Props) {
	const t = useTranslations('form');
	const isDragging = useRef(false);

	const handlePointerDown = useCallback((event: PointerEvent<SVGSVGElement>) => {
		if (disabled) {
			return;
		}
		event.currentTarget.setPointerCapture(event.pointerId);
		isDragging.current = true;
		onChange(pointerToAmount(event.currentTarget, event.clientY));
	}, [disabled, onChange]);

	const handlePointerMove = useCallback((event: PointerEvent<SVGSVGElement>) => {
		if (!isDragging.current || disabled) {
			return;
		}
		onChange(pointerToAmount(event.currentTarget, event.clientY));
	}, [disabled, onChange]);

	const handlePointerUp = useCallback(() => {
		isDragging.current = false;
	}, []);

	const handleKeyDown = useCallback((event: KeyboardEvent<SVGSVGElement>) => {
		if (disabled) {
			return;
		}

		let next = amount;

		if (event.key === 'ArrowUp' || event.key === 'ArrowRight') {
			next = Math.min(MAX_AMOUNT, amount + SNAP);
		} else if (event.key === 'ArrowDown' || event.key === 'ArrowLeft') {
			next = Math.max(0, amount - SNAP);
		} else if (event.key === 'PageUp') {
			next = Math.min(MAX_AMOUNT, amount + 50);
		} else if (event.key === 'PageDown') {
			next = Math.max(0, amount - 50);
		} else if (event.key === 'Home') {
			next = 0;
		} else if (event.key === 'End') {
			next = MAX_AMOUNT;
		} else {
			return;
		}

		event.preventDefault();
		onChange(next);
	}, [amount, disabled, onChange]);

	// Clip rect starts at the fill level and extends to the base of the bottle.
	const fillY = Math.max(BODY_TOP, amountToY(amount));
	const fillHeight = FILL_BOTTOM - fillY;

	const ticks: ReactNode[] = [];
	for (let tickAmount = SNAP * 2; tickAmount <= MAX_AMOUNT; tickAmount += SNAP) {
		const y = amountToY(tickAmount);
		const isMajor = tickAmount % 20 === 0;
		const halfWidth = (isMajor ? TICK_WIDTH.MAJOR : TICK_WIDTH.MINOR) / 2;

		ticks.push(
			<line
				key={`tick-${tickAmount}`}
				x1={BODY_CENTER_X - halfWidth}
				y1={y}
				x2={BODY_CENTER_X + halfWidth}
				y2={y}
				strokeWidth={isMajor ? 1.5 : 1}
				style={{stroke: 'var(--color-bottle-ticks)'}}
			/>
		);
		if (isMajor && tickAmount > 0) {
			ticks.push(
				<text
					key={`label-${tickAmount}`}
					x={LABEL_X}
					y={y}
					aria-hidden="true"
					dominantBaseline="middle"
					fontSize={10}
					fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
					fontWeight="bold"
					style={{fill: 'var(--color-bottle-ticks)'}}
					textAnchor="end"
				>
					{tickAmount}
				</text>
			);
		}
	}

	return (
		<div className="flex flex-col gap-2 items-center w-fit">
			<svg
				aria-disabled={disabled}
				aria-valuemin={0}
				aria-valuemax={MAX_AMOUNT}
				aria-valuenow={amount}
				aria-valuetext={t('amount', {amount})}
				className={`h-[480px] w-auto outline-none select-none touch-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${disabled ? 'opacity-50' : 'cursor-ns-resize'}`}
				onKeyDown={handleKeyDown}
				onPointerCancel={handlePointerUp}
				onPointerDown={handlePointerDown}
				onPointerMove={handlePointerMove}
				onPointerUp={handlePointerUp}
				role="slider"
				strokeLinecap="round"
				strokeMiterlimit={1.5}
				tabIndex={disabled ? -1 : 0}
				viewBox="0 0 160 370"
			>
				<defs>
					<clipPath id={CLIP_ID}>
						<rect x={0} y={fillY} width={160} height={fillHeight}/>
					</clipPath>
					<linearGradient id={`${CLIP_ID}-interior`} x1="0" y1="0" x2="1" y2="1">
						<stop offset="0%" style={{stopColor: 'var(--color-bottle-interior-from)'}}/>
						<stop offset="100%" style={{stopColor: 'var(--color-bottle-interior-to)'}}/>
					</linearGradient>
				</defs>

				<path d={INNER_PATH_VIEWBOX} fill={`url(#${CLIP_ID}-interior)`}/>

				{/* Liquid fill */}
				{amount > 0 && (
					<path
						d={INNER_PATH_VIEWBOX}
						style={{fill: 'var(--color-bottle-liquid)'}}
						opacity={0.85}
						clipPath={`url(#${CLIP_ID})`}
					/>
				)}

				{/* Bottle body */}
				<g transform={BODY_TRANSFORM}>
					<path
						fillRule="evenodd"
						style={{fill: 'var(--color-bottle-glass)'}}
						d={
							'M979.086,712.519C979.086,712.519 975.956,750.598 975.956,769.657' +
							'C975.956,789.921 979.093,833.93 979.093,833.93' +
							'L979.117,834.259L979.117,834.589' +
							'C979.117,865.044 952.798,889.769 920.381,889.769' +
							'L879.065,889.769' +
							'C846.648,889.769 820.33,865.044 820.33,834.589' +
							'L820.33,834.259L820.353,833.93' +
							'C820.353,833.93 823.49,789.921 823.49,769.657' +
							'C823.49,750.598 820.361,712.519 820.361,712.519' +
							'L820.33,712.14L820.33,711.76' +
							'C820.33,690.735 832.874,672.439 851.31,663.128' +
							'C851.305,660.754 851.293,658.609 851.267,655.839' +
							'L851.173,645.855L948.18,645.855' +
							'L948.179,663.15' +
							'C966.592,672.468 979.117,690.751 979.117,711.76' +
							'L979.117,712.14L979.086,712.519Z' +
							'M968.583,711.76C968.583,692.482 955.732,676.001 937.646,669.473' +
							'L937.646,655.751L861.801,655.751' +
							'C861.848,660.699 861.848,663.668 861.848,669.456' +
							'C843.737,675.973 830.864,692.465 830.864,711.76' +
							'C830.864,711.76 834.024,750.345 834.024,769.657' +
							'C834.024,790.129 830.864,834.589 830.864,834.589' +
							'C830.864,859.582 852.462,879.873 879.065,879.873' +
							'L920.381,879.873' +
							'C946.984,879.873 968.583,859.582 968.583,834.589' +
							'C968.583,834.589 965.422,790.129 965.422,769.657' +
							'C965.422,750.345 968.583,711.76 968.583,711.76Z'
						}
					/>
				</g>

				{/* Right-side gloss highlight */}
				<g transform="matrix(0.732449,0,0,0.994575,-281.725,-306.891)">
					<path
						style={{fill: 'var(--color-bottle-glass)'}}
						fillOpacity={0.5}
						d="M525.022,458.638C525.661,457.839 525.732,457.828 526.953,457.598C528.563,457.294 528.6,457.474 530.065,458.057C542.421,462.981 565.432,477.659 566.709,502.227C567.345,514.474 566.347,529.075 566.066,542.466C565.866,552.041 565.779,552.038 565.902,561.613C566.257,589.125 568.261,608.671 565.968,621.918C562.751,640.507 552.108,652.413 536.995,662.574C536.044,663.213 536.003,663.256 534.713,663.256C534.69,663.256 532.453,662.577 532.449,662.568C532.13,662.01 531.503,661.496 531.503,660.891C531.503,659.729 531.807,659.775 532.86,658.908C557.764,638.414 554.795,619.803 552.795,600.225C550.842,581.102 548.607,566.11 549.902,545.651C550.941,529.245 554.669,506.262 554.106,498.084C552.871,480.151 537.215,467.368 526.447,462.01C525.236,461.408 525.097,461.426 524.726,460.383C524.408,459.487 524.384,459.436 525.022,458.638Z"
					/>
				</g>

				{/* Left-side gloss highlight */}
				<g transform="matrix(-0.459477,0,0,0.914521,286.489,-261.624)">
					<path
						style={{fill: 'var(--color-bottle-glass)'}}
						fillOpacity={0.5}
						d="M523.254,457.872C521.724,458.763 521.746,458.831 521.922,460.004C522.185,461.754 523.001,461.606 525.397,462.885C533.578,467.254 546.858,477.729 549.67,493.056C550.644,498.369 550.822,502.87 546.771,524.495C542.782,545.794 542.972,554.247 543.03,556.839C543.577,581.154 550.541,596.755 550.255,618.928C550.03,636.303 543.589,645.842 534.068,653.854C531.665,655.876 533.046,656.052 535.624,658.022C535.634,658.03 540.068,658.493 540.105,658.489C543.019,658.213 542.877,657.989 544.632,656.787C559.969,646.276 569.45,633.388 571.12,606.464C572.062,591.278 569.074,577.214 569.124,555.5C569.171,535.366 572.074,515.5 570.588,501.127C568.316,479.144 547.475,463.813 531.709,457.567C529.774,456.8 527.639,456.877 527.269,456.891C524.924,456.975 524.79,456.978 523.254,457.872Z"
					/>
				</g>

				{/* Teat */}
				<g transform="matrix(1,0,0,1,-420.068,-308.211)">
					<path
						style={{fill: 'var(--color-bottle-cap)'}}
						d="M515.9,364.956C528.288,370.771 536.874,383.361 536.874,397.94C536.874,401.117 520.557,399.325 500.46,399.325C480.362,399.325 464.045,401.117 464.045,397.94C464.045,383.361 472.631,370.771 485.019,364.956L485.019,353.36C481.034,349.394 478.566,343.905 478.566,337.844C478.566,325.761 488.376,315.951 500.46,315.951C512.543,315.951 522.353,325.761 522.353,337.844C522.353,343.905 519.885,349.394 515.9,353.36L515.9,364.956Z"
					/>
				</g>

				{/* Cap ring */}
				<g transform="matrix(1.01878,0,0,1.02577,-429.903,-326.227)">
					<path
						style={{fill: 'var(--color-bottle-cap)'}}
						d="M557.546,414.964L557.546,439.93C557.546,444.523 553.791,448.252 549.167,448.252L451.709,448.252C447.085,448.252 443.33,444.523 443.33,439.93L443.33,414.964C443.33,410.372 447.085,406.643 451.709,406.643L549.167,406.643C553.791,406.643 557.546,410.372 557.546,414.964Z"
					/>
					<path
						style={{fill: 'var(--color-bottle-glass)'}}
						d="M557.546,414.964L557.546,439.93C557.546,444.523 553.791,448.252 549.167,448.252L451.709,448.252C447.085,448.252 443.33,444.523 443.33,439.93L443.33,414.964C443.33,410.372 447.085,406.643 451.709,406.643L549.167,406.643C553.791,406.643 557.546,410.372 557.546,414.964ZM550.675,414.964C550.675,414.138 549.999,413.467 549.167,413.467L451.709,413.467C450.877,413.467 450.201,414.138 450.201,414.964L450.201,439.93C450.201,440.757 450.877,441.428 451.709,441.428L549.167,441.428C549.999,441.428 550.675,440.757 550.675,439.93L550.675,414.964Z"
					/>
				</g>

				{/* Cap ring grip lines */}
				<g transform="matrix(1,0,0,1,-420.068,-315.211)">
					<path d="M464.045,409.916L464.045,434.043" fill="none" style={{stroke: 'var(--color-bottle-glass)'}} strokeWidth={5}/>
				</g>
				<g transform="matrix(1,0,0,0.875662,-405.413,-264.242)">
					<path d="M464.045,409.916L464.045,434.043" fill="none" style={{stroke: 'var(--color-bottle-glass)'}} strokeWidth={5.32}/>
				</g>
				<g transform="matrix(1,0,0,1.15714,-346.613,-379.626)">
					<path d="M464.045,409.916L464.045,434.043" fill="none" style={{stroke: 'var(--color-bottle-glass)'}} strokeWidth={4.62}/>
				</g>

				{/* Graduation marks */}
				{ticks}
			</svg>

			<p
				className="text-sm tabular-nums"
				aria-live="polite"
				aria-atomic="true"
			>
				{t('amount', {amount})}
			</p>
		</div>
	);
}