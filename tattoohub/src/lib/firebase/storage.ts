// Image upload operations using base64 (no Firebase Storage needed)

// Maximum file size: 200KB
const MAX_FILE_SIZE = 200 * 1024;

// Allowed image types
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

/**
 * Validate image file
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { 
      valid: false, 
      error: 'Invalid file type. Only JPG, PNG, and WebP images are allowed.' 
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { 
      valid: false, 
      error: `File size exceeds 200KB limit. Your file is ${(file.size / 1024).toFixed(2)}KB. Please use a smaller image.` 
    };
  }

  return { valid: true };
}

/**
 * Convert image file to base64 data URL
 */
export async function uploadArtistPhoto(
  artistId: string, 
  file: File,
  type: 'avatar' | 'cover' = 'avatar'
): Promise<string> {
  const startTime = Date.now();
  try {
    console.log(`📤 Converting ${type} to base64, Size: ${(file.size / 1024).toFixed(2)}KB`);
    
    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    console.log('✅ Validation passed');

    console.log('🔄 Converting to base64...');
    // Convert to base64
    const base64 = await getImagePreview(file);
    
    const elapsed = Date.now() - startTime;
    console.log(`✅ Image converted to base64 in ${elapsed}ms`);
    
    return base64;
  } catch (error) {
    const elapsed = Date.now() - startTime;
    console.error(`❌ Error converting image after ${elapsed}ms:`, error);
    throw error;
  }
}

/**
 * Upload artist portfolio image (base64)
 */
export async function uploadPortfolioImage(
  artistId: string, 
  file: File,
  index: number
): Promise<string> {
  try {
    console.log(`📤 Converting portfolio image ${index}, Size: ${(file.size / 1024).toFixed(2)}KB`);
    
    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Convert to base64
    const base64 = await getImagePreview(file);
    console.log('✅ Portfolio image converted to base64');
    
    return base64;
  } catch (error) {
    console.error('❌ Error converting portfolio image:', error);
    throw error;
  }
}

/**
 * Delete image (no-op for base64, kept for compatibility)
 */
export async function deleteImage(_imageUrl: string): Promise<void> {
  // Base64 images are stored in database, nothing to delete from storage
  console.log('ℹ️ Base64 image, no storage deletion needed');
}

/**
 * Get image preview URL from File
 */
export function getImagePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
}
