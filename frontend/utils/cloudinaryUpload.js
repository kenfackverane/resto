// src/utils/cloudinaryUpload.js
import axios from "axios";

/**
 * Upload une image sur Cloudinary (unsigned preset) - Next.js
 * Vars attendues dans .env.local :
 * - NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
 * - NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
 * - NEXT_PUBLIC_CLOUDINARY_API_KEY
 *
 * @param {File} file
 * @param {(percent:number)=>void} onProgress
 * @returns {Promise<string>} secure_url
 */
export async function uploadToCloudinary(file, onProgress) {
  if (!file) throw new Error("No file provided");

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;

  console.log("Cloud name:", cloudName);
  console.log("Preset:", uploadPreset);

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Missing Cloudinary env vars (NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME / NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET)"
    );
  }

  // ✅ auto/upload pour compatibilité max
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  // ✅ important pour certains comptes: api_key (publique)
  if (apiKey) formData.append("api_key", apiKey);

  // ✅ optionnel: si tu veux forcer le dossier (ton preset est déjà "resto")
  formData.append("folder", "resto");

  try {
    const res = await axios.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 30000,
      onUploadProgress: (evt) => {
        if (!onProgress || !evt.total) return;
        const percent = Math.round((evt.loaded * 100) / evt.total);
        onProgress(percent);
      },
    });

    const secureUrl = res?.data?.secure_url;
    if (!secureUrl) throw new Error("Cloudinary upload failed: no secure_url returned");

    return secureUrl;
  } catch (err) {
    const status = err?.response?.status;
    const data = err?.response?.data;
    const cloudMsg =
      data?.error?.message ||
      data?.message ||
      err?.message ||
      "Cloudinary upload failed";

    console.log("❌ Cloudinary status:", status);
    console.log("❌ Cloudinary message:", cloudMsg);
    console.log("❌ Cloudinary full data:", JSON.stringify(data, null, 2));

    throw new Error(cloudMsg);
  }
}

export function optimizeCloudinaryUrl(url) {
  if (!url) return "";
  return url.replace("/upload/", "/upload/f_auto,q_auto/");
}