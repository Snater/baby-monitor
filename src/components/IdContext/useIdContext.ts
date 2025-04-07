import IdContext, {type IdContextType} from './IdContext';
import {use} from 'react';

export default function useIdContext(): IdContextType {
	const context = use(IdContext);

	if (!context) {
		throw new Error('useIdContext must be used within an IdProvider');
	}

	return context;
}
