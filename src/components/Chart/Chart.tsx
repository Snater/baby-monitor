'use client'

import type {ChartData, Event} from '@/types';
import type {Color, OrdinalScale, Spec, ValuesData} from 'vega';
import {useCallback, useLayoutEffect, useState} from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';
import {VisualizationSpec} from 'react-vega';
import chartSpec from './spec.json';
import dynamic from 'next/dynamic';
import useChartDataContext from '@/components/ChartDataContext';
import {useTranslations} from 'next-intl';

// see https://github.com/vercel/next.js/issues/73323
const Vega = dynamic(() => import('react-vega').then((m) => m.Vega), {
	ssr: false,
});

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
	const [spec, setSpec] = useState<VisualizationSpec>();
	const {chartData, status} = useChartDataContext();
	const t = useTranslations('chart');

	const dataEvents = spec
		? (spec.data as ValuesData[]).filter(data => data.name === 'eventsSource')
		: undefined;

	const chartStatus = status === 'pending'
		? 'pending'
		: dataEvents && (dataEvents[0].values as Event[]).length > 0
			? 'has data'
			: 'no data';

	const updateSpec = useCallback((chartData: ChartData) => {
		setSpec((prevSpec?: VisualizationSpec) => {
			if (!prevSpec) {
				prevSpec = applyThemeColors(chartSpec as Spec);
			}

			const prevData = prevSpec.data as ValuesData[];

			const updatedData = prevData.map(prevDataItem => {

				if (prevDataItem.name === 'selectedDay') {
					return {
						...prevDataItem,
						values: [{day: chartData.selectedDate}],
					};
				}

				if (prevDataItem.name === 'eventsSource') {
					return {
						...prevDataItem,
						values: chartData.events.map(value => ({...value, time: new Date(value.time).getTime()})),
					};
				}

				return prevDataItem;
			});

			return {
				...prevSpec,
				data: updatedData,
			};
		});
	}, []);

	useLayoutEffect(() => {
		if (chartData) {
			updateSpec(chartData);
		}
	}, [chartData, updateSpec]);

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
						<Vega
							actions={false}
							className="h-full w-full"
							key={chartData?.selectedDate}
							spec={spec as VisualizationSpec}
						/>
					)
				}
			</div>
		</div>
	);
}
