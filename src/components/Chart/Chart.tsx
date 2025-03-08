'use client'

import dynamic from 'next/dynamic';
import chartSpec from './spec.json';
import {VisualizationSpec} from 'react-vega';
import {ValuesData} from 'vega';
import {useCallback, useEffect, useState} from 'react';

// see https://github.com/vercel/next.js/issues/73323
const Vega = dynamic(() => import('react-vega').then((m) => m.Vega), {
	ssr: false,
});

type Event = {
	amount: number
	time: number
}

export default function Chart() {
	const [spec, setSpec] = useState<VisualizationSpec>();

	const fetchValues = async (): Promise<Event[]> => {
		const response = await fetch('/api');
		return response.json();
	}

	const updateSpec = useCallback((values: Event[]) => {
		setSpec((prevSpec?: VisualizationSpec) => {
			prevSpec = prevSpec ?? chartSpec as VisualizationSpec;

			const prevData = prevSpec.data as ValuesData[];

			const updatedData = prevData.map(prevDataItem => {
				if (prevDataItem.name === 'events') {
					return {...prevDataItem, values};
				}
				return prevDataItem;
			});

			return {
				...prevSpec,
				data: updatedData,
			};
		});
	}, []);

	useEffect(() => {
		if (!spec) {
			fetchValues().then(events => {
				updateSpec(events);
			});
		}
	}, [spec, updateSpec]);

	if (!spec) {
		return null;
	}

	return (
		<Vega spec={spec as VisualizationSpec}/>
	);
}
