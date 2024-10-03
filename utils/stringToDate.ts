

export function stringToDate(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number);
    
    // Note: The month is zero-indexed in JavaScript Date (January is 0, December is 11)
    return new Date(year, month - 1, day);
}