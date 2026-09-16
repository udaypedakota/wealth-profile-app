export interface ImageValidationResult {
  isValid: boolean;
  error?: string;
  dataUrl?: string;
  originalSizeKb?: number;
  compressedSizeKb?: number;
}

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
export const MAX_IMAGE_SIZE_MB = 15;
export const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

/**
 * Validates file type and size, then automatically resizes & compresses the image
 * using HTML5 Canvas to ensure it fits comfortably in localStorage and cloud payload.
 */
export async function validateAndReadImage(
  file: File,
  maxDimension = 480,
  quality = 0.82
): Promise<ImageValidationResult> {
  // Check file type
  const isTypeValid =
    ALLOWED_IMAGE_TYPES.includes(file.type.toLowerCase()) ||
    Boolean(file.name.match(/\.(jpg|jpeg|png|webp)$/i));

  if (!isTypeValid) {
    return {
      isValid: false,
      error: 'Unsupported format. Please select a JPG, JPEG, PNG, or WEBP image.'
    };
  }

  // Check file size (up to 15MB allowed since we compress)
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      isValid: false,
      error: `File size (${sizeInMB}MB) exceeds the maximum limit of ${MAX_IMAGE_SIZE_MB}MB.`
    };
  }

  const originalSizeKb = Math.round(file.size / 1024);

  // Read file and compress via Canvas
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const rawDataUrl = event.target?.result as string;
      const img = new Image();

      img.onload = () => {
        try {
          let width = img.width;
          let height = img.height;

          // Scale down proportionally if larger than maxDimension
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = Math.max(width, 1);
          canvas.height = Math.max(height, 1);

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            // Fallback to raw if canvas context unavailable
            resolve({
              isValid: true,
              dataUrl: rawDataUrl,
              originalSizeKb,
              compressedSizeKb: originalSizeKb
            });
            return;
          }

          // High quality smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // Draw scaled image
          ctx.drawImage(img, 0, 0, width, height);

          // Export as compressed JPEG (optimal size for mobile and avatars)
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          const compressedSizeKb = Math.round((compressedDataUrl.length * 3) / 4 / 1024);

          resolve({
            isValid: true,
            dataUrl: compressedDataUrl,
            originalSizeKb,
            compressedSizeKb
          });
        } catch {
          // Fallback if canvas compression encounters security or memory limits
          resolve({
            isValid: true,
            dataUrl: rawDataUrl,
            originalSizeKb,
            compressedSizeKb: originalSizeKb
          });
        }
      };

      img.onerror = () => {
        resolve({
          isValid: false,
          error: 'Failed to decode image. Please select another photo.'
        });
      };

      img.src = rawDataUrl;
    };

    reader.onerror = () => {
      resolve({
        isValid: false,
        error: 'Failed to read image file from device. Please try again.'
      });
    };

    reader.readAsDataURL(file);
  });
}
