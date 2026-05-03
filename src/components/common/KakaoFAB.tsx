"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export default function KakaoFAB() {
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-8 right-8 z-40 w-14 h-14 bg-[#FEE500] text-[#3c1e1e] rounded-full flex items-center justify-center shadow-lg cursor-pointer"
    >
      <MessageCircle className="w-7 h-7 fill-current" />
    </motion.button>
  );
}
