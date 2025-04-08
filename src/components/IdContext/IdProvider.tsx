import IdContext from './IdContext';
import {PropsWithChildren} from 'react';
import humanId from 'human-id';

type Props = PropsWithChildren<{
	id?: string
}>

export default function IdProvider({children, id}: Props) {

	const isTemporary = !id;

	if (!id) {
		id = humanId({
			separator: '-',
			capitalize: false,
		});
	}

	return (
		<IdContext.Provider value={{id, isTemporary}}>
			{children}
		</IdContext.Provider>
	);
}
