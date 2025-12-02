"use client";

import { useState, useEffect } from "react";
import { Menu, X, Award, Play, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import CertificateRequest from "./CertificateRequest";

interface Lesson {
  name: string;
  videoUrl?: string;
}

interface Chapter {
  title: string;
  isPro: boolean;
  lessons: Lesson[];
}

interface CourseData {
  id: string;
  title: string;
  slug: string;
  curriculum: Chapter[];
  certificationEnabled: boolean;
}

export default function CoursePlayer({ courseSlug }: { courseSlug: string }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [course, setCourse] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedChapterIndex, setSelectedChapterIndex] = useState<number | null>(null);
  const [selectedLessonIndex, setSelectedLessonIndex] = useState<number | null>(null);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);
  const [showCertificateRequest, setShowCertificateRequest] = useState(false);
  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(new Set());
  const [progress, setProgress] = useState(0);

  // Convert YouTube URL to embed format
  const convertToEmbedUrl = (url: string): string => {
    if (!url) return url;
    
    // Check if already an embed URL
    if (url.includes("embed")) return url;
    
    // Extract video ID from various YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}`;
      }
    }
    
    // If no match, return original URL (might be Vimeo or other)
    return url;
  };

  useEffect(() => {
    async function fetchCourse() {
      try {
        setLoading(true);
        const response = await fetch(`/api/courses/${courseSlug}/player`);
        const data = await response.json();

        if (data.ok && data.course) {
          setCourse(data.course);
          // Expand all chapters by default
          const allChapters = new Set<number>(
            data.course.curriculum.map((_: any, index: number) => index)
          );
          setExpandedChapters(allChapters);
          
          // Calculate initial progress (for now, set to 0)
          setProgress(0);
          
          // Auto-select first lesson if available
          if (data.course.curriculum.length > 0) {
            const firstChapter = data.course.curriculum[0];
            if (firstChapter.lessons.length > 0) {
              setSelectedChapterIndex(0);
              setSelectedLessonIndex(0);
              const firstLesson = firstChapter.lessons[0];
              if (firstLesson.videoUrl) {
                // Convert YouTube URL to embed format
                const embedUrl = convertToEmbedUrl(firstLesson.videoUrl);
                setCurrentVideoUrl(embedUrl);
              }
            }
          }
        } else {
          console.error("Failed to fetch course:", data.message);
        }
      } catch (error) {
        console.error("Error fetching course:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCourse();
  }, [courseSlug]);

  const handleLessonClick = (chapterIndex: number, lessonIndex: number) => {
    setSelectedChapterIndex(chapterIndex);
    setSelectedLessonIndex(lessonIndex);
    const lesson = course?.curriculum[chapterIndex]?.lessons[lessonIndex];
    if (lesson?.videoUrl) {
      setCurrentVideoUrl(convertToEmbedUrl(lesson.videoUrl));
    } else {
      setCurrentVideoUrl(null);
    }
  };

  const handleCertificateClick = () => {
    setShowCertificateRequest(true);
  };

  const toggleChapter = (chapterIndex: number) => {
    setExpandedChapters((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(chapterIndex)) {
        newSet.delete(chapterIndex);
      } else {
        newSet.add(chapterIndex);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-sm text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold mb-2">Course not found</p>
          <p className="text-gray-600">You may not be enrolled in this course.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col bg-gray-50">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Toggle Button - Left Side */}
        <div className="flex items-start pt-4 pl-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="z-10"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Sidebar */}
        <div
          className={`${
            sidebarOpen ? "w-full md:w-80" : "w-0"
          } bg-white border-r transition-all duration-300 overflow-hidden flex flex-col`}
        >
          <div className="flex-1 overflow-y-auto flex flex-col">
            {/* Course Title - Inside Sidebar */}
            <div className="p-4 border-b bg-white sticky top-0 z-10">
              <h1 className="text-lg font-semibold line-clamp-2">{course.title}</h1>
              
              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span>Course Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#00E785] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Curriculum Section */}
            <div className="flex-1 overflow-y-auto p-4">
              <h2 className="text-sm font-semibold text-gray-500 uppercase mb-4">
                Course Curriculum
              </h2>

              <div className="space-y-2">
                {course.curriculum.map((chapter, chapterIndex) => {
                  const isExpanded = expandedChapters.has(chapterIndex);
                  return (
                    <div key={chapterIndex} className="border rounded-lg overflow-hidden">
                      {/* Chapter Header - Clickable */}
                      <button
                        onClick={() => toggleChapter(chapterIndex)}
                        className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4 text-gray-500 flex-shrink-0" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-gray-500 flex-shrink-0" />
                          )}
                          <h3 className="font-semibold text-sm text-gray-900 text-left truncate">
                            {chapter.title}
                          </h3>
                          {chapter.isPro && (
                            <span className="text-xs bg-[#00E785] text-black px-2 py-0.5 rounded font-semibold flex-shrink-0">
                              PRO
                            </span>
                          )}
                        </div>
                      </button>

                      {/* Lessons - Collapsible */}
                      {isExpanded && (
                        <div className="px-3 pb-3 space-y-1">
                          {chapter.lessons.map((lesson, lessonIndex) => {
                            const isSelected =
                              selectedChapterIndex === chapterIndex &&
                              selectedLessonIndex === lessonIndex;
                            return (
                              <button
                                key={lessonIndex}
                                onClick={() => handleLessonClick(chapterIndex, lessonIndex)}
                                className={`w-full text-left px-3 py-2 rounded text-sm transition-colors flex items-center gap-2 ${
                                  isSelected
                                    ? "bg-[#00E785] text-black font-medium"
                                    : "hover:bg-gray-100 text-gray-700"
                                }`}
                              >
                                <Play className="h-3 w-3 flex-shrink-0" />
                                <span className="flex-1 truncate">{lesson.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Certificate Section */}
              {course.certificationEnabled && (
                <div className="mt-6 pt-4 border-t">
                  <Button
                    onClick={handleCertificateClick}
                    className="w-full bg-[#00E785] hover:bg-[#00d675] text-black font-semibold"
                  >
                    <Award className="h-4 w-4 mr-2" />
                    Request Certificate
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Video Player Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {currentVideoUrl ? (
            <div className="flex-1 flex items-center justify-center bg-black">
              <div className="w-full h-full max-w-7xl mx-auto p-4">
                <div className="relative w-full h-full">
                  <iframe
                    src={currentVideoUrl}
                    className="w-full h-full rounded-lg"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-900">
              <div className="text-center text-white">
                <p className="text-lg font-semibold mb-2">No video available</p>
                <p className="text-gray-400">
                  Select a lesson from the sidebar to start watching
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Certificate Request Modal */}
      {showCertificateRequest && (
        <CertificateRequest
          courseId={course.id}
          courseTitle={course.title}
          onClose={() => setShowCertificateRequest(false)}
        />
      )}
    </div>
  );
}

