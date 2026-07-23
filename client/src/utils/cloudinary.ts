export const getOptimizedCloudinaryUrl = (url: string, options?: { width?: number, height?: number }) => {
  if (!url || !url.includes('res.cloudinary.com')) return url;

  const parts = url.split('/upload/');
  if (parts.length !== 2) return url;

  // Use f_auto to automatically deliver WebP/AVIF if supported, and q_auto for automatic quality compression
  const width = options?.width || 800;
  let transforms = `c_limit,w_${width},f_auto,q_auto`;

  if (options?.height) {
    // If both width and height are provided, we fill the area to avoid distortion or empty space
    transforms = `c_fill,w_${width},h_${options.height},f_auto,q_auto`;
  }

  return `${parts[0]}/upload/${transforms}/${parts[1]}`;
};
