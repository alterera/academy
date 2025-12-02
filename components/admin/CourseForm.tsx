"use client";

import { useState, useEffect, FormEvent, useRef } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Loader2, Save, Upload, X } from "lucide-react";
import Image from "next/image";

interface Lesson {
  name: string;
  videoUrl?: string;
}

interface Chapter {
  title: string;
  isPro: boolean;
  lessons: Lesson[];
}

interface CourseFormData {
  title: string;
  slug: string;
  shortDescription: string;
  featuredImage: string;
  chapters: number;
  assessments: number;
  videos: number;
  days: number;
  learnings: string[];
  overviewVideoUrl: string;
  curriculum: Chapter[];
  certificationEnabled: boolean;
  isPublished: boolean;
  priceTitle: string;
  price: string;
  priceDescription: string;
  priceSubDescription: string;
  priceFeatures: string[];
  priceButtonText: string;
  priceFooterText: string;
}

export default function CourseForm({ courseId, isInstructor = false }: { courseId?: string; isInstructor?: boolean }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(!!courseId);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState<CourseFormData>({
    title: "",
    slug: "",
    shortDescription: "",
    featuredImage: "",
    chapters: 0,
    assessments: 0,
    videos: 0,
    days: 0,
    learnings: [""],
    overviewVideoUrl: "",
    curriculum: [],
    certificationEnabled: true,
    isPublished: false,
    priceTitle: "",
    price: "",
    priceDescription: "",
    priceSubDescription: "",
    priceFeatures: [""],
    priceButtonText: "Buy Now",
    priceFooterText: "",
  });

  useEffect(() => {
    if (courseId) {
      fetchCourse();
    }
  }, [courseId, isInstructor]);

  const fetchCourse = async () => {
    try {
      const apiPath = isInstructor ? `/api/instructor/courses/${courseId}` : `/api/admin/courses/${courseId}`;
      const response = await fetch(apiPath);
      const data = await response.json();
      if (data.ok && data.course) {
        setFormData({
          title: data.course.title,
          slug: data.course.slug,
          shortDescription: data.course.shortDescription,
          featuredImage: data.course.featuredImage || "",
          chapters: data.course.chapters,
          assessments: data.course.assessments,
          videos: data.course.videos,
          days: data.course.days,
          learnings: data.course.learnings,
          overviewVideoUrl: data.course.overviewVideoUrl,
          curriculum: data.course.curriculum,
          certificationEnabled: data.course.certificationEnabled,
          isPublished: data.course.isPublished,
          priceTitle: data.course.priceTitle || "",
          price: data.course.price || "",
          priceDescription: data.course.priceDescription || "",
          priceSubDescription: data.course.priceSubDescription || "",
          priceFeatures: data.course.priceFeatures && data.course.priceFeatures.length > 0 
            ? data.course.priceFeatures 
            : [""],
          priceButtonText: data.course.priceButtonText || "Buy Now",
          priceFooterText: data.course.priceFooterText || "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch course:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      title: value,
      slug: prev.slug || generateSlug(value),
    }));
  };

  const handleLearningChange = (index: number, value: string) => {
    setFormData((prev) => {
      const newLearnings = [...prev.learnings];
      newLearnings[index] = value;
      return { ...prev, learnings: newLearnings };
    });
  };

  const addLearning = () => {
    setFormData((prev) => ({
      ...prev,
      learnings: [...prev.learnings, ""],
    }));
  };

  const removeLearning = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      learnings: prev.learnings.filter((_, i) => i !== index),
    }));
  };

  const addChapter = () => {
    setFormData((prev) => ({
      ...prev,
      curriculum: [...prev.curriculum, { title: "", isPro: false, lessons: [] }],
    }));
  };

  const removeChapter = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      curriculum: prev.curriculum.filter((_, i) => i !== index),
    }));
  };

  const handleChapterChange = (index: number, field: keyof Chapter, value: any) => {
    setFormData((prev) => {
      const newCurriculum = [...prev.curriculum];
      newCurriculum[index] = { ...newCurriculum[index], [field]: value };
      return { ...prev, curriculum: newCurriculum };
    });
  };

  const addLesson = (chapterIndex: number) => {
    setFormData((prev) => {
      const newCurriculum = [...prev.curriculum];
      newCurriculum[chapterIndex].lessons = [
        ...newCurriculum[chapterIndex].lessons,
        { name: "", videoUrl: "" },
      ];
      return { ...prev, curriculum: newCurriculum };
    });
  };

  const removeLesson = (chapterIndex: number, lessonIndex: number) => {
    setFormData((prev) => {
      const newCurriculum = [...prev.curriculum];
      newCurriculum[chapterIndex].lessons = newCurriculum[chapterIndex].lessons.filter(
        (_, i) => i !== lessonIndex
      );
      return { ...prev, curriculum: newCurriculum };
    });
  };

  const handleLessonChange = (
    chapterIndex: number,
    lessonIndex: number,
    field: keyof Lesson,
    value: string
  ) => {
    setFormData((prev) => {
      const newCurriculum = [...prev.curriculum];
      newCurriculum[chapterIndex].lessons[lessonIndex] = {
        ...newCurriculum[chapterIndex].lessons[lessonIndex],
        [field]: value,
      };
      return { ...prev, curriculum: newCurriculum };
    });
  };

  const handlePriceFeatureChange = (index: number, value: string) => {
    setFormData((prev) => {
      const newPriceFeatures = [...prev.priceFeatures];
      newPriceFeatures[index] = value;
      return { ...prev, priceFeatures: newPriceFeatures };
    });
  };

  const addPriceFeature = () => {
    setFormData((prev) => ({
      ...prev,
      priceFeatures: [...prev.priceFeatures, ""],
    }));
  };

  const removePriceFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      priceFeatures: prev.priceFeatures.filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadPath = isInstructor ? "/api/instructor/upload" : "/api/admin/upload";
      const response = await fetch(uploadPath, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.ok && data.url) {
        setFormData((prev) => ({
          ...prev,
          featuredImage: data.url,
        }));
      } else {
        alert(data.message || "Failed to upload image");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image");
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      featuredImage: "",
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const basePath = isInstructor ? "/api/instructor/courses" : "/api/admin/courses";
      const url = courseId
        ? `${basePath}/${courseId}`
        : basePath;
      const method = courseId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.ok) {
        const redirectPath = isInstructor ? "/instructor/courses" : "/admin/courses";
        router.push(redirectPath);
      } else {
        alert(data.message || data.error || "Failed to save course");
        setIsSaving(false);
      }
    } catch (error) {
      console.error("Failed to save course:", error);
      alert("Failed to save course");
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-sm text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {courseId ? "Edit Course" : "Add New Course"}
        </h1>
        <Button
          variant="outline"
          onClick={() => router.push(isInstructor ? "/instructor/courses" : "/admin/courses")}
        >
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold">Basic Information</h2>
          
          <div className="space-y-2">
            <Label htmlFor="title">Course Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
              placeholder="e.g., WhatsApp Marketing Course"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, slug: e.target.value.toLowerCase() }))
              }
              required
              placeholder="e.g., whatsapp-marketing-course"
            />
            <p className="text-xs text-gray-500">
              URL-friendly identifier (auto-generated from title)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="shortDescription">Short Description *</Label>
            <Textarea
              id="shortDescription"
              value={formData.shortDescription}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, shortDescription: e.target.value }))
              }
              required
              rows={3}
              placeholder="Brief description shown on course page"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="overviewVideoUrl">Overview Video URL *</Label>
            <Input
              id="overviewVideoUrl"
              type="url"
              value={formData.overviewVideoUrl}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, overviewVideoUrl: e.target.value }))
              }
              required
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="featuredImage">Featured Image</Label>
            <div className="space-y-3">
              {formData.featuredImage ? (
                <div className="relative">
                  <div className="relative w-full h-48 md:h-64 border rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={formData.featuredImage}
                      alt="Featured image preview"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveImage}
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
                    id="featuredImage"
                    disabled={isUploading}
                  />
                  <label
                    htmlFor="featuredImage"
                    className="flex flex-col items-center justify-center cursor-pointer"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="h-8 w-8 animate-spin text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">Uploading...</p>
                      </>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600 mb-1">
                          Click to upload featured image
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 5MB
                        </p>
                      </>
                    )}
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Course Stats */}
        <div className="bg-white border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold">Course Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="chapters">Chapters</Label>
              <Input
                id="chapters"
                type="number"
                min="0"
                value={formData.chapters}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    chapters: parseInt(e.target.value) || 0,
                  }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="assessments">Assessments</Label>
              <Input
                id="assessments"
                type="number"
                min="0"
                value={formData.assessments}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    assessments: parseInt(e.target.value) || 0,
                  }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="videos">Videos</Label>
              <Input
                id="videos"
                type="number"
                min="0"
                value={formData.videos}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    videos: parseInt(e.target.value) || 0,
                  }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="days">Days</Label>
              <Input
                id="days"
                type="number"
                min="0"
                value={formData.days}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    days: parseInt(e.target.value) || 0,
                  }))
                }
                required
              />
            </div>
          </div>
        </div>

        {/* Learnings */}
        <div className="bg-white border rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">What You'll Learn</h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addLearning}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Learning
            </Button>
          </div>
          {formData.learnings.map((learning, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={learning}
                onChange={(e) => handleLearningChange(index, e.target.value)}
                placeholder="Enter learning point"
                required
                className="flex-1"
              />
              {formData.learnings.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeLearning(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Curriculum */}
        <div className="bg-white border rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Curriculum</h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addChapter}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Chapter
            </Button>
          </div>

          {formData.curriculum.map((chapter, chapterIndex) => (
            <div
              key={chapterIndex}
              className="border rounded-lg p-4 space-y-4"
            >
              <div className="flex items-center gap-4">
                <div className="flex-1 space-y-2">
                  <Label>Chapter Title</Label>
                  <Input
                    value={chapter.title}
                    onChange={(e) =>
                      handleChapterChange(chapterIndex, "title", e.target.value)
                    }
                    placeholder="Chapter 1: Introduction"
                    required
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id={`pro-${chapterIndex}`}
                    checked={chapter.isPro}
                    onChange={(e) =>
                      handleChapterChange(chapterIndex, "isPro", e.target.checked)
                    }
                    className="rounded"
                  />
                  <Label htmlFor={`pro-${chapterIndex}`}>Pro</Label>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeChapter(chapterIndex)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Lessons</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addLesson(chapterIndex)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Lesson
                  </Button>
                </div>
                {chapter.lessons.map((lesson, lessonIndex) => (
                  <div key={lessonIndex} className="space-y-2 border rounded p-3">
                    <div className="flex gap-2">
                      <Input
                        value={lesson.name}
                        onChange={(e) =>
                          handleLessonChange(
                            chapterIndex,
                            lessonIndex,
                            "name",
                            e.target.value
                          )
                        }
                        placeholder="Lesson name"
                        required
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeLesson(chapterIndex, lessonIndex)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Input
                      type="url"
                      value={lesson.videoUrl || ""}
                      onChange={(e) =>
                        handleLessonChange(
                          chapterIndex,
                          lessonIndex,
                          "videoUrl",
                          e.target.value
                        )
                      }
                      placeholder="Video URL (e.g., https://youtube.com/watch?v=...)"
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Price Section */}
        <div className="bg-white border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold">Pricing Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priceTitle">Price Title</Label>
              <Input
                id="priceTitle"
                value={formData.priceTitle}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, priceTitle: e.target.value }))
                }
                placeholder="e.g., Zero subscription, pay-as-you-go plan"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                value={formData.price}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, price: e.target.value }))
                }
                placeholder="e.g., 1499 (₹ and commas added automatically)"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priceDescription">Price Description</Label>
            <Input
              id="priceDescription"
              value={formData.priceDescription}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, priceDescription: e.target.value }))
              }
              placeholder="e.g., For Businesses who ONLY want to send bulk campaigns"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priceSubDescription">Price Sub Description</Label>
            <Textarea
              id="priceSubDescription"
              value={formData.priceSubDescription}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, priceSubDescription: e.target.value }))
              }
              placeholder="e.g., Cheapest plan if you send up to ~2,100 messages in 3 months."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Price Features</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addPriceFeature}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Feature
              </Button>
            </div>
            {formData.priceFeatures.map((feature, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={feature}
                  onChange={(e) => handlePriceFeatureChange(index, e.target.value)}
                  placeholder="Enter price feature"
                  className="flex-1"
                />
                {formData.priceFeatures.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removePriceFeature(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="priceButtonText">Button Text</Label>
            <Input
              id="priceButtonText"
              value={formData.priceButtonText}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, priceButtonText: e.target.value }))
              }
              placeholder="Buy Now"
            />
            <p className="text-xs text-gray-500">
              Button will automatically link to checkout page for this course
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priceFooterText">Footer Text</Label>
            <Input
              id="priceFooterText"
              value={formData.priceFooterText}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, priceFooterText: e.target.value }))
              }
              placeholder="e.g., One time fee, no recurring subscription"
            />
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold">Settings</h2>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="certificationEnabled"
              checked={formData.certificationEnabled}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  certificationEnabled: e.target.checked,
                }))
              }
              className="rounded"
            />
            <Label htmlFor="certificationEnabled">
              Enable Certification Line
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPublished"
              checked={formData.isPublished}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  isPublished: e.target.checked,
                }))
              }
              className="rounded"
            />
            <Label htmlFor="isPublished">Publish Course</Label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(isInstructor ? "/instructor/courses" : "/admin/courses")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSaving}
            className="bg-[#00E785] hover:bg-[#00d675] text-black"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Course
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

