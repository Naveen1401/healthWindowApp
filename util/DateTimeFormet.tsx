export const DateFormat = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export const FormatTimeDisplay = (timeString: string) => {
    if (!timeString) return 'Not set';

    try {
        const [hours, minutes] = timeString.split(':');
        const hourNum = parseInt(hours);
        const ampm = hourNum >= 12 ? 'PM' : 'AM';
        const displayHours = hourNum % 12 || 12;
        return `${displayHours}:${minutes} ${ampm}`;
    } catch {
        return timeString;
    }
};