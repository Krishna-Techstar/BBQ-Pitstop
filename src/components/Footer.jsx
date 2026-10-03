import React from 'react';
import { Flame, Phone, MapPin, MessageCircle, Heart } from 'lucide-react';
import { InstagramIcon } from './Icons';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer id="contact" className="bg-[#08080A] border-t border-[#222226] text-brand-cream/80 pt-16 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-red to-brand-flame p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-[#0B0B0B] rounded-[10px] flex items-center justify-center">
                  <Flame className="w-6 h-6 text-brand-red" />
                </div>
              </div>
              <div>
                <span className="font-display text-2xl tracking-wider text-white">BBQ PIT STOP</span>
                <p className="text-xs text-brand-flame font-semibold tracking-widest uppercase">CUSTOM SMOKER SIDECAR</p>
              </div>
            </div>
            
            <p className="text-sm text-brand-muted max-w-md leading-relaxed">
              Street-food BBQ smoked to slow perfection straight from our custom hand-crafted smoker sidecar motorcycle (Reg: MH.03.PT.741). Good meat takes time — come hungry, leave happy!
            </p>

            <div className="inline-block bg-[#161619] border border-brand-red/30 px-3 py-1.5 rounded-lg text-xs font-semibold text-brand-flame">
              *Come hungry, leave happy!
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://instagram.com/barbequepitstop"
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-[#18181B] hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 text-white text-xs font-semibold transition-all border border-[#2E2E34]"
              >
                <InstagramIcon className="w-4 h-4 text-pink-400" />
                <span>@barbequepitstop</span>
              </a>

              <a
                href="https://wa.me/918291794227?text=Hi%20BBQ%20Pit%20Stop,%20I%20want%20to%20order%20from%20Interdepartmental%20Cup!"
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-[#18181B] hover:bg-emerald-600 text-white text-xs font-semibold transition-all border border-[#2E2E34]"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp Us</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-heading text-base uppercase tracking-wider text-white font-bold border-l-2 border-brand-red pl-2">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-brand-muted">
              <li>
                <Link to="/menu" className="hover:text-brand-flame transition-colors">Complete Menu Card</Link>
              </li>
              <li>
                <a href="/#smoker-bike" className="hover:text-brand-flame transition-colors">Our Smoker Motorcycle</a>
              </li>
              <li>
                <a href="/#event-cup" className="hover:text-brand-flame transition-colors">Interdepartmental Cup 2.0</a>
              </li>
              <li>
                <a href="/#reviews" className="hover:text-brand-flame transition-colors">Student Reviews</a>
              </li>
              <li>
                <Link to="/admin" className="hover:text-brand-flame transition-colors">Stall Staff Portal</Link>
              </li>
            </ul>
          </div>

          {/* Event & Location details */}
          <div className="space-y-3">
            <h4 className="font-heading text-base uppercase tracking-wider text-white font-bold border-l-2 border-brand-flame pl-2">
              Live Location
            </h4>
            <div className="space-y-2.5 text-xs text-brand-muted">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
                <span>Bharati Vidyapeeth Deemed to be University, Sector 3, Belpada, Kharghar, Navi Mumbai</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-brand-flame shrink-0" />
                <a href="tel:+918291794227" className="text-brand-cream hover:underline font-semibold">
                  +91 8291794227
                </a>
              </div>
              <div className="p-2.5 rounded-lg bg-[#141416] border border-[#242428] text-amber-300">
                <p className="font-semibold">Event: Interdepartmental Cup 2.0</p>
                <p className="text-[11px] text-brand-muted">Serving daily from 11:30 AM till late evening match close!</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#1C1C20] flex flex-col sm:flex-row items-center justify-between text-xs text-brand-muted space-y-3 sm:space-y-0">
          <p>© {new Date().getFullYear()} BBQ Pit Stop. All rights reserved.</p>
          <p className="flex items-center space-x-1">
            <span>Smoked with</span>
            <Flame className="w-3.5 h-3.5 text-brand-red inline fill-brand-red" />
            <span>for Bharati Vidyapeeth College Fest</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
