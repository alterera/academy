import { Facebook, Instagram, Linkedin, LucideIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

interface FooterLink {
  label: string;
  href: string;
}

interface FooterColumn {
  title: string;
  color: string;
  links: FooterLink[];
}

interface SocialLink {
  icon: LucideIcon;
  href: string;
  label: string;
}

interface LegalLink {
  label: string;
  href: string;
}

const footerColumns: FooterColumn[] = [
  {
    title: "Useful Links",
    color: "#4fc3ff",
    links: [
      { label: "Why Choose Us", href: "/features/item-1" },
      { label: "Testimonials", href: "/features/item-2" },
      { label: "Certification", href: "/features/item-3" },
      { label: "FAQs", href: "/features/item-4" },
    ],
  },
  {
    title: "Resources",
    color: "#e9a9f0",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "Tutorials", href: "/tutorials" },
      { label: "Blog", href: "/blog" },
      { label: "Support", href: "/support" },
      { label: "Community", href: "/community" },
    ],
  },
  {
    title: "Company",
    color: "#fee96e",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
      { label: "Partners", href: "/partners" },
      { label: "News", href: "/news" },
    ],
  },
  {
    title: "Legal",
    color: "#00e784",
    links: [
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Refund Policy", href: "/refund" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "Disclaimer", href: "/disclaimer" },
    ],
  },
];

// const legalLinks: LegalLink[] = [
//   { label: "Terms & Conditions", href: "/terms" },
//   { label: "Privacy Policy", href: "/privacy" },
//   { label: "Refund Policy", href: "/refund" },
// ];

const socialLinks: SocialLink[] = [
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
];

const Footer = () => {
  return (
    <div className="w-full bg-[#1d1d1b] pt-10 md:pt-20 px-4 md:px-0">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-5">
          {footerColumns.map((column, index) => (
            <div key={index} className="flex flex-col gap-3 md:gap-4">
              <h2
                className="text-lg md:text-xl font-bold"
                style={{ color: column.color }}
              >
                {column.title}
              </h2>
              <ul className="text-white leading-7 md:leading-8 text-sm md:text-base">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.href}
                      className="hover:text-gray-300 transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0 pt-10 md:pt-20 pb-6 md:pb-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 text-white text-sm md:text-base">
            <p className="font-semibold text-base md:text-lg">
              &copy; {new Date().getFullYear()} Alterera Networks. All Rights Reserved.
            </p>
          </div>

          <div className="flex items-center gap-3 md:gap-2">
            {socialLinks.map((social, index) => {
              const Icon = social.icon;
              return (
                <Link
                  key={index}
                  href={social.href}
                  className="hover:opacity-80 transition-opacity"
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon className="w-5 h-5 md:w-6 md:h-6" color="#00e784" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
