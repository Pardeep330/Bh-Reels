import React from "react";
import Link from "next/link";
import { BHLogo } from "../common/BHLogo";
import { ShieldCheck, Instagram, Mail, Phone, MapPin, Sparkles } from "lucide-react";

export const PublicFooter: React.FC = () => {
  return (
    <footer className="bg-[#060709] border-t border-[#D4AF37]/20 text-gray-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Col 1: Brand Info */}
        <div className="space-y-4">
          <BHLogo size="md" />
          <p className="text-gray-400 leading-relaxed text-[11px]">
            BH Reels is India's premier influencer network & reel distribution platform connecting top content creators with visionary movie producers & global brands.
          </p>
          <div className="flex items-center gap-2 text-[11px] text-[#D4AF37]">
            <ShieldCheck className="w-4 h-4" />
            <span>2-Step Verified Secure Network</span>
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Navigation</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="hover:text-[#D4AF37] transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link href="/influencers" className="hover:text-[#D4AF37] transition-colors">
                Browse Influencers
              </Link>
            </li>
            <li>
              <Link href="/select-influencers" className="hover:text-[#D4AF37] transition-colors">
                Reel Price Estimator
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-[#D4AF37] transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-[#D4AF37] transition-colors">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Legal & Trust */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Legal & Compliance</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/privacy" className="hover:text-[#D4AF37] transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-[#D4AF37] transition-colors">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link href="/user/login" className="hover:text-[#D4AF37] transition-colors">
                Producer Portal Login
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Contact Info */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Head Office</h4>
          <div className="space-y-2 text-[11px] text-gray-400">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>BH Team Studios, BKC, Mumbai, Maharashtra 400051</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>contact@bhreels.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>+91 98765 43210</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-900 py-6 text-center text-[11px] text-gray-500 flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto px-4">
        <div>© 2026 BH Reels (BH Team). All rights reserved.</div>
        <div className="flex items-center gap-4 mt-2 sm:mt-0 text-[#C5A059]">
          <Link href="/privacy" className="hover:underline">
            Privacy
          </Link>
          <span>•</span>
          <Link href="/terms" className="hover:underline">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
};
