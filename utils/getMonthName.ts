export function getMonthName(date: Date): string {
    const monthNames: string[] = [
        "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"
    ];

    const monthIndex: number = date.getMonth(); // getMonth() returns 0-11
    return monthNames[monthIndex];
}

