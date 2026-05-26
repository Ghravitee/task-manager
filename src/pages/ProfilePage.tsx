import { useState, useRef, useEffect } from "react";
import { Camera, X, User } from "lucide-react";
import { supabase } from "../lib/supabase";
import { uploadAvatar } from "../lib/storage";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/useToast";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth();
  const { success: toastSuccess, error: toastError } = useToast();

  // ─── Local edit state (empty = no edit made yet) ──────────────
  const [fullName, setFullName] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ─── Derived display values ───────────────────────────────────
  // Falls back to profile data until the user makes an edit
  const displayName = fullName || profile?.full_name || "";
  const displayAvatar = avatarPreview ?? profile?.avatar_url ?? null;

  // Revoke blob URLs on unmount
  useEffect(() => {
    return () => {
      if (avatarFile && avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarFile, avatarPreview]);

  // ─── File handlers ────────────────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (avatarFile && avatarPreview) URL.revokeObjectURL(avatarPreview);

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleRemoveAvatar = () => {
    if (avatarFile && avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarFile(null);
    setAvatarPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ─── Submit ───────────────────────────────────────────────────
  const handleSave = async () => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      let avatarUrl = profile?.avatar_url ?? null;

      if (avatarFile) {
        avatarUrl = await uploadAvatar(avatarFile, user.id);
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: (fullName.trim() || profile?.full_name) ?? null,
          avatar_url: avatarUrl,
        })
        .eq("id", user.id);

      if (error) throw new Error(error.message);

      await refreshProfile();
      toastSuccess("Profile updated.");
    } catch (err) {
      toastError(
        err instanceof Error ? err.message : "Failed to update profile.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Render ───────────────────────────────────────────────────
  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Profile</h1>
        <p className="mt-1 text-sm text-gray-400">
          Update your name and profile photo
        </p>
      </div>

      <div className="mx-auto max-w-lg px-4 py-10 flex flex-col gap-6 rounded-xl border border-white/10 bg-gray-900 p-6">
        {/* Avatar */}
        <div className="flex flex-col gap-1.5">
          <span className="text-sm text-gray-400">Profile photo</span>

          {displayAvatar ? (
            <div className="flex items-center gap-3">
              <img
                src={displayAvatar}
                alt="Avatar preview"
                className="h-16 w-16 rounded-full object-cover ring-2 ring-white/10"
              />
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-left text-sm text-cyan-400 transition hover:text-cyan-300"
                >
                  Change photo
                </button>
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  className="flex items-center gap-1 text-left text-sm text-gray-500 transition hover:text-red-400"
                >
                  <X size={12} />
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex w-fit items-center gap-2 rounded-lg border border-white/10 bg-gray-800 px-4 py-2 text-sm text-gray-300 transition hover:border-white/20 hover:bg-gray-700 hover:text-white"
            >
              <Camera size={15} className="text-gray-400" />
              Upload photo
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Full name */}
        <Input
          label="Full name"
          type="text"
          placeholder="Sarah Johnson"
          value={displayName}
          onChange={(e) => setFullName(e.target.value)}
          leftIcon={<User size={16} />}
        />

        {/* Email — read only */}
        <div className="flex flex-col gap-1.5">
          <span className="text-sm text-gray-400">Email</span>
          <p className="text-sm text-gray-500">{profile?.email}</p>
        </div>

        {/* Save */}
        <Button onClick={handleSave} isLoading={isSubmitting} fullWidth>
          Save changes
        </Button>
      </div>
    </div>
  );
}

export default ProfilePage;
