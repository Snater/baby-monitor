'use client'

import type {Color, OrdinalScale, Spec, ValuesData} from 'vega';
import {useMemo} from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';
import {VegaEmbed} from 'react-vega';
import type {VisualizationSpec} from "vega-embed";
import chartSpec from './spec.json';
import useChartDataContext from '@/components/ChartDataContext';
import useStore from '@/store';
import {useTranslations} from 'next-intl';

/**
 * Since it's not possible to provide CSS vars as arguments to the spec, nor style the chart per CSS
 * classes, this function applies the chart colors defined on :root to the chart spec.
 */
function applyThemeColors(spec: Spec): Spec {
	const styles = getComputedStyle(document.documentElement);
	const chartColor = styles.getPropertyValue('--color-chart-scale').trim();
	const axesColor = styles.getPropertyValue('--color-chart-axes').trim();

	if (spec.scales) {
		const colorScaleIndex = spec.scales.findIndex(scale => scale.name === 'color');

		if (colorScaleIndex !== -1) {
			(spec.scales[colorScaleIndex] as OrdinalScale).range = [chartColor];
		}
	}

	spec.axes?.forEach(axis => {
		axis.domainColor = axesColor;
		axis.labelColor = axesColor;
		axis.tickColor = axesColor;
	});

	spec.marks?.forEach(mark => {
		if (mark.type === 'rule' && mark.encode?.enter?.stroke !== undefined) {
			(mark.encode.enter.stroke as {value: Color}).value = axesColor;
		}
	});

	return spec;
}

const vegaOptions = {actions: false};

export default function Chart() {
	const t = useTranslations('chart');
	const {chartData, status} = useChartDataContext();
	const pendingEvents = useStore(state => state.pendingEvents);
	const pendingDelete = useStore(state => state.pendingDelete);

	const events = useMemo(() => {
		if (!chartData) {
			return [];
		}

		return [
			...chartData.events.filter(event => !pendingDelete.includes(event.id)),
			...pendingEvents,
		];
	}, [chartData, pendingDelete, pendingEvents]);

	const spec = useMemo(() => {
		if (!chartData || typeof document === 'undefined') return undefined;

		const base = applyThemeColors(structuredClone(chartSpec) as Spec);

		const updatedData = (base.data as ValuesData[]).map(item => {
			if (item.name === 'selectedDay') {
				return {...item, values: [{day: chartData.selectedDate}]};
			}
			if (item.name === 'eventsSource') {
				return {
					...item,
					values: events.map(value => ({...value, time: new Date(value.time).getTime()}))};
			}
			return item;
		});

		return {...base, data: updatedData} as VisualizationSpec;
	}, [chartData, events]);

	const chartStatus = status === 'pending'
		? 'pending'
		: events.length === 0
			? 'no data'
			: spec === undefined
				? 'pending'
				: 'has data';

	return (
		<div className="layout-container">
			<div className="flex h-[200px] items-center justify-center w-full">
				{chartStatus === 'pending' ? <LoadingSpinner size="large"/> : null}
				{
					chartStatus === 'no data' && (
						<div className="text-center">
							{t.rich('placeholder', {br: () => <br />})}
						</div>
					)
				}
				{
					spec && chartStatus === 'has data' && (
						<VegaEmbed
							className="h-full w-full"
							key={chartData?.selectedDate}
							options={vegaOptions}
							spec={spec}
						/>
					)
				}
			</div>
		</div>
	);
}
