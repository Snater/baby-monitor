'use client'

import {ChartDataProvider} from '@/components/ChartDataContext';
import {type PropsWithChildren} from 'react';
import {IsOnlineProvider} from '@/components/IsOnlineContext';
import {IdProvider} from '@/components/IdContext';

type Props = PropsWithChildren<{
	idProvider: {id: string}
}>

export default function ContextProviders({children, idProvider}: Props) {
	return (
		<IsOnlineProvider>
			<IdProvider {...idProvider}>
				<ChartDataProvider>
					{children}
				</ChartDataProvider>
			</IdProvider>
		</IsOnlineProvider>
	);
}
