
export const handleBase64ToFormData = (base64String: string, fileName: string) => {
    // Convert the base64 string to a Blob
    const byteString = atob(base64String.split(',')[1]);
    const mimeType = base64String.match(/data:(.*);base64/)?.[1] || 'image/png';
    const byteNumbers = new Array(byteString.length);
    
    for (let i = 0; i < byteString.length; i++) {
      byteNumbers[i] = byteString.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });
    
    // Convert the Blob to a File
    const renamedFile = new File([blob], fileName, { type: mimeType });
  
    // Create a FormData object and append the file
    const formData = new FormData();
    formData.append('file', renamedFile);
  
    return formData;
  };
  