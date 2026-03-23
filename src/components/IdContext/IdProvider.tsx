'use client'

import IdContext from './IdContext';
import {type PropsWithChildren, useState} from 'react';
import humanId from 'human-id';

type Props = PropsWithChildren<{
	id?: string
}>

export default function IdProvider({children, id: providedId}: Props) {
	const isTemporary = !providedId;
	const [id] = useState(() => providedId ?? humanId({ separator: '-', capitalize: false }));

	return (
		<IdContext.Provider value={{id, isTemporary}}>
			{children}
		</IdContext.Provider>
	);
}