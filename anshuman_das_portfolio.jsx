import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-white text-gray-900 p-6">
      {/* Hero Section */}
      <section className="py-20 flex flex-col md:flex-row items-center justify-center gap-12">
        {/* 3D Profile Image */}
        <motion.div
          initial={{ rotateY: -15, rotateX: 5, opacity: 0 }}
          animate={{ rotateY: 0, rotateX: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          whileHover={{ rotateY: 10, rotateX: -5, scale: 1.05 }}
          className="" style={{ perspective: "1000px" }}
        >
          <div className="relative w-72 h-80 md:w-80 md:h-96 rounded-3xl overflow-hidden shadow-2xl">
            <img
              src="/profile.jpg"
              alt="Anshuman Das"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/30 to-transparent"></div>
          </div>
        </motion.div>

        {/* Hero Text */}
        <div className="text-center md:text-left max-w-xl">
          <p className="text-blue-700 font-semibold bg-white/60 backdrop-blur-md inline-flex items-center gap-2 px-5 py-2 rounded-full border border-blue-200 shadow-sm">Accepting new clients</p>
          <h1 className="text-5xl md:text-6xl font-extrabold mt-4 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 bg-clip-text text-transparent">Hi, I'm Anshuman Das</h1>
          <p className="text-xl mt-4">
            Full-Stack Developer specializing in React, Java & Machine Learning — building powerful web applications and intelligent solutions.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Button className="rounded-2xl px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:scale-105 transition">View Projects</Button>
            <Button variant="outline" className="rounded-2xl px-6 border-blue-400 text-blue-600 hover:bg-blue-50 transition">Contact Me</Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-16 max-w-4xl mx-auto"
      >
        <h2 className="text-3xl font-bold mb-6">About Me</h2>
        <p className="text-lg leading-relaxed">
          I'm Anshuman Das, a passionate Full-Stack Developer with expertise in React, Java, Python, and Machine Learning. I build powerful web applications and intelligent solutions that solve real-world problems.
        </p>
        <p className="text-lg leading-relaxed mt-4">
          From smart parking systems to AI-powered trip planners, I love tackling challenging projects that combine modern frontend technologies with robust backend architectures and machine learning capabilities.
        </p>
        <p className="text-lg leading-relaxed mt-4">
          I am also the Founder of <a href="https://learnexia.in" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-700 hover:underline hover:text-blue-900 transition">Learnexia</a>, a company focused on delivering quality tech education, innovative digital solutions, and professional development opportunities for students and businesses.
        </p>
      </motion.section>

      {/* Skills Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="py-16 bg-blue-50 rounded-3xl"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Technical Skills</h2>
          {[
            { name: "React Development", level: 95 },
            { name: "Java Full-Stack", level: 92 },
            { name: "Python & ML", level: 88 },
            { name: "Database & Backend", level: 90 },
          ].map((skill, index) => (
            <div key={index} className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="font-medium">{skill.name}</span>
                <span>{skill.level}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  transition={{ duration: 1 }}
                  viewport={{ once: true }}
                  className="bg-blue-600 h-3 rounded-full"
                />
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Projects Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-16 max-w-6xl mx-auto"
      >
        <h2 className="text-3xl font-bold mb-10 text-center">Featured Projects</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {[
            {
              title: "Car Parking Hub",
              description:
                "A smart parking management system that helps users find and reserve parking spots in real-time.",
              tech: "React | Java | Database",
            },
            {
              title: "Car Buy & Sell",
              description:
                "A marketplace platform connecting car buyers and sellers with advanced search and listing features.",
              tech: "Full-Stack | React | API",
            },
            {
              title: "House Price Prediction",
              description:
                "Machine learning model that predicts house prices based on various features using Python and advanced algorithms.",
              tech: "Python | ML | Data Science",
            },
            {
              title: "AI Trip Planner",
              description:
                "An intelligent travel planning assistant that creates personalized itineraries using AI and machine learning.",
              tech: "AI | Python | React",
            },
          ].map((project, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="transition"
            >
              <Card className="rounded-2xl shadow-xl border border-blue-200 bg-white">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  <p className="mb-4">{project.description}</p>
                  <p className="text-sm text-gray-500">{project.tech}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Contact Section */}
      <section className="py-16 bg-blue-100 max-w-4xl mx-auto rounded-3xl p-8">
        <h2 className="text-3xl font-bold mb-6 text-center">Let's Work Together</h2>
        <form className="grid gap-4">
          <input
            type="text"
            placeholder="Your Name"
            className="p-3 border rounded-2xl"
          />
          <input
            type="email"
            placeholder="your@email.com"
            className="p-3 border rounded-2xl"
          />
          <textarea
            placeholder="Tell me about your project..."
            rows="5"
            className="p-3 border rounded-2xl"
          ></textarea>
          <Button className="rounded-2xl">Send Message</Button>
        </form>
        <div className="flex justify-center gap-6 mt-6">
          <a href="https://github.com/anshumandas998" target="_blank">GitHub</a>
          <a href="https://www.linkedin.com/in/anshuman-das-95846828a/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-700 transition">LinkedIn</a>
        </div>
      </section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="text-center py-6 text-sm text-gray-500"
      >
        © 2026 Anshuman Das. All rights reserved.
      </motion.footer>
    </div>
  );
}
