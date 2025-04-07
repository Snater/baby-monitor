import {PropsWithChildren, useEffect, useState} from 'react';
import IsOnlineContext from './IsOnlineContext';
import {onlineManager} from '@tanstack/react-query';

type Props = PropsWithChildren

export default function IsOnlineProvider({children}: Props) {
	const [isOnline, setIsOnline] = useState(true);

	useEffect(() => {
		function updateOnlineState(isOnline: boolean) {
			setIsOnline(isOnline);
		}

		const unsubscribe = onlineManager.subscribe(updateOnlineState);

		return () => {
			unsubscribe();
		}
	}, []);

	return (
		<IsOnlineContext.Provider value={{isOnline}}>
			{children}
		</IsOnlineContext.Provider>
	);
}
