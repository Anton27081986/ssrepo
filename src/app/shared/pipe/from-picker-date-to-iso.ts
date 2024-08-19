export function fromPickerRangeDateToIso(date: string) {
	const parsed = date.split('-');
	const startDate = toIsoDate(parsed[0]);
	const endDate = toIsoDate(parsed[1]);

	return [startDate, endDate];
}

export function fromPickerDateToIso(date: string) {
	return toIsoDate(date);
}

function toIsoDate(date: string) {
	const parsed = date.split('.');
	const replaced = [parsed[1], parsed[0], parsed[2]].join('.');

	return new Date(Date.parse(replaced) + 1000 * 60 * 60 * 24).toISOString();
}
