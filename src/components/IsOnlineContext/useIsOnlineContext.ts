import IdContext, {type IsOnlineContextType} from './IsOnlineContext';
import {use} from 'react';

export default function useIsOnlineContext(): IsOnlineContextType {
	const context = use(IdContext);

	if (!context) {
		throw new Error('useIsOnlineContext must be used within an IsOnlineContext');
	}

	return context;
}
