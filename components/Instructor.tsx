import { Linkedin, Twitter, Github, Globe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface InstructorProps {
  name: string;
  about?: string;
  image?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    website?: string;
  };
}

const Instructor: React.FC<InstructorProps> = ({
  name,
  about,
  image,
  socialLinks = {},
}) => {
  return (
    <div className="w-full py-20 px-4">
      <div
        className="max-w-4xl mx-auto rounded-xl p-8"
        style={{
          background:
            "linear-gradient(180deg, #E3F5FF 0%, rgba(255, 255, 255, 0.1) 100%)",
        }}
      >
        <div className="flex flex-col items-center gap-10">
          <Image
            src={image || "/instructor.png"}
            height={200}
            width={200}
            alt={name}
            className="rounded-full border-2 border-white object-cover"
          />
          <div className="text-center">
            <p className="nunito uppercase pb-2 text-[#606060]">
              Course Instructor
            </p>
            <h2 className="text-2xl md:text-4xl font-bold mb-2">{name}</h2>
            {about && <p className="pb-3 text-gray-700 max-w-2xl">{about}</p>}
            {(socialLinks.linkedin ||
              socialLinks.twitter ||
              socialLinks.github ||
              socialLinks.website) && (
              <div className="flex gap-4 justify-center mt-4">
                {socialLinks.linkedin && (
                  <Link
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-70 transition-opacity"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-6 w-6 text-gray-700" />
                  </Link>
                )}
                {socialLinks.twitter && (
                  <Link
                    href={socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-70 transition-opacity"
                    aria-label="Twitter"
                  >
                    <Twitter className="h-6 w-6 text-gray-700" />
                  </Link>
                )}
                {socialLinks.github && (
                  <Link
                    href={socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-70 transition-opacity"
                    aria-label="GitHub"
                  >
                    <Github className="h-6 w-6 text-gray-700" />
                  </Link>
                )}
                {socialLinks.website && (
                  <Link
                    href={socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-70 transition-opacity"
                    aria-label="Website"
                  >
                    <Globe className="h-6 w-6 text-gray-700" />
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Instructor;
