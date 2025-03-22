'use client'

import {useCallback, useLayoutEffect, useState} from 'react';
import type {Event} from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';
import {ValuesData} from 'vega';
import {VisualizationSpec} from 'react-vega';
import chartSpec from './spec.json';
import dynamic from 'next/dynamic';
import useChartDataContext from '@/components/ChartDataContext';
import {useTranslations} from 'next-intl';

// see https://github.com/vercel/next.js/issues/73323
const Vega = dynamic(() => import('react-vega').then((m) => m.Vega), {
	ssr: false,
});

export default function Chart() {
	const [spec, setSpec] = useState<VisualizationSpec>();
	const {chartData, status} = useChartDataContext();
	const t = useTranslations('chart');

	const chartStatus = status === 'pending'
		? 'pending'
		: spec?.data && ((spec.data as ValuesData[])[0].values as Event[]).length > 0
			? 'has data'
			: 'no data';

	const updateSpec = useCallback((values: Event[]) => {
		setSpec((prevSpec?: VisualizationSpec) => {
			prevSpec = prevSpec ?? chartSpec as VisualizationSpec;

			const prevData = prevSpec.data as ValuesData[];

			const updatedData = prevData.map(prevDataItem => {
				if (prevDataItem.name === 'events') {
					return {
						...prevDataItem,
						values: values.map(value => ({...value, time: new Date(value.time).getTime()})),
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
						<Vega actions={false} className="h-full w-full" spec={spec as VisualizationSpec}/>
					)
				}
			</div>
		</div>
	);
}
