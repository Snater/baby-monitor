'use client'

import {useLayoutEffect, useSyncExternalStore} from 'react';

export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'theme';
let listeners: Array<() => void> = [];
let initialized = false;

function emitChange(): void {
	for (const listener of listeners) {
		listener();
	}
}

function applyThemeToDOM(theme: Theme): void {
	document.documentElement.classList.toggle('dark', theme === 'dark');
	document.documentElement.classList.toggle('light', theme === 'light');
	const meta = document.querySelector('meta[name="color-scheme"]');
	if (meta) {
		meta.setAttribute('content', `only ${theme}`);
	}
}

function onMediaChange(): void {
	if (!localStorage.getItem(STORAGE_KEY)) {
		const theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
		applyThemeToDOM(theme);
		emitChange();
	}
}

function onStorageChange(event: StorageEvent): void {
	if (event.key === STORAGE_KEY || event.key === null) {
		const stored = localStorage.getItem(STORAGE_KEY);
		const theme: Theme = stored === 'dark' || stored === 'light'
			? stored
			: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
		applyThemeToDOM(theme);
		emitChange();
	}
}

function initialize(): void {
	if (initialized) {
		return;
	}

	initialized = true;

	window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', onMediaChange);
	window.addEventListener('storage', onStorageChange);
}

function subscribe(callback: () => void): () => void {
	initialize();

	listeners.push(callback);

	return () => {
		listeners = listeners.filter(listener => listener !== callback);
	};
}

function getSnapshot(): Theme {
	const stored = localStorage.getItem(STORAGE_KEY);

	if (stored === 'dark' || stored === 'light') {
		return stored;
	}

	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getServerSnapshot(): Theme {
	return 'light';
}

export function setTheme(theme: Theme): void {
	const osTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

	if (theme === osTheme) {
		localStorage.removeItem(STORAGE_KEY);
	} else {
		localStorage.setItem(STORAGE_KEY, theme);
	}

	applyThemeToDOM(theme);
	emitChange();
}

export function useTheme(): {theme: Theme; setTheme: (theme: Theme) => void} {
	const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

	// Guard against React hydration removing the class set by the blocking script.
	// `useLayoutEffect` runs synchronously before the browser paints, ensuring the correct theme
	// class is always on <html> before any frame is rendered.
	useLayoutEffect(() => {
		applyThemeToDOM(theme);
	}, [theme]);

	return {theme, setTheme};
}