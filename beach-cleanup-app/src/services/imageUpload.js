/**
 * Image Upload Service
 * Handles image compression, validation, and upload to Firebase Storage
 */

// Maximum file size in bytes (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Allowed image types
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

/**
 * Validates an image file
 * @param {File} file - The file to validate
 * @returns {Object} - { valid: boolean, error: string }
 */
export const validateImage = (file) => {
  if (!file) {
    return { valid: false, error: 'No file selected' };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload a JPG, PNG, GIF, or WebP image.'
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`
    };
  }

  return { valid: true, error: null };
};

/**
 * Compresses an image file
 * @param {File} file - The file to compress
 * @param {number} maxWidth - Maximum width in pixels (default: 1200)
 * @param {number} quality - Image quality 0-1 (default: 0.85)
 * @returns {Promise<Blob>} - Compressed image blob
 */
export const compressImage = (file, maxWidth = 1200, quality = 0.85) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > maxWidth) {
          height = (maxWidth / width) * height;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          file.type,
          quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target.result;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

/**
 * Generates a unique filename for uploaded images
 * @param {string} userId - User ID
 * @param {string} type - Image type (profile, post, banner)
 * @param {string} extension - File extension
 * @returns {string} - Unique filename
 */
export const generateFilename = (userId, type, extension) => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `${type}/${userId}_${timestamp}_${random}.${extension}`;
};

/**
 * Uploads an image (converts to base64 data URL for now)
 * @param {File} file - The file to upload
 * @param {string} userId - User ID
 * @param {string} type - Image type (profile, post, banner)
 * @param {Function} onProgress - Progress callback (optional)
 * @returns {Promise<string>} - Data URL of the image
 */
export const uploadImage = async (file, userId, type = 'post', onProgress = null) => {
  try {
    // Validate the file
    const validation = validateImage(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    if (onProgress) onProgress(30);

    // Compress the image
    const compressedBlob = await compressImage(file);

    if (onProgress) onProgress(60);

    // Convert compressed blob to data URL
    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => reject(new Error('Failed to read compressed image'));
      reader.readAsDataURL(compressedBlob);
    });

    if (onProgress) onProgress(100);

    return dataUrl;
  } catch (error) {
    console.error('Image upload error:', error);
    throw error;
  }
};

/**
 * Converts a file to a data URL for preview
 * @param {File} file - The file to convert
 * @returns {Promise<string>} - Data URL
 */
export const fileToDataURL = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};
