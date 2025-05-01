import { motion } from 'framer-motion';
import { 
  PresentationChartLineIcon, 
  UserGroupIcon, 
  DocumentTextIcon, 
  ChartBarIcon, 
  CameraIcon, 
  RectangleGroupIcon 
} from '@heroicons/react/24/outline';
import Navbar from './components/Navbar';
import Banner from './components/Banner';
import FeaturesSection from './components/FeaturesSection';
import FAQ from './components/FAQ';

function App() {
  const features = [
    {
      icon: <PresentationChartLineIcon className="w-8 h-8 text-primary" />,
      title: "Presentation Management",
      description: "Create, organize, and access your presentations with ease. Collaborate with others seamlessly."
    },
    {
      icon: <UserGroupIcon className="w-8 h-8 text-primary" />,
      title: "Presentation Coaching",
      description: "Enhance your delivery and speaking skills with our AI-powered coaching tools."
    },
    {
      icon: <RectangleGroupIcon className="w-8 h-8 text-primary" />,
      title: "Template Library",
      description: "Access a variety of professional templates to get started quickly."
    },
    {
      icon: <DocumentTextIcon className="w-8 h-8 text-primary" />,
      title: "Note Upload",
      description: "Upload and organize your presentation notes in one place."
    },
    {
      icon: <ChartBarIcon className="w-8 h-8 text-primary" />,
      title: "Performance Analytics",
      description: "Track key metrics like content coverage, pace, clarity, and eye contact."
    },
    {
      icon: <CameraIcon className="w-8 h-8 text-primary" />,
      title: "Practice Mode",
      description: "Practice your presentations using your camera and receive instant feedback."
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <Banner />
      <FeaturesSection />
      <FAQ />

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Presentations?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who are already using SlideBanai to create better presentations.
            </p>
            <button className="bg-white text-primary px-8 py-4 rounded-lg font-medium hover:bg-gray-100 transition-all duration-300">
              Start Your Free Trial
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">SlideBanai</h3>
              <p className="text-gray-400">Create amazing presentations with AI-powered tools.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Features</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Presentation Management</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">AI Coaching</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Templates</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
            <p>© 2025 SlideBanai. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App; 