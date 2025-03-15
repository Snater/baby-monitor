import IdContext from './IdContext';
import {PropsWithChildren} from 'react';

type Props = PropsWithChildren<{
	id: string
}>

export default function IdProvider({children, id}: Props) {
	return (
		<IdContext.Provider value={{id}}>
			{children}
		</IdContext.Provider>
	);
}
