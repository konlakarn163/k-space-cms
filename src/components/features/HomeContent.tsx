'use client';

import { motion } from 'framer-motion';

export default function HomeContent({ user }: { user: any }) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 100, damping: 15 } 
    }
  };

  return (
    <motion.main 
      variants={container}
      initial="hidden"
      animate="show"
      className="min-h-screen p-8 bg-white dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col items-center justify-center transition-colors duration-500"
    >
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-500/10 dark:bg-blue-600/5 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-emerald-500/10 dark:bg-emerald-600/5 blur-[120px] rounded-full" />
      </div>

      <motion.h1 
        variants={item}
        className="relative text-5xl font-black tracking-tight mb-10 text-center"
      >
        <span className="bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-blue-400 dark:to-emerald-400 bg-clip-text text-transparent">
          Konlakarn Community
        </span>
      </motion.h1>

      {user ? (
        <motion.div 
          variants={item}
          whileHover={{ y: -5 }}
          className="relative z-10 p-8 w-full max-w-md bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 backdrop-blur-xl rounded-3xl shadow-2xl flex flex-col items-center gap-6"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.4 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-emerald-500 blur-lg opacity-20 dark:opacity-40 rounded-full" />
            <img 
              src={user.user_metadata.avatar_url} 
              className="relative w-24 h-24 rounded-full border-4 border-white dark:border-slate-800 shadow-xl" 
              alt="profile" 
            />
          </motion.div>
          
          <div className="text-center">
            <motion.p 
              variants={item}
              className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mb-1"
            >
              Member Verified
            </motion.p>
            <motion.h2 
              variants={item}
              className="text-3xl font-bold text-slate-800 dark:text-slate-100"
            >
              {user.user_metadata.full_name}
            </motion.h2 >
          </div>

          <motion.div variants={item} className="w-full pt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-slate-900 dark:bg-emerald-500 hover:bg-black dark:hover:bg-emerald-600 text-white font-bold rounded-2xl shadow-lg transition-all"
            >
              Create New Post
            </motion.button>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div variants={item} className="text-center z-10">
          <p className="text-slate-600 dark:text-slate-400 mb-6 text-lg">
            Share your experience with the world.
          </p>
          <motion.a 
            href="/login"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-full font-bold shadow-xl transition-all"
          >
            Join Now
          </motion.a>
        </motion.div>
      )}
    </motion.main>
  );
}