'use client'

import {useSyncExternalStore} from 'react';

export type FormLayout = 'bottle' | 'buttons';

const STORAGE_KEY = 'formLayout';
let listeners: Array<() => void> = [];

function emitChange(): void {
	for (const listener of listeners) {
		listener();
	}
}

function subscribe(callback: () => void): () => void {
	listeners.push(callback);
	return () => {
		listeners = listeners.filter(l => l !== callback);
	};
}

function getSnapshot(): FormLayout {
	return localStorage.getItem(STORAGE_KEY) === 'bottle' ? 'bottle' : 'buttons';
}

function getServerSnapshot(): FormLayout {
	return 'buttons';
}

export function setFormLayout(layout: FormLayout): void {
	if (layout === 'buttons') {
		localStorage.removeItem(STORAGE_KEY);
	} else {
		localStorage.setItem(STORAGE_KEY, layout);
	}
	emitChange();
}

export function useFormLayout(): {layout: FormLayout; setFormLayout: (layout: FormLayout) => void} {
	const layout = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
	return {layout, setFormLayout};
}
