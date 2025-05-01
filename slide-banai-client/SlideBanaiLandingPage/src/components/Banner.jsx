import { motion } from 'framer-motion';
import { ArrowRightIcon, PlayIcon } from '@heroicons/react/24/outline';

const Banner = () => {
  const textVariants = {
    initial: { 
      x: -20,
      opacity: 0,
      scale: 0.8
    },
    animate: { 
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3,
        yoyo: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const gradientVariants = {
    initial: {
      backgroundPosition: "0% 50%"
    },
    animate: {
      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      transition: {
        duration: 5,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-primary/10 to-secondary/10 py-20 pt-32 overflow-hidden">
      {/* Background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.1 }}
          transition={{ duration: 1 }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-primary rounded-full blur-3xl"
        />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 text-center lg:text-left"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-6xl font-bold mb-6"
            >
              Create Amazing Presentations with{' '}
              <motion.span
                variants={textVariants}
                initial="initial"
                animate="animate"
                whileHover="hover"
                className="inline-block"
              >
                <motion.span
                  variants={gradientVariants}
                  initial="initial"
                  animate="animate"
                  className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent bg-[length:200%_auto]"
                >
                  SlideBanai
                </motion.span>
              </motion.span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0"
            >
              The all-in-one platform for creating, managing, and improving your presentations with AI-powered tools.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <button className="btn-primary">
                Get Started
                <ArrowRightIcon className="w-5 h-5 inline-block ml-2" />
              </button>
              <button className="btn-secondary flex items-center justify-center">
                <PlayIcon className="w-5 h-5 mr-2" />
                Watch Demo
              </button>
            </motion.div>
          </motion.div>

          {/* Right content - Hero image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex-1"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl transform rotate-6"></div>
              <div className="relative bg-white p-4 rounded-2xl shadow-xl">
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                    alt="Presentation Dashboard"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary rounded-full"></div>
                    <div>
                      <p className="font-medium">Presentation Dashboard</p>
                      <p className="text-sm text-gray-500">Real-time analytics</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-500">Live</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Banner; 