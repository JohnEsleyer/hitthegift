

export function getLastElement<T>(arr: T[]): T | undefined {
  if (!arr){
    return 
  }
    return arr.length > 0 ? arr[arr.length - 1] : undefined;
}
  