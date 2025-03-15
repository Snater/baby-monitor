import {createContext} from 'react';

export interface IdContextType {
	id: string
}

const IdContext = createContext<IdContextType | null>(null);

export default IdContext;
