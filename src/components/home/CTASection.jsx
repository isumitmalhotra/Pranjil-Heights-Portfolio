import React, { useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { ChevronRight, Phone, Download, FileText, PlayCircle, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react';
import { H2 } from '../ui/Typography';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { homeVideosAPI } from '../../services/api';

const getYouTubeVideoId = (url = '') => {
  const match = String(url).match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
  return match ? match[1] : '';
};

export const CTASection = () => {
  const scrollerRef = useRef(null);

  const { data: latestVideosResponse } = useQuery({
    queryKey: ['home-latest-videos'],
    queryFn: () => homeVideosAPI.getLatest(),
    staleTime: 2 * 60 * 1000,
  });

  const latestVideos = Array.isArray(latestVideosResponse?.data)
    ? latestVideosResponse.data.slice(0, 5)
    : [];
  const placeholderFrames = Array.from({ length: 5 }, (_, index) => ({
    id: `placeholder-${index + 1}`,
    title: `Latest Video ${index + 1}`,
  }));
  const hasVideos = latestVideos.length > 0;
  const videosToRender = hasVideos ? latestVideos : placeholderFrames;

  const scrollByCards = (direction) => {
    if (!scrollerRef.current) return;
    const cardWidth = window.innerWidth >= 1024 ? 226 : window.innerWidth >= 768 ? 206 : 186;
    scrollerRef.current.scrollBy({
      left: direction * cardWidth,
      behavior: 'smooth',
    });
  };

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-linear-to-br from-[#0F2A44] via-[#1B2A4A] to-[#243B63]" />
      
      {/* Animated Background Elements */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-0 left-1/4 w-150 h-150 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(37,99,235,0.2) 0%, transparent 70%)',
          filter: 'blur(100px)',
        }}
      />
      
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        className="absolute bottom-0 right-1/4 w-125 h-125 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)',
          filter: 'blur(100px)',
        }}
      />
      
      {/* Decorative Lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-orange-400/40 to-transparent" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <H2 className="mb-6 text-4xl md:text-5xl lg:text-6xl text-white">
              Ready to Partner <br />
              <span className="text-orange-400">With Us?</span>
            </H2>
            
            <p className="text-slate-200 mb-10 max-w-2xl mx-auto text-lg">
              Connect with our business development team to discuss dealership opportunities, 
              bulk orders, or project requirements.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="flex flex-col sm:flex-row justify-center gap-4 mb-12"
          >
            <Link to="/contact">
              <Button variant="primary" size="xl" icon={ChevronRight}>
                Request Quotation
              </Button>
            </Link>
            <a href="/catalogue.pdf" download>
              <Button variant="outline" size="xl" icon={Download} iconPosition="left" className="border-white text-white hover:bg-blue-300/16 hover:border-white">
                Download Catalogue
              </Button>
            </a>
            <a href="tel:+919813027070">
              <Button variant="glass" size="xl" icon={Phone} iconPosition="left" className="bg-blue-300/16 border-white/25 text-white hover:bg-blue-300/25">
                Call Now
              </Button>
            </a>
          </motion.div>

          {/* Quick Contact Options */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-8 text-sm text-slate-200"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>Business Hours: 9 AM - 6 PM IST</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>Technical specs available</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Pan-India delivery network</span>
            </div>
          </motion.div>
        </div>

        {/* Section Break */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0.9 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-10 mb-8"
        >
          <div className="relative h-px w-full bg-linear-to-r from-transparent via-white/35 to-transparent" />
          <div className="mt-4 flex justify-center">
            <div className="h-2 w-24 rounded-full bg-linear-to-r from-transparent via-orange-400/85 to-transparent" />
          </div>
        </motion.div>

        {/* Latest Videos */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-12"
        >
          <div className="text-center mb-5">
            <h3 className="text-2xl md:text-[2rem] font-bold text-white tracking-wide">CHECK OUR LATEST VIDEO</h3>
            <div className="mt-2 inline-flex items-center gap-3 text-sm text-slate-300">
              <span className="w-6 h-1 rounded-full bg-orange-500" />
              <span>Video</span>
              <span className="w-6 h-1 rounded-full bg-orange-500" />
            </div>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => scrollByCards(-1)}
              className="absolute left-0 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full border border-white/25 bg-[#0e2440]/80 text-white hover:bg-[#18365a] transition-colors z-10 md:hidden"
              aria-label="Previous videos"
            >
              <ChevronLeft className="w-4 h-4 mx-auto" />
            </button>

            <button
              type="button"
              onClick={() => scrollByCards(1)}
              className="absolute right-0 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full border border-white/25 bg-[#0e2440]/80 text-white hover:bg-[#18365a] transition-colors z-10 md:hidden"
              aria-label="Next videos"
            >
              <ChevronRightIcon className="w-4 h-4 mx-auto" />
            </button>

            <div
              ref={scrollerRef}
              className="flex gap-3 overflow-x-auto px-10 pb-2 snap-x snap-mandatory md:grid md:grid-cols-5 md:gap-3 md:px-0 md:overflow-visible md:snap-none"
            >
              {videosToRender.map((video) => {
                const videoId = hasVideos ? getYouTubeVideoId(video.videoUrl) : '';
                const fallbackThumb = videoId
                  ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
                  : '';
                const thumbnail = hasVideos ? (video.thumbnailUrl || fallbackThumb) : '';

                const frameBody = (
                  <motion.div
                    whileHover={{ y: -4, scale: 1.02 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="relative aspect-10/16 w-40 sm:w-44 md:w-full overflow-hidden rounded-sm border border-white/18 bg-linear-to-b from-white/10 to-white/5 shadow-lg"
                  >
                    {thumbnail ? (
                      <img
                        src={thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0">
                        <div className="absolute inset-0 bg-linear-to-br from-orange-500/15 via-sky-400/10 to-blue-600/15" />
                        <div className="absolute inset-0 animate-pulse bg-linear-to-r from-transparent via-white/5 to-transparent" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/25 group-hover:bg-black/35 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <PlayCircle className={`w-12 h-12 ${hasVideos ? 'text-orange-400' : 'text-white/80'} drop-shadow-lg`} />
                    </div>
                  </motion.div>
                );

                return hasVideos ? (
                  <a
                    key={video.id}
                    href={video.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block flex-none snap-center md:flex-auto md:min-w-0"
                  >
                    {frameBody}
                    <p className="mt-2 text-xs md:text-sm font-medium text-slate-100 line-clamp-2">{video.title}</p>
                  </a>
                ) : (
                  <div key={video.id} className="group block flex-none snap-center md:flex-auto md:min-w-0">
                    {frameBody}
                    <p className="mt-2 text-xs md:text-sm font-medium text-slate-300 line-clamp-2">{video.title}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

