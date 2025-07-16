module.exports = {
	root: true,
	extends: [],
	ignorePatterns: ['.cache/', '.git/', '.github/', 'node_modules/'],
	overrides: [
		{
			files: ['*.ts'],
			parserOptions: {
				project: ['./tsconfig.json'],
				createDefaultProgram: true,
			},
			plugins: ['sort-class-members'],
			extends: [
				'plugin:@angular-eslint/recommended',
				'plugin:@typescript-eslint/recommended',
				'@tinkoff/eslint-config/app',
				'@tinkoff/eslint-config-angular',
				'@tinkoff/eslint-config-angular/rxjs',
				'@tinkoff/eslint-config-angular/promise',
				'@tinkoff/eslint-config-angular/unicorn',
				'@tinkoff/eslint-config-angular/html-eslint',
				'@tinkoff/eslint-config-angular/file-progress',
				'@tinkoff/eslint-config-angular/line-statements',
				'@tinkoff/eslint-config-angular/decorator-position',
				'@tinkoff/eslint-config-angular/function-return-type',
			],
			rules: {
				'import/no-unresolved': 'off',
				'import/extensions': 'off',
				'import/no-relative-packages': 'off',
				'import/no-cycle': 'off',
				'@typescript-eslint/ban-types': 'off',
				'@typescript-eslint/consistent-type-imports': 'off',
				'@typescript-eslint/no-empty-function': 'off',
				'@typescript-eslint/no-empty-object-type': 'off',
				'@typescript-eslint/no-explicit-any': 'error',
				'@typescript-eslint/explicit-member-accessibility': [
					'warn',
					{
						accessibility: 'explicit',
						overrides: {
							constructors: 'no-public',
							accessors: 'explicit',
							methods: 'explicit',
							properties: 'explicit',
							parameterProperties: 'explicit',
						},
					},
				],
				'no-useless-rename': [
					'error',
					{
						ignoreDestructuring: true,
						ignoreImport: false,
						ignoreExport: false,
					},
				],
				'no-useless-constructor': 'off',
				'no-useless-return': 'off',
				'no-console': [
					'warn',
					{ allow: ['info', 'assert', 'warn', 'error'] },
				],
				'sort-class-members/sort-class-members': [
					2,
					{
						order: [
							'[static-fields]',
							'[class-fields]',
							'constructor',
							'[static-methods]',
							'[getter-setters]',
							'[class-methods]',
						],
						groups: {
							'static-fields': [
								{ static: true, type:'property' }
							],
							'static-methods': [
								{ static: true, type:'method' }
							],
							'class-fields': [
								{ type: 'property' }
							],
							'getter-setters': [
								{ kind: 'accessor'}
							],
							'class-methods': [
								{ type: 'method' }
							],

						},
						accessorPairPositioning: 'getThenSet',
					},
				],
			},
		},
		{
			files: ['*.html'],
			extends: ['plugin:@angular-eslint/template/recommended'],
			rules: {
				'prettier/prettier': ['error', { parser: 'angular' }],
				'@angular-eslint/template/attributes-order': ['error'],
			},
		},
	],
};
