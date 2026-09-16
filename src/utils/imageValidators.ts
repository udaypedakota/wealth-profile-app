export interface ImageValidationResult {
  isValid: boolean;
  error?: string;
  dataUrl?: string;
}

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
export const MAX_IMAGE_SIZE_MB = 5;
export const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

/**
 * Validates file type and size, and converts file to Base64 Data URL for local storage
 */
export async function validateAndReadImage(file: File): Promise<ImageValidationResult> {
  // Check file type
  const isTypeValid = ALLOWED_IMAGE_TYPES.includes(file.type.toLowerCase()) ||
    file.name.match(/\.(jpg|jpeg|png)$/i);

  if (!isTypeValid) {
    return {
      isValid: false,
      error: `Unsupported file format. Please select a JPG, JPEG, or PNG image.`
    };
  }

  // Check file size
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      isValid: false,
      error: `File size (${sizeInMB}MB) exceeds the maximum limit of ${MAX_IMAGE_SIZE_MB}MB.`
    };
  }

  // Read file as Data URL
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      resolve({
        isValid: true,
        dataUrl: result
      });
    };
    reader.onerror = () => {
      resolve({
        isValid: false,
        error: 'Failed to read image file. Please try another image.'
      });
    };
    reader.readAsDataURL(file);
  });
}
