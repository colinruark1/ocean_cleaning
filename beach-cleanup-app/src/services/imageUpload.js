/**
 * Image Upload Service
 * Handles image compression, validation, and upload to Firebase Storage
 */
import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          console.log(`[Compression] Original image dimensions: ${width}x${height}, File size: ${file.size} bytes`);

          // Calculate new dimensions
          if (width > maxWidth) {
            height = Math.round((maxWidth / width) * height);
            width = maxWidth;
          }

          console.log(`[Compression] Target dimensions: ${width}x${height}`);

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d', { alpha: false });
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }

          console.log(`[Compression] Canvas context created successfully`);

          // Fill with white background first (in case image has transparency)
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);

          console.log(`[Compression] White background filled`);

          // Enable image smoothing for better quality
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // Draw the image
          ctx.drawImage(img, 0, 0, width, height);

          console.log(`[Compression] Image drawn on canvas`);

          // Force output to JPEG for better compression
          const outputType = 'image/jpeg';
          console.log(`[Compression] Converting to ${outputType} with quality ${quality}`);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                console.log(`[Compression] ✓ Blob created - Original: ${file.size} bytes → Compressed: ${blob.size} bytes (${Math.round((blob.size / file.size) * 100)}%)`);
                resolve(blob);
              } else {
                console.error('[Compression] ✗ Failed to create blob from canvas');
                reject(new Error('Failed to create blob from canvas'));
              }
            },
            outputType,
            quality
          );
        } catch (error) {
          console.error('[Compression] Canvas processing error:', error);
          reject(error);
        }
      };

      img.onerror = (error) => {
        console.error('[Compression] Image load error:', error);
        reject(new Error('Failed to load image for compression'));
      };

      img.src = e.target.result;
    };

    reader.onerror = (error) => {
      console.error('[Compression] FileReader error:', error);
      reject(new Error('Failed to read file'));
    };

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
 * Uploads an image to Firebase Storage
 * @param {File} file - The file to upload
 * @param {string} userId - User ID
 * @param {string} type - Image type (profile, post, banner)
 * @param {Function} onProgress - Progress callback (optional)
 * @returns {Promise<string>} - Public URL of the uploaded image
 */
export const uploadImage = async (file, userId, type = 'post', onProgress = null) => {
  try {
    console.log(`[Upload] Starting upload for ${type} image - File: ${file.name}, Size: ${file.size} bytes, Type: ${file.type}`);

    // Validate the file
    const validation = validateImage(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    if (onProgress) onProgress(30);

    // Compress the image with different settings based on type
    let compressedBlob;
    if (type === 'profile') {
      // Profile pictures: higher quality, smaller dimensions for better results
      console.log('[Upload] Compressing profile picture (400px, quality 0.90)');
      compressedBlob = await compressImage(file, 400, 0.90);
    } else if (type === 'banner') {
      // Banners need more width
      console.log('[Upload] Compressing banner (1500px, quality 0.85)');
      compressedBlob = await compressImage(file, 1500, 0.85);
    } else {
      // Default for posts
      console.log('[Upload] Compressing post image (1200px, quality 0.85)');
      compressedBlob = await compressImage(file, 1200, 0.85);
    }

    if (onProgress) onProgress(60);

    const compressionRatio = Math.round((compressedBlob.size / file.size) * 100);
    console.log(`[Upload] Compression complete - Original: ${file.size} bytes → Compressed: ${compressedBlob.size} bytes (${compressionRatio}%)`);

    // Check if Firebase Storage is available
    if (!storage) {
      console.warn('[Upload] ⚠️ Firebase Storage not available, falling back to data URL');
      // Fallback to data URL if Firebase is not configured
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target.result;
          if (!result || typeof result !== 'string') {
            reject(new Error('Invalid data URL'));
            return;
          }
          console.log(`[Upload] ✓ Data URL created - Length: ${result.length} chars`);
          resolve(result);
        };
        reader.onerror = () => reject(new Error('Failed to read compressed image'));
        reader.readAsDataURL(compressedBlob);
      });

      if (onProgress) onProgress(100);
      return dataUrl;
    }

    if (onProgress) onProgress(70);

    // Generate filename
    const extension = file.name.split('.').pop() || 'jpg';
    const filename = generateFilename(userId, type, extension);

    console.log(`[Upload] Uploading to Firebase Storage: ${filename}`);

    // Create a reference to the file location
    const storageRef = ref(storage, filename);

    // Upload the compressed blob
    const snapshot = await uploadBytes(storageRef, compressedBlob, {
      contentType: 'image/jpeg',
    });

    console.log(`[Upload] ✓ File uploaded to Firebase Storage`);

    if (onProgress) onProgress(90);

    // Get the public download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    console.log(`[Upload] ✓ Public URL obtained: ${downloadURL}`);

    if (onProgress) onProgress(100);

    console.log(`[Upload] ✓ Upload complete for ${type}`);
    return downloadURL;
  } catch (error) {
    console.error('[Upload] ✗ Upload error:', error);
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
