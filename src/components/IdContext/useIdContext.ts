import IdContext, {type IdContextType} from './IdContext';
import {useContext} from 'react';

export default function useIdContext(): IdContextType {
	const context = useContext(IdContext);

	if (!context) {
		throw new Error('useIdContext must be used within a IdProvider');
	}

	return context;
}
