
export const fileToBase64 = (file: File): Promise<{ base64: string, mimeType: string }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            // result is in the format "data:image/jpeg;base64,..."
            const mimeType = result.split(':')[1].split(';')[0];
            const base64 = result.split(',')[1];
            resolve({ base64, mimeType });
        };
        reader.onerror = error => reject(error);
    });
};
