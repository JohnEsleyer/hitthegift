

export function convertTo24HourFormat(hour: number, period: "AM" | "PM"): number {
    if (period === "PM" && hour !== 12) {
      return hour + 12; // Convert to 24-hour format if PM and not 12
    } else if (period === "AM" && hour === 12) {
      return 0; // 12 AM is midnight, which is 0 in 24-hour format
    }
    return hour; // Return the same hour for AM or 12 PM
  }
  
  // Example usage:
  console.log(convertTo24HourFormat(1, "PM")); // Output: 13
  console.log(convertTo24HourFormat(12, "PM")); // Output: 12
  console.log(convertTo24HourFormat(12, "AM")); // Output: 0
  console.log(convertTo24HourFormat(11, "AM")); // Output: 11
  