

export function convertTo24HourFormat(hour: number, period: "AM" | "PM"): number {
    if (period === "PM" && hour !== 12) {
      return hour + 12; // Convert to 24-hour format if PM and not 12
    } else if (period === "AM" && hour === 12) {
      return 0; // 12 AM is midnight, which is 0 in 24-hour format
    }
    return hour; // Return the same hour for AM or 12 PM
  }
