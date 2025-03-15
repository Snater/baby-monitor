'use client'

import {ChartDataProvider} from '@/components/ChartDataContext';
import {type PropsWithChildren} from 'react';
import {IdProvider} from '@/components/IdContext';

type Props = PropsWithChildren<{
	idProvider: {id: string}
}>

export default function ContextProviders({children, idProvider}: Props) {
	return (
		<IdProvider {...idProvider}>
			<ChartDataProvider>
				{children}
			</ChartDataProvider>
		</IdProvider>
	);
}
