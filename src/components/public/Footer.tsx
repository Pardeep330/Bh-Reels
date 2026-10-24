import React from "react";
import Link from "next/link";
import { BHLogo } from "../common/BHLogo";
import { ShieldCheck, Instagram, Mail, Phone, MapPin, Sparkles } from "lucide-react";

export const PublicFooter: React.FC = () => {
  return (
    <footer className="bg-white border-t border-[#D4AF37]/20 text-slate-600 text-xs shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Col 1: Brand Info */}
        <div className="space-y-4">
          <BHLogo size="md" />
          <p className="text-slate-500 leading-relaxed text-[11px]">
            BH Reels is India's premier influencer network & reel distribution platform connecting top content creators with visionary movie producers & global brands.
          </p>
          <div className="flex items-center gap-2 text-[11px] text-[#B8860B] font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>2-Step Verified Secure Network</span>
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Navigation</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="hover:text-[#B8860B] transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link href="/influencers" className="hover:text-[#B8860B] transition-colors">
                Browse Influencers
              </Link>
            </li>
            <li>
              <Link href="/select-influencers" className="hover:text-[#B8860B] transition-colors">
                Reel Price Estimator
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-[#B8860B] transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-[#B8860B] transition-colors">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Legal & Trust */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Legal & Compliance</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/privacy" className="hover:text-[#B8860B] transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-[#B8860B] transition-colors">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link href="/user/login" className="hover:text-[#B8860B] transition-colors">
                Producer Portal Login
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Contact Info */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Head Office</h4>
          <div className="space-y-2 text-[11px] text-slate-600">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#B8860B] shrink-0 mt-0.5" />
              <span>BH Team Studios, Sec 08, Chandigarh , 160009</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#B8860B] shrink-0" />
              <a href="mailto:bhreels.offical@gmail.com" className="hover:text-[#B8860B] transition-colors">
                bhreels.offical@gmail.com
              </a>
            </div>
            <div className="flex items-start gap-2">
              <Phone className="w-4 h-4 text-[#B8860B] shrink-0 mt-0.5" />
              <div className="flex flex-col">
                <a href="tel:+919779886200" className="hover:text-[#B8860B] transition-colors">+91 9779886200</a>
                <a href="tel:+918284814341" className="hover:text-[#B8860B] transition-colors">+91 8284814341</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 py-6 text-center text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto px-4">
        <div>© 2026 BH Reels (BH Team). All rights reserved.</div>
        <div className="flex items-center gap-4 mt-2 sm:mt-0 text-[#B8860B]">
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
