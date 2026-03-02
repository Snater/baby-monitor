'use client'

import type {Event} from '@/types';
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
function applyThemeColors(spec: Spec) {
	if (spec.scales) {
		const chartColor = getComputedStyle(document.documentElement)
			.getPropertyValue('--color-chart-scale').trim();

		const colorScaleIndex = spec.scales.findIndex(scale => scale.name === 'color');

		if (colorScaleIndex !== undefined) {
			(spec.scales[colorScaleIndex] as OrdinalScale).range = [chartColor];
		}
	}

	const axesColor = getComputedStyle(document.documentElement)
		.getPropertyValue('--color-chart-axes').trim();

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

export default function Chart() {
	const t = useTranslations('chart');
	const {chartData, status} = useChartDataContext();
	const pendingEvents = useStore(state => state.pendingEvents);
	const pendingDelete = useStore(state => state.pendingDelete);

	const spec = useMemo<VisualizationSpec | undefined>(() => {
		if (!chartData || typeof document === 'undefined') {
			return undefined;
		}

		const base = applyThemeColors(chartSpec as Spec);
		const events = [
			...chartData.events.filter(event => !pendingDelete.includes(event.id)),
			...pendingEvents,
		];

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

		return {...base, data: updatedData};
	}, [chartData, pendingDelete, pendingEvents]);

	const dataEvents = spec
		? (spec.data as ValuesData[]).filter(data => data.name === 'eventsSource')
		: undefined;

	const chartStatus = status === 'pending' || spec === undefined
		? 'pending'
		: dataEvents && (dataEvents[0].values as Event[]).length > 0
			? 'has data'
			: 'no data';

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
					chartStatus === 'has data' && (
						<VegaEmbed
							className="h-full w-full"
							key={chartData?.selectedDate}
							options={{
									actions: false,
							}}
							spec={spec as VisualizationSpec}
						/>
					)
				}
			</div>
		</div>
	);
}
