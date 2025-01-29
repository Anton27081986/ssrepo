import { maskitoDateOptionsGenerator } from '@maskito/kit';
import { MaskitoOptions } from '@maskito/core';

export const dateInputTextMask = maskitoDateOptionsGenerator({
	mode: 'dd/mm/yyyy',
});

export const numberInputTextMask: MaskitoOptions = {
	mask: /^[0-9]+([.,][0-9]*)?$/,
};
