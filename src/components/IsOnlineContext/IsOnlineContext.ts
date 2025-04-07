import {createContext} from 'react';

export interface IsOnlineContextType {
	isOnline: boolean
}

const IsOnlineContext = createContext<IsOnlineContextType | null>(null);

export default IsOnlineContext;
