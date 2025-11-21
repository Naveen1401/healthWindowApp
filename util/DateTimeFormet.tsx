export const DateFormat = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export const isoConverter = (isoString: string) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');

    return `${day}/${month}`;
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


export const formatConsultationDate = (isoString: string) => {
    const date = new Date(isoString);

    const day = date.toLocaleDateString("en-IN", { weekday: "long" }); // Tuesday
    const fullDate = date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    }); // 10 January 2025
    const time = date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
    }); // 01:45 PM

    return { day, fullDate, time };
};
