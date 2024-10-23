export function dateTimeFromIsoString(dateString: string | undefined): string {
	if (!dateString) {
		return '';
	}

	const date = new Date(dateString);

	const year = date.getFullYear(); // 2024
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const day = date.getDate().toString().padStart(2, '0');
	const hours = date.getHours().toString().padStart(2, '0');
	const minutes = date.getMinutes().toString().padStart(2, '0');

	return `${day}:${month}:${year} ${hours}:${minutes}`;
}

export function getTime(date: Date): string {
	const hours = `0${date.getHours()}`.slice(-2);
	const minutes = `0${date.getMinutes()}`.slice(-2);

	return `${hours}:${minutes}`;
}
