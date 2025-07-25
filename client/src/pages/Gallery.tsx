import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useArtworks } from "@/hooks/use-artworks";
import ArtworkLightbox from "@/components/ArtworkLightbox";
import type { Artwork } from "@shared/schema";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet-async";

export default function Gallery() {
  const { data: artworks, isLoading } = useArtworks();
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [, setLocation] = useLocation();

  const sliderArtworks = artworks?.filter(artwork => artwork.showInSlider) || [];

  const openLightbox = useCallback((artwork: Artwork) => {
    setSelectedArtwork(artwork);
    setIsLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false);
    setTimeout(() => setSelectedArtwork(null), 300);
  }, []);

  useEffect(() => {
    if (sliderArtworks.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % sliderArtworks.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [sliderArtworks.length]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xl font-playfair"
        >
          Chargement de la galerie...
        </motion.div>
      </div>
    );
  }

  if (!artworks || artworks.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <h2 className="text-3xl font-playfair mb-4">Galerie en préparation</h2>
          <p className="text-lg opacity-80">Les œuvres seront bientôt disponibles.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Galerie - Ivan Gauthier</title>
        <meta name="description" content="Découvrez la galerie d'œuvres contemporaines d'Ivan Gauthier : peintures, expositions, œuvres phares et univers artistique unique." />
      </Helmet>
      <AnimatePresence>
        <section className="relative w-full h-[90vh] overflow-hidden">
          {/* Slider principal : sur mobile, pas d'images à gauche/droite */}
          {sliderArtworks.length > 0 ? (
            <AnimatePresence mode="wait">
              {sliderArtworks[currentSlideIndex] && (
                <motion.div
                  key={`slider-${currentSlideIndex}-${sliderArtworks[currentSlideIndex]?.id || 'fallback'}`}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ 
                    duration: 1.2,
                    ease: [0.45, 0, 0.55, 1]
                  }}
                  className="absolute inset-0"
                >
                  <img 
                    src={sliderArtworks[currentSlideIndex]?.imageUrl} 
                    alt={sliderArtworks[currentSlideIndex]?.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />
                </motion.div>
              )}
            </AnimatePresence>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black" />
          )}
          {/* Les flèches ou images latérales sont désactivées sur mobile (rien à faire car il n'y en a pas dans ce code) */}
          {/* Nom centré mobile */}
          <div className="md:hidden absolute top-1/2 left-1/2 z-20 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none select-none w-full px-4">
            <h1 className="text-4xl xs:text-5xl font-playfair text-white mb-2 tracking-wider uppercase">IVAN GAUTHIER</h1>
            <p className="text-base text-white opacity-80 tracking-[0.2em] uppercase mb-4">Artiste Contemporain</p>
            {/* Bouton 'Voir les œuvres phares' mobile uniquement */}
            <div className="flex justify-center w-full mb-2 pointer-events-auto select-auto md:hidden">
              <a
                href="/galerie/phares"
                className="relative text-lg font-semibold text-white/90 hover:text-blue-400 transition-colors duration-200 underline-offset-8 decoration-2 flex items-center gap-2 bg-black/30 px-5 py-2 rounded-lg shadow-lg"
                style={{textDecoration: 'none'}}
              >
                <span className="animate-wiggle">Voir les œuvres phares</span>
                <span className="inline-block animate-bounce-slow opacity-70">
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="6" y="2" width="10" height="18" rx="5" fill="none" stroke="#e5e7eb" strokeWidth="2"/>
                    <circle cx="11" cy="7" r="1.2" fill="#e5e7eb"/>
                  </svg>
                </span>
              </a>
            </div>
          </div>
          {/* Nom centré desktop */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8,
              delay: 0.5,
              ease: [0.19, 1, 0.22, 1]
            }}
            className="hidden md:block absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center z-10"
          >
            <h1 className="text-6xl md:text-8xl font-playfair text-white mb-4 tracking-wider">IVAN GAUTHIER</h1>
            <p className="text-xl text-white opacity-80 tracking-[0.3em] uppercase">Artiste Contemporain</p>
            <div className="flex justify-center w-full mt-8">
              <a
                href="/galerie/phares"
                className="relative text-lg md:text-xl font-semibold text-white/90 hover:text-blue-400 transition-colors duration-200 underline-offset-8 decoration-2 flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                style={{textDecoration: 'none'}}
                aria-label="Voir les œuvres phares"
              >
                <span className="animate-wiggle">Voir les œuvres phares</span>
                <span className="inline-block animate-bounce-slow opacity-70">
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="6" y="2" width="10" height="18" rx="5" fill="none" stroke="#e5e7eb" strokeWidth="2"/>
                    <circle cx="11" cy="7" r="1.2" fill="#e5e7eb"/>
                  </svg>
                </span>
              </a>
            </div>
          </motion.div>
        </section>

        <section className="bg-black py-20">
          <div className="w-full max-w-[2000px] mx-auto">
            <div className="masonry-grid">
              {artworks.map((artwork, index) => (
                <motion.div
                  key={`artwork-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ 
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] }
                  }}
                  viewport={{ once: true, margin: "-10%" }}
                  className="artwork-card group cursor-pointer"
                  onClick={() => openLightbox(artwork)}
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={artwork.imageUrl}
                      alt={artwork.title}
                      loading="lazy"
                      className="w-full h-auto object-cover"
                    />
                    <div 
                      className={`absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 ease-out${isLightboxOpen ? ' hide-on-mobile' : ''}`}
                    >
                      <h3 className="text-xl font-playfair mb-1">{artwork.title}</h3>
                      <p className="text-sm opacity-90">{artwork.technique} • {artwork.year}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <ArtworkLightbox
          artwork={selectedArtwork}
          isOpen={isLightboxOpen}
          onClose={closeLightbox}
        />
      </AnimatePresence>
    </>
  );
}
