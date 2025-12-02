"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";

interface ProfileData {
  name: string;
  email: string;
  about: string;
  image: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    website?: string;
  };
}

export default function InstructorProfilePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState<ProfileData>({
    name: "",
    email: "",
    about: "",
    image: "",
    socialLinks: {},
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/instructor/profile");
      if (response.ok) {
        const data = await response.json();
        if (data.ok) {
          setProfile(data.profile);
        }
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/instructor/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.ok && data.url) {
        setProfile((prev) => ({
          ...prev,
          image: data.url,
        }));
      } else {
        alert(data.message || "Failed to upload image");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setError(null);
    setUpdateSuccess(false);

    try {
      const response = await fetch("/api/instructor/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      });

      const data = await response.json();

      if (response.ok && data.ok) {
        setUpdateSuccess(true);
        setTimeout(() => setUpdateSuccess(false), 3000);
      } else {
        setError(data.message || "Failed to update profile");
      }
    } catch (error) {
      setError("Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-sm text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground mt-2">
          Update your instructor profile information
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-6 space-y-6">
        {/* Profile Image */}
        <div className="space-y-2">
          <Label>Profile Image</Label>
          <div className="space-y-3">
            {profile.image ? (
              <div className="relative">
                <div className="relative w-32 h-32 border rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={profile.image}
                    alt="Profile image"
                    fill
                    className="object-cover"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setProfile((prev) => ({ ...prev, image: "" }))}
                  className="mt-2"
                >
                  <X className="h-4 w-4 mr-1" />
                  Remove Image
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="profileImage"
                  disabled={uploading}
                />
                <label
                  htmlFor="profileImage"
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-8 w-8 animate-spin text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">Uploading...</p>
                    </>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 mb-1">
                        Click to upload profile image
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                    </>
                  )}
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            value={profile.name}
            onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
            required
            placeholder="Your full name"
          />
        </div>

        {/* Email (read-only) */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={profile.email}
            disabled
            className="bg-gray-50 cursor-not-allowed"
          />
          <p className="text-xs text-gray-500">
            Email cannot be changed. Contact admin to update your email.
          </p>
        </div>

        {/* About */}
        <div className="space-y-2">
          <Label htmlFor="about">About</Label>
          <Textarea
            id="about"
            value={profile.about}
            onChange={(e) => setProfile((prev) => ({ ...prev, about: e.target.value }))}
            rows={4}
            placeholder="Tell us about yourself..."
            maxLength={1000}
          />
          <p className="text-xs text-gray-500">
            {profile.about.length}/1000 characters
          </p>
        </div>

        {/* Social Links */}
        <div className="space-y-4">
          <Label>Social Links</Label>
          
          <div className="space-y-2">
            <Label htmlFor="linkedin" className="text-sm">LinkedIn</Label>
            <Input
              id="linkedin"
              type="url"
              value={profile.socialLinks?.linkedin || ""}
              onChange={(e) =>
                setProfile((prev) => ({
                  ...prev,
                  socialLinks: { ...prev.socialLinks, linkedin: e.target.value },
                }))
              }
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="twitter" className="text-sm">Twitter</Label>
            <Input
              id="twitter"
              type="url"
              value={profile.socialLinks?.twitter || ""}
              onChange={(e) =>
                setProfile((prev) => ({
                  ...prev,
                  socialLinks: { ...prev.socialLinks, twitter: e.target.value },
                }))
              }
              placeholder="https://twitter.com/yourhandle"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="github" className="text-sm">GitHub</Label>
            <Input
              id="github"
              type="url"
              value={profile.socialLinks?.github || ""}
              onChange={(e) =>
                setProfile((prev) => ({
                  ...prev,
                  socialLinks: { ...prev.socialLinks, github: e.target.value },
                }))
              }
              placeholder="https://github.com/yourusername"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website" className="text-sm">Website</Label>
            <Input
              id="website"
              type="url"
              value={profile.socialLinks?.website || ""}
              onChange={(e) =>
                setProfile((prev) => ({
                  ...prev,
                  socialLinks: { ...prev.socialLinks, website: e.target.value },
                }))
              }
              placeholder="https://yourwebsite.com"
            />
          </div>
        </div>

        {/* Success/Error Messages */}
        {updateSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            Profile updated successfully!
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={updating}
            className="bg-[#00E785] hover:bg-[#00d675] text-black font-semibold"
          >
            {updating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Profile"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

