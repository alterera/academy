"use client";

import React from "react";

interface CourseOverviewProps {
  overviewVideoUrl: string;
}

const CourseOverview: React.FC<CourseOverviewProps> = ({ overviewVideoUrl }) => {
  // Extract video ID from common video URLs
  const getVideoEmbedUrl = (url: string): string => {
    // YouTube
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }

    // Vimeo
    const vimeoRegex = /(?:vimeo\.com\/)(?:.*\/)?(\d+)/;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }

    // If it's already an embed URL, return as is
    if (url.includes('embed') || url.includes('player')) {
      return url;
    }

    // Default: return original URL (for direct video files)
    return url;
  };

  const embedUrl = getVideoEmbedUrl(overviewVideoUrl);

  return (
    <div className="w-full py-10 md:py-20 px-4 md:px-0">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-6 md:gap-5 items-center">
        <div className="flex-1 w-full md:w-auto">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold pb-4 md:pb-5">
            Overview
          </h2>
          <p className="text-sm md:text-base lg:text-lg text-muted-foreground">
            Uncover the transformative power of WhatsApp Business for connecting
            with customers, brought to you with insightful guidance from Wati.
            Check out the course overview below.
          </p>
        </div>

        <div className="flex-1 w-full md:w-auto flex justify-center md:justify-end">
          <div className="relative w-full max-w-full md:max-w-[400px] lg:max-w-[500px] h-[200px] md:h-[250px] lg:h-[300px] rounded-lg overflow-hidden">
            {embedUrl.includes('youtube.com/embed') || embedUrl.includes('vimeo.com/video') || embedUrl.includes('player') ? (
              <iframe
                src={embedUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Course Overview Video"
              />
            ) : (
              <video
                src={embedUrl}
                controls
                className="w-full h-full object-contain"
              >
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseOverview;
