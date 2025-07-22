import { AbstractControl } from '@angular/forms';

/**
 * Опции для преобразования чисел
 */
interface NumberConversionOptions {
	fieldName?: string;
	defaultValue?: number;
	throwOnError?: boolean;
}

/**
 * Опции для преобразования ID
 */
interface IdConversionOptions {
	fieldName?: string;
	required?: boolean;
}

/**
 * Утилита для безопасного преобразования значений в числа
 */
export class SafeNumberConversion {
	/**
	 * Безопасно преобразует значение в число с валидацией
	 */
	public static toNumber(
		value: unknown,
		options: NumberConversionOptions = {}
	): number {
		const {
			fieldName = 'field',
			defaultValue = 0,
			throwOnError = false,
		} = options;

		// Проверка на null, undefined, пустые строки
		if (
			value === null ||
			value === undefined ||
			value === '' ||
			(typeof value === 'string' && !value.trim())
		) {
			return this.handleError(
				`${fieldName} is empty or invalid`,
				defaultValue,
				throwOnError
			);
		}

		const num = Number(value);

		// Проверка на NaN или Infinity
		if (!Number.isFinite(num)) {
			return this.handleError(
				`${fieldName} cannot be converted to valid number: ${value}`,
				defaultValue,
				throwOnError
			);
		}

		return num;
	}

	/**
	 * Безопасно преобразует ID в положительное число
	 */
	public static toId(
		value: unknown,
		options: IdConversionOptions = {}
	): number {
		const { fieldName = 'id', required = true } = options;

		const result = this.toNumber(value, {
			fieldName,
			defaultValue: 0,
			throwOnError: required,
		});

		if (required && result <= 0) {
			throw new Error(`${fieldName} must be positive, got: ${result}`);
		}

		return result;
	}

	/**
	 * Безопасно извлекает ID из строго типизированного FormControl
	 */
	public static fromFormControl<T extends number | null>(
		control: AbstractControl<T> | null,
		options: IdConversionOptions = {}
	): number {
		return this.toId(control?.value, options);
	}

	/**
	 * Безопасно извлекает число из строго типизированного FormControl
	 */
	public static numberFromForm<T extends number | null>(
		control: AbstractControl<T> | null,
		options: NumberConversionOptions = {}
	): number {
		return this.toNumber(control?.value, {
			...options,
			defaultValue: options.defaultValue ?? 0,
			throwOnError: false,
		});
	}

	/**
	 * Обрабатывает ошибки конвертации
	 */
	private static handleError(
		message: string,
		defaultValue: number,
		throwOnError: boolean
	): number {
		if (throwOnError) {
			throw new Error(`Number conversion error: ${message}`);
		}

		console.warn(
			`Number conversion: ${message}, using default: ${defaultValue}`
		);
		return defaultValue;
	}
}
