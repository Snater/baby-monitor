'use client'

import {useSyncExternalStore} from 'react';

type Store<T> = {
	use: () => {value: T; set: (value: T) => void};
	set: (value: T) => void;
};

export function createLocalStorageStore<T>(
	key: string,
	defaultValue: T,
	parse: (raw: string) => T | undefined,
	stringify: (value: T) => string = String,
): Store<T> {
	let listeners: Array<() => void> = [];

	function emitChange(): void {
		for (const listener of listeners) listener();
	}

	function subscribe(callback: () => void): () => void {
		listeners.push(callback);
		return () => {
			listeners = listeners.filter(l => l !== callback);
		};
	}

	function getSnapshot(): T {
		const raw = localStorage.getItem(key);
		return raw !== null ? (parse(raw) ?? defaultValue) : defaultValue;
	}

	function set(value: T): void {
		if (value === defaultValue) {
			localStorage.removeItem(key);
		} else {
			localStorage.setItem(key, stringify(value));
		}
		emitChange();
	}

	function use(): {value: T; set: (value: T) => void} {
		const value = useSyncExternalStore(subscribe, getSnapshot, () => defaultValue);
		return {value, set};
	}

	return {use, set};
}