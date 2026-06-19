import nextTs from 'eslint-config-next/typescript';
import nextVitals from 'eslint-config-next/core-web-vitals';
import pluginQuery from '@tanstack/eslint-plugin-query';
import stylistic from '@stylistic/eslint-plugin';

const eslintConfig = [
	...pluginQuery.configs['flat/recommended'],
	...nextVitals,
	...nextTs,
	stylistic.configs.recommended,
	{
		rules: {
			'@stylistic/arrow-parens': ['error', 'as-needed'],
			'@stylistic/brace-style': ['error', '1tbs'],
			'@stylistic/comma-dangle': ['error', {
				arrays: 'always-multiline',
				objects: 'always-multiline',
				imports: 'always-multiline',
				exports: 'always-multiline',
				functions: 'never',
				enums: 'always-multiline',
			}],
			'@stylistic/indent': ['error', 'tab'],
			'@stylistic/indent-binary-ops': ['error', 'tab'],
			'@stylistic/jsx-indent-props': ['error', 'tab'],
			'@stylistic/jsx-tag-spacing': ['error', {
				closingSlash: 'never',
				beforeSelfClosing: 'never',
				afterOpening: 'never',
				beforeClosing: 'never',
			}],
			'@stylistic/max-len': ['error', {
				code: 100,
				ignoreStrings: true,
				ignoreTemplateLiterals: true,
				tabWidth: 2,
			}],
			'@stylistic/no-tabs': 'off',
			'@stylistic/object-curly-spacing': ['error', 'never'],
			'@stylistic/semi': ['error', 'always'],
		},
	},
];

export default eslintConfig;
