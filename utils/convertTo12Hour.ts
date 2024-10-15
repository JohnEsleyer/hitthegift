
export function convertTo12HourFormat(time: number): number {
    if (time < 0 || time > 23) {
      throw new Error("Invalid 24-hour time format");
    }
  
    if (time === 0) {
      return 12;
    } else if (time > 12) {
      return time - 12;
    } else {
      return time;
    }
  }

export function getMeridiem(time: number): "AM" | "PM" {
    if (time < 0 || time > 23) {
      throw new Error("Invalid 24-hour time format");
    }
  
    return time < 12 ? "AM" : "PM";
  }

  