import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Portfolio() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const message = form.message.value;
    
    const mailtoLink = `mailto:anshumand108@gmail.com?subject=Portfolio Contact from ${name}&body=Name: ${name}%0AEmail: ${email}%0A%0AMessage:%0A${message}`;
    
    window.location.href = mailtoLink;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-x-hidden">
      {/* Header / Navigation */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50"
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-2xl font-bold cursor-pointer"
            onClick={() => scrollToSection('home')}
          >
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              AD
            </span>
          </motion.div>

{/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {[
              { name: 'Home', id: 'home' },
              { name: 'About', id: 'about' },
              { name: 'Education', id: 'education' },
              { name: 'Skills', id: 'skills' },
              { name: 'Projects', id: 'projects' },
              { name: 'Contact', id: 'contact' },
            ].map((item, index) => (
              <motion.button
                key={item.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (index + 1) }}
                onClick={() => scrollToSection(item.id)}
                whileHover={{ scale: 1.1, color: '#60a5fa' }}
                whileTap={{ scale: 0.95 }}
                className="text-slate-300 hover:text-blue-400 transition-colors font-medium relative group"
              >
                {item.name}
                <motion.span
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 origin-left"
                />
              </motion.button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="md:hidden text-slate-300 p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </motion.button>
        </div>
      </motion.header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            {/* Menu Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-64 bg-slate-900/95 backdrop-blur-md z-50 md:hidden pt-20 px-6"
            >
<nav className="flex flex-col gap-4">
                {[
                  { name: 'Home', id: 'home' },
                  { name: 'About', id: 'about' },
                  { name: 'Education', id: 'education' },
                  { name: 'Skills', id: 'skills' },
                  { name: 'Projects', id: 'projects' },
                  { name: 'Contact', id: 'contact' },
                ].map((item, index) => (
                  <motion.button
                    key={item.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => {
                      scrollToSection(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className="text-left text-lg text-slate-300 hover:text-blue-400 transition-colors font-medium py-3 px-4 rounded-lg hover:bg-slate-800/50"
                  >
                    {item.name}
                  </motion.button>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

{/* Animated Background with Code Logos */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
        
        {/* Floating Code Logo 1 - Top Left */}
        <motion.div
          animate={{ 
            y: [0, -30, 0],
            rotate: [0, 15, 0, -15, 0],
            x: [0, 10, 0, -10, 0]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-24 left-16 text-4xl opacity-30"
        >
          <span className="text-purple-400 font-mono">{'<'}</span><span className="text-blue-400 font-mono">/</span><span className="text-purple-400 font-mono">{'>'}</span>
        </motion.div>
        
        {/* Floating Code Logo 2 - Top Right */}
        <motion.div
          animate={{ 
            y: [0, 25, 0],
            rotate: [0, -20, 0, 20, 0]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute top-32 right-20 text-3xl opacity-25"
        >
          <span className="text-cyan-400 font-mono">{'{'}</span><span className="text-indigo-400 font-mono">{'}'}</span>
        </motion.div>
        
        {/* Floating Code Logo 3 - Middle Left */}
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-1/3 left-1/4 text-3xl opacity-20"
        >
          <span className="text-green-400 font-mono">#</span>
        </motion.div>
        
        {/* Floating Code Logo 4 - Middle Right */}
        <motion.div
          animate={{ 
            y: [0, 35, 0],
            x: [0, -15, 0]
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
          className="absolute top-1/2 right-1/4 text-4xl opacity-25"
        >
          <span className="text-pink-400 font-mono">={'{'}{'}'}</span>
        </motion.div>
        
        {/* Floating Code Logo 5 - Bottom Left */}
        <motion.div
          animate={{ 
            y: [0, -25, 0],
            rotate: [0, 10, 0, -10, 0]
          }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          className="absolute bottom-32 left-20 text-3xl opacity-30"
        >
          <span className="text-amber-400 font-mono">={'>'}</span>
        </motion.div>
        
        {/* Floating Code Logo 6 - Bottom Right */}
        <motion.div
          animate={{ 
            y: [0, 30, 0],
            scale: [1, 1.15, 1]
          }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          className="absolute bottom-24 right-16 text-4xl opacity-25"
        >
          <span className="text-blue-400 font-mono">{'<'}</span><span className="text-purple-400 font-mono">/</span><span className="text-blue-400 font-mono">{'>'}</span>
        </motion.div>
        
        {/* Floating Code Logo 7 - Random Position */}
        <motion.div
          animate={{ 
            y: [0, -18, 0],
            rotate: [0, -12, 0, 12, 0]
          }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-2/3 left-1/3 text-2xl opacity-20"
        >
          <span className="text-cyan-400 font-mono">[ ]</span>
        </motion.div>
        
        {/* Floating Code Logo 8 - Another Position */}
        <motion.div
          animate={{ 
            y: [0, 22, 0],
            x: [0, 8, 0, -8, 0]
          }}
          transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
          className="absolute top-40 left-1/2 text-2xl opacity-20"
        >
          <span className="text-green-400 font-mono">( )</span>
        </motion.div>
        
        {/* Floating Code Logo 9 - Near Center */}
        <motion.div
          animate={{ 
            y: [0, -28, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
          className="absolute top-1/4 right-1/3 text-3xl opacity-25"
        >
          <span className="text-pink-400 font-mono">{'/*'}</span><span className="text-purple-400 font-mono">{'*/'}</span>
        </motion.div>
        
        {/* Floating Code Logo 10 - Bottom Middle */}
        <motion.div
          animate={{ 
            y: [0, 18, 0],
            rotate: [0, 8, 0, -8, 0]
          }}
          transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut", delay: 1.8 }}
          className="absolute bottom-1/3 left-1/2 text-2xl opacity-20"
        >
          <span className="text-amber-400 font-mono">&amp;&amp;</span>
        </motion.div>
      </div>

      {/* Hero Section */}
      <section id="home" className="py-16 pt-28 sm:py-20 md:pt-32 flex flex-col md:flex-row items-center justify-center gap-8 sm:gap-16 relative z-10 pb-16">
        {/* 3D Profile Image with Enhanced Effects */}
        <motion.div
          initial={{ rotateY: -30, rotateX: 15, opacity: 0, scale: 0.5 }}
          animate={{ rotateY: 0, rotateX: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, type: "spring", stiffness: 80, damping: 20 }}
          whileHover={{ rotateY: 20, rotateX: -10, scale: 1.08 }}
          style={{ perspective: "2000px" }}
          className="relative"
        >
          {/* Glowing Ring */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-3xl border-2 border-blue-400/30"
            style={{ transform: "rotate(45deg)" }}
          ></motion.div>
          
          {/* Main 3D Card */}
          <div className="relative w-56 h-64 sm:w-72 sm:h-80 md:w-80 md:h-96 rounded-3xl"
            style={{ 
              transformStyle: "preserve-3d",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px rgba(59, 130, 246, 0.3)"
            }}>
            {/* Image with 3D transform */}
            <img
              src="/profile.jpg"
              alt="Anshuman Das"
              className="w-full h-full object-cover rounded-3xl"
              style={{ transform: "translateZ(30px)" }}
            />
            {/* Glass overlay */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-blue-500/10 to-purple-500/10" style={{ transform: "translateZ(40px)" }}></div>
            
            {/* Floating decorative elements */}
            <motion.div 
              animate={{ y: [-10, 10, -10], x: [5, -5, 5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-80" 
              style={{ transform: "translateZ(60px)", filter: "blur(2px)" }}
            ></motion.div>
            <motion.div 
              animate={{ y: [15, -15, 15], x: [-8, 8, -8] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-5 -left-5 w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-70" 
              style={{ transform: "translateZ(50px)", filter: "blur(2px)" }}
            ></motion.div>
            <motion.div 
              animate={{ y: [-5, 15, -5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute top-1/2 -right-3 w-4 h-4 bg-cyan-400 rounded-full opacity-60" 
              style={{ transform: "translateZ(45px)" }}
            ></motion.div>
          </div>
          
          {/* Animated Shadow */}
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-56 h-12 bg-black/40 rounded-[100%] blur-2xl"
          ></motion.div>
        </motion.div>

        {/* Hero Text with Staggered Animation */}
        <div className="text-center md:text-left max-w-2xl">
<motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex items-center justify-center md:justify-start gap-4"
          >
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 font-medium text-sm"
            >
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Accepting New Projects
            </motion.span>
            
            {/* Animated Code Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 200, damping: 15 }}
              className="relative flex items-center gap-2"
            >
              {/* Code Tag Logo </> */}
              <motion.div
                animate={{ 
                  y: [0, -8, 0],
                  rotate: [0, 5, 0, -5, 0]
                }}
                transition={{ 
                  y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                  rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                }}
                className="text-3xl font-bold text-blue-400 font-mono"
              >
                <span className="text-purple-400">{'<'}</span><span className="text-blue-400">/</span><span className="text-purple-400">{'>'}</span>
              </motion.div>
              
              {/* Curly Brackets { } */}
              <motion.div
                animate={{ 
                  y: [0, -6, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  y: { duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 },
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }
                }}
                className="text-2xl font-bold text-indigo-400 font-mono"
              >
                <span className="text-cyan-400">{'{'}</span><span className="text-indigo-400">{'}'}</span>
              </motion.div>
              
              {/* Terminal Icon */}
              <motion.div
                animate={{ 
                  y: [0, -5, 0],
                  rotate: [0, -3, 0, 3, 0]
                }}
                transition={{ 
                  y: { duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
                  rotate: { duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
                }}
                className="text-2xl"
              >
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </motion.div>
              
              {/* Hash # */}
              <motion.div
                animate={{ 
                  y: [0, -7, 0],
                  scale: [1, 1.15, 1]
                }}
                transition={{ 
                  y: { duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.7 },
                  scale: { duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.7 }
                }}
                className="text-2xl font-bold text-pink-400 font-mono"
              >
                #
              </motion.div>
              
              {/* Arrow => */}
              <motion.div
                animate={{ 
                  y: [0, -6, 0],
                  x: [0, 3, 0, -3, 0]
                }}
                transition={{ 
                  y: { duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.4 },
                  x: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.4 }
                }}
                className="text-xl font-bold text-amber-400 font-mono"
              >
                ={'>'}
              </motion.div>
              
              {/* Glow effect */}
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-blue-500/30 blur-xl rounded-full -z-10"
              />
            </motion.div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-7xl font-extrabold mt-6 leading-tight"
          >
            Hi, I'm{" "}
            <motion.span 
              className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent"
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] 
              }}
              transition={{ duration: 5, repeat: Infinity }}
              style={{ backgroundSize: "200% 200%" }}
            >
              Anshuman Das
            </motion.span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-lg sm:text-xl md:text-2xl mt-6 text-blue-200/80"
          >
            Full-Stack Developer specializing in React, Java & Machine Learning | Founder and CEO of  <a href="https://www.learnexia.in/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-400 hover:underline hover:text-blue-300 transition">Learnexia</a>
          </motion.p>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-lg mt-4 text-slate-300"
          >
            Building powerful web applications and intelligent solutions that solve real-world problems.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
          >
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(59, 130, 246, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToSection('projects')}
              className="w-full sm:w-auto rounded-2xl px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-lg"
            >
              View Projects
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05, backgroundColor: "rgba(59, 130, 246, 0.1)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToSection('contact')}
              className="w-full sm:w-auto rounded-2xl px-8 py-4 border-2 border-blue-400/50 text-blue-300 font-semibold"
            >
              Contact Me
            </motion.button>
          </motion.div>
          
          {/* Social Links with Icons */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex gap-6 mt-8 justify-center md:justify-start"
          >
            <motion.a
              href="https://github.com/anshumandas998"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2, y: -3 }}
              className="text-slate-400 hover:text-blue-400 transition-colors"
              aria-label="GitHub"
            >
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </motion.a>
            <motion.a
              href="https://www.linkedin.com/in/anshuman-das-95846828a/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2, y: -3 }}
              className="text-slate-400 hover:text-blue-400 transition-colors"
              aria-label="LinkedIn"
            >
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </motion.a>
            <motion.a
              href="https://x.com/AnshumanDa89069"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2, y: -3 }}
              className="text-slate-400 hover:text-blue-400 transition-colors"
              aria-label="Twitter/X"
            >
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <motion.section
        id="about"
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
        className="py-40 md:py-48 pt-40 md:pt-48 max-w-6xl mx-auto px-4 md:px-6 relative z-10"
        style={{ scrollMarginTop: '100px' }}
      >
        {/* Left-aligned About Me Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-left mb-12"
        >
          <h2 className="text-4xl font-bold">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">About Me</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mt-4 rounded-full"></div>
        </motion.div>
        
        {/* About Content - Text Left, PC Right */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* About Text Content - Left Side */}
          <div className="max-w-xl space-y-6">
              <motion.p 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                className="text-xl leading-relaxed text-slate-300"
              >
I'm Anshuman Das, a passionate Full-Stack Developer with expertise in React, Java, Python, Machine Learning, Cybersecurity, and Backend Development. I build powerful web applications and intelligent solutions that solve real-world problems.
              </motion.p>
              <motion.p 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                viewport={{ once: true }}
                className="text-xl leading-relaxed text-slate-300"
              >
                With a strong foundation in both frontend and backend technologies, I specialize in creating scalable, secure, and user-friendly applications. From smart parking systems to AI-powered trip planners, I love tackling challenging projects that combine modern frontend technologies with robust backend architectures and machine learning capabilities.
              </motion.p>
              <motion.p 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                viewport={{ once: true }}
                className="text-xl leading-relaxed text-slate-300"
              >
                My expertise extends to cybersecurity practices, ensuring that all applications I build follow security best practices and protect user data. I stay updated with the latest security threats and mitigation strategies to deliver secure solutions.
              </motion.p>
              <motion.p 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                viewport={{ once: true }}
                className="text-xl leading-relaxed text-slate-300"
              >
                I am the Founder & Chief Executive Officer of <a href="https://www.learnexia.in/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-400 hover:underline hover:text-blue-300 transition">Learnexia</a>, an education-focused initiative dedicated to empowering students with practical skills and industry-relevant knowledge. I lead the vision, strategy, and growth of the platform, overseeing planning, development, branding, and operations to deliver impactful learning experiences.
              </motion.p>
              <motion.p 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                viewport={{ once: true }}
                className="text-xl leading-relaxed text-slate-300"
              >
                Beyond education, we also design and develop modern, responsive websites to help individuals and businesses build a strong digital presence. From concept to deployment, I work closely with clients to understand their needs and deliver solutions that exceed expectations.
              </motion.p>
          </div>

          {/* 3D Laptop/PC Visual - Right Side */}
          <motion.div
            initial={{ rotateX: -20, opacity: 0, y: 50 }}
            whileInView={{ rotateX: 0, opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1, type: "spring" }}
            viewport={{ once: true }}
            style={{ perspective: "1000px" }}
            className="relative hidden md:block"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="relative w-full max-w-lg mx-auto h-72 rounded-2xl bg-slate-800/90 border border-slate-600"
                style={{ 
                  transform: "rotateX(10deg) translateZ(20px)",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)"
                }}>
                <div className="p-4 h-full overflow-hidden">
                  <div className="flex gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex gap-2">
                      <span className="text-purple-400">import</span>
                      <span className="text-blue-400">React</span>
                      <span className="text-slate-400">from</span>
                      <span className="text-green-400">'react'</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-purple-400">const</span>
                      <span className="text-yellow-400">Developer</span>
                      <span className="text-slate-400">=</span>
                      <span className="text-blue-400">{'() => {'}</span>
                    </div>
                    <div className="pl-4 flex gap-2">
                      <span className="text-purple-400">return</span>
                      <span className="text-blue-400">(</span>
                    </div>
                    <div className="pl-8 text-pink-400">{'<'}</div>
                    <div className="pl-12 flex gap-2">
                      <span className="text-purple-400">h1</span>
                      <span className="text-slate-400">{'>'}</span>
                      <span className="text-green-400">Anshuman Das</span>
                      <span className="text-slate-400">{'</'}</span>
                      <span className="text-purple-400">h1</span>
                      <span className="text-slate-400">{'>'}</span>
                    </div>
                    <div className="pl-4 text-blue-400">{');'}</div>
                    <div className="text-blue-400">{'}'}</div>
                    <div className="flex gap-2 mt-2">
                      <span className="text-purple-400">export</span>
                      <span className="text-blue-400">default</span>
                      <span className="text-yellow-400">Developer</span>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent rounded-2xl pointer-events-none"></div>
                </div>
              </div>
              <div className="w-full max-w-lg mx-auto h-4 bg-slate-700 rounded-b-xl"
                style={{ transform: "translateZ(0px) rotateX(60deg)", boxShadow: "0 10px 20px rgba(0,0,0,0.3)" }}
              ></div>
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-20 h-8 bg-slate-600 rounded"
                style={{ transform: "translateZ(1px) rotateX(60deg)" }}
              ></div>
            </motion.div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute -top-8 -right-8 w-16 h-16 border-2 border-dashed border-blue-400/30 rounded-full"
            ></motion.div>
            <motion.div
              animate={{ y: [-5, 5, -5], x: [3, -3, 3] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -bottom-4 -left-4 w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg opacity-70"
              style={{ filter: "blur(2px)" }}
            ></motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Education Section */}
      <motion.section
        id="education"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-16 md:py-24 pt-16 md:pt-24 bg-slate-800/50 relative z-10"
        style={{ scrollMarginTop: '100px' }}
      >
        <div className="max-w-5xl mx-auto px-6">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-4 text-center"
          >
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Education</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-slate-400 text-center mb-12"
          >
            My Academic Journey
          </motion.p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
{
                institution: "GIET University",
                location: "Gunupur, Odisha",
                degree: "B-Tech in Computer Science & Engineering",
                year: "2023 - 2027",
                icon: "🎓",
                gradient: "from-blue-500 to-cyan-500",
                description: "Bachelor of Technology in Computer Science & Engineering"
              },
              {
                institution: "JHADESWAR SCIENCE RESIDENTIAL HIGHER SECONDARY SCHOOL",
                location: "Balasore, Odisha",
                degree: "12th Science",
                year: "2021 - 2023",
                icon: "📚",
                gradient: "from-indigo-500 to-purple-500",
                description: "Higher Secondary Education"
              },
              {
                institution: "KB Nodal High School",
                location: "Tapandia, Odisha",
                degree: "Schooling",
                year: "2021",
                icon: "🏫",
                gradient: "from-green-500 to-teal-500",
                description: "Primary & Secondary Education"
              },
            ].map((edu, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, rotateX: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6, type: "spring" }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <div className="relative bg-slate-800/90 border border-slate-600/50 rounded-2xl p-6 backdrop-blur-sm overflow-hidden h-full">
                  {/* Animated gradient background */}
                  <motion.div
                    animate={{ 
                      backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
                    }}
                    transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                    className={`absolute inset-0 bg-gradient-to-br ${edu.gradient} opacity-0 group-hover:opacity-15 transition-opacity duration-500`}
                    style={{ backgroundSize: "200% 200%" }}
                  />
                  
                  {/* Icon with floating animation */}
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }}
                    className="relative z-10 text-5xl mb-4"
                  >
                    {edu.icon}
                  </motion.div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <motion.h3 
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: index * 0.2 + 0.3 }}
                      className="text-xl font-bold text-white mb-2"
                    >
                      {edu.institution}
                    </motion.h3>
                    <p className="text-blue-400 font-medium mb-1">{edu.degree}</p>
                    <p className="text-slate-400 text-sm mb-2">{edu.description}</p>
                    <p className="text-slate-500 text-sm">{edu.location}</p>
                    
                    {/* Year badge */}
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: index * 0.2 + 0.5, type: "spring" }}
                      className="mt-4 inline-block px-3 py-1 rounded-full text-xs font-medium bg-slate-700/50 text-blue-300 border border-slate-600"
                    >
                      {edu.year}
                    </motion.div>
                  </div>
                  
                  {/* Decorative corner accent */}
                  <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                    className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl ${edu.gradient} opacity-20 rounded-bl-full`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

{/* Skills Section */}
      <motion.section
        id="skills"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-16 md:py-24 pt-16 md:pt-24 bg-slate-800/50 relative z-10"
        style={{ scrollMarginTop: '100px' }}
      >
        <div className="max-w-5xl mx-auto px-6">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-4 text-center"
          >
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Skills & Technologies</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-slate-400 text-center mb-12"
          >
            Technologies I work with
          </motion.p>
          
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-6">
            {[
              { name: "Python", icon: "🐍", color: "from-yellow-400 to-green-400", bg: "bg-yellow-500/20" },
              { name: "Java", icon: "☕", color: "from-red-500 to-orange-500", bg: "bg-red-500/20" },
              { name: "React", icon: "⚛️", color: "from-cyan-400 to-blue-500", bg: "bg-cyan-500/20" },
              { name: "HTML", icon: "🌐", color: "from-orange-500 to-red-500", bg: "bg-orange-500/20" },
              { name: "CSS", icon: "🎨", color: "from-blue-400 to-indigo-500", bg: "bg-blue-500/20" },
              { name: "Next.js", icon: "▲", color: "from-slate-300 to-slate-500", bg: "bg-slate-500/20" },
              { name: "JavaScript", icon: "📜", color: "from-yellow-400 to-amber-500", bg: "bg-yellow-500/20" },
              { name: "Cybersecurity", icon: "🔐", color: "from-green-400 to-emerald-500", bg: "bg-green-500/20" },
            ].map((skill, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.1, y: -5 }}
                className="group"
              >
                <div className={`relative ${skill.bg} border border-slate-600/50 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 backdrop-blur-sm hover:border-slate-500 transition-all duration-300 overflow-hidden`}>
                  {/* Animated background gradient */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className={`absolute inset-0 bg-gradient-to-br ${skill.color} opacity-10`}
                  />
                  
                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    className="relative z-10 text-4xl"
                  >
                    {skill.icon}
                  </motion.div>
                  
                  {/* Name */}
                  <span className="relative z-10 text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                    {skill.name}
                  </span>
                  
                  {/* Glow effect on hover */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1.5 }}
                    transition={{ duration: 0.3 }}
                    className={`absolute inset-0 bg-gradient-to-br ${skill.color} opacity-0 group-hover:opacity-20 blur-xl`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Projects Section */}
      <motion.section
        id="projects"
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-16 md:py-24 pt-16 md:pt-24 max-w-6xl mx-auto px-4 md:px-6 relative z-10"
        style={{ scrollMarginTop: '100px' }}
      >
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold mb-12 text-center"
        >
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Featured Projects</span>
        </motion.h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              title: "Car Parking Hub",
              description: "A smart parking management system that helps users find and reserve parking spots in real-time.",
              tech: "React | Java | Database",
              gradient: "from-blue-500 to-cyan-500",
              icon: "🅿️"
            },
            {
              title: "Car Buy & Sell",
              description: "A marketplace platform connecting car buyers and sellers with advanced search and listing features.",
              tech: "Full-Stack | React | API",
              gradient: "from-indigo-500 to-purple-500",
              icon: "🚗"
            },
            {
              title: "House Price Prediction",
              description: "Machine learning model that predicts house prices based on various features using Python and advanced algorithms.",
              tech: "Python | ML | Data Science",
              gradient: "from-purple-500 to-pink-500",
              icon: "🏠"
            },
            {
              title: "AI Trip Planner",
              description: "An intelligent travel planning assistant that creates personalized itineraries using AI and machine learning.",
              tech: "AI | Python | React",
              gradient: "from-cyan-500 to-blue-500",
              icon: "✈️"
            },
          ].map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, rotate: index % 2 === 0 ? -3 : 3 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="relative rounded-2xl overflow-hidden bg-slate-800/80 border border-slate-700 backdrop-blur-sm">
                {/* Project Image with Animation */}
                <motion.div 
                  initial={{ scale: 1.2, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  viewport={{ once: true }}
                  className={`relative h-48 bg-gradient-to-br ${project.gradient} flex items-center justify-center overflow-hidden`}
                >
                  {/* Animated background pattern */}
                  <motion.div 
                    animate={{ 
                      backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 opacity-30"
                    style={{ 
                      backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)`,
                      backgroundSize: "200% 200%"
                    }}
                  />
                  {/* Project Icon */}
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    className="relative z-10 text-8xl"
                  >
                    {project.icon}
                  </motion.div>
                  {/* Floating particles */}
                  <motion.div
                    animate={{ y: [-10, 10, -10], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                    className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full blur-sm"
                  />
                  <motion.div
                    animate={{ y: [10, -10, 10], opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 4, repeat: Infinity, delay: index * 0.3 }}
                    className="absolute bottom-4 left-4 w-6 h-6 bg-white/20 rounded-full blur-sm"
                  />
                </motion.div>
                
                {/* Gradient border effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${project.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none`}></div>
                
                <div className="relative z-10 p-6">
                  <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all">
                    {project.title}
                  </h3>
                  <p className="mb-4 text-slate-300">{project.description}</p>
                  <span className="inline-block px-4 py-1 rounded-full text-sm bg-slate-700/50 text-blue-300 border border-slate-600">
                    {project.tech}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

{/* Quick Contact Info Section */}
<motion.section
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
  viewport={{ once: true }}
  className="py-20 bg-slate-900/60 relative z-10 border-t border-slate-800"
>
  <div className="max-w-4xl mx-auto px-6 text-center">

    <motion.h2
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="text-4xl font-bold mb-12"
    >
      <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        Get In Touch
      </span>
    </motion.h2>

    <div className="flex flex-col md:flex-row justify-center items-center gap-10">

      {/* Phone */}
      <motion.div
        whileHover={{ scale: 1.1, y: -5 }}
        className="flex items-center gap-4 bg-slate-800/70 px-8 py-5 rounded-2xl border border-slate-700 backdrop-blur-md"
      >
        <motion.div
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-3xl"
        >
          📞
        </motion.div>
        <div className="text-left">
          <p className="text-sm text-slate-400">Phone</p>
          <p className="text-lg font-semibold text-white">
            +91 9556699769
          </p>
        </div>
      </motion.div>

      {/* Email */}
      <motion.div
        whileHover={{ scale: 1.1, y: -5 }}
        className="flex items-center gap-4 bg-slate-800/70 px-8 py-5 rounded-2xl border border-slate-700 backdrop-blur-md"
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          className="text-3xl"
        >
          ✉️
        </motion.div>
        <div className="text-left">
          <p className="text-sm text-slate-400">Email</p>
          <p className="text-lg font-semibold text-white">
            anshumand108@gmail.com
          </p>
        </div>
      </motion.div>

    </div>
  </div>
</motion.section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="text-center py-8 text-slate-500 border-t border-slate-800"
      >
        <p>© 2026 Anshuman Das. All rights reserved.</p>
      </motion.footer>
    </div>
  );
}

