import {createContext} from 'react';

export interface IdContextType {
	id: string
	/**
	 * Whether the id is not yet committed to the database. (More specifically, no event has been
	 * added for that id to the database yet.)
	 */
	isTemporary: boolean
}

const IdContext = createContext<IdContextType | null>(null);

export default IdContext;
