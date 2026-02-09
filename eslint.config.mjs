import nextTs from 'eslint-config-next/typescript';
import nextVitals from 'eslint-config-next/core-web-vitals';
import pluginQuery from '@tanstack/eslint-plugin-query';

const eslintConfig = [
	...pluginQuery.configs['flat/recommended'],
	...nextVitals,
	...nextTs,
];

export default eslintConfig;
