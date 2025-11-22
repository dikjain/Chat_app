import React from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import logo from "@/assets/logo.png";

export default function Footer() {
  const footerLinks = {
    Product: [
      { name: "Features", href: "#features" },
      { name: "Pricing", href: "#pricing" },
      { name: "Updates", href: "#updates" },
      { name: "Security", href: "#security" }
    ],
    Company: [
      { name: "About", href: "#about" },
      { name: "Blog", href: "#blog" },
      { name: "Careers", href: "#careers" },
      { name: "Contact", href: "#contact" }
    ]
  };

  const socialLinks = [
    {
      name: "LinkedIn",
      icon: FaLinkedin,
      url: "https://www.linkedin.com/in/dikshit-mahanot-723b012a3/",
      color: "hover:text-blue-500"
    },
    {
      name: "X (Twitter)",
      icon: FaXTwitter,
      url: "https://x.com/mahanot_dikshit/",
      color: "hover:text-white"
    },
    {
      name: "GitHub",
      icon: FaGithub,
      url: "https://github.com/dikjain/chat_app",
      color: "hover:text-gray-300"
    }
  ];

  return (
    <footer className="bg-black/5 text-white py-12 px-16 relative bottom-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-8">
          {/* Logo and Description - Left Side */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src={logo} 
                alt="Company Logo" 
                className="h-8 w-8 object-contain opacity-90 hover:opacity-100 transition-opacity duration-300"
              />
              <span className="text-lg font-medium font-inter">Chat-ly</span>
            </div>
            <p className="text-sm text-gray-400 font-inter mb-4">
              Better way to talk, smarter way to connect.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-gray-500 ${link.color} transition-all duration-300 transform hover:scale-110`}
                    aria-label={link.name}
                  >
                    <Icon className="text-xl" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Footer Links Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="md:col-span-1">
              <h3 className="text-sm font-semibold font-inter mb-4 text-neutral-500">
                {title}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-400 font-inter hover:text-neutral-500 transition-colors duration-300"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-300 pt-8">
          <p className="text-sm text-gray-500 font-inter text-center">
            © {new Date().getFullYear()} Chat-ly. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

