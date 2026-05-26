// src/lib/storage.ts

import { supabase } from "./supabase";

const MAX_FILE_SIZE_MB = 2;
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export async function uploadAvatar(
  file: File,
  userId: string,
): Promise<string> {
  // 1. Validate MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error("Avatar must be a JPEG, PNG, WebP, or GIF image.");
  }

  // 2. Validate file size
  const fileSizeMB = file.size / (1024 * 1024);
  if (fileSizeMB > MAX_FILE_SIZE_MB) {
    throw new Error(`Avatar must be smaller than ${MAX_FILE_SIZE_MB}MB.`);
  }

  // 3. Derive extension and build path
  const ext = file.type.split("/")[1]; // e.g. "image/png" → "png"
  const path = `${userId}/avatar.${ext}`;

  // 4. Upload (upsert replaces in place)
  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(path, file, { upsert: true });

  if (uploadError) throw new Error(uploadError.message);

  // 5. Return public URL
  const { data } = supabase.storage.from("avatars").getPublicUrl(path);
  return `${data.publicUrl}?t=${Date.now()}`;
}
