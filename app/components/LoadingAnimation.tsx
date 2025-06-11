import { motion } from "framer-motion";
import { Bot } from "lucide-react";

interface LoadingAnimationProps {
  phase: "searching" | "generating" | null;
  countdown: number;
}

export const LoadingAnimation = ({
  phase,
  countdown,
}: LoadingAnimationProps) => {
  if (!phase) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start"
    >
      <div className="flex items-start space-x-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-teal-600 flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div className="glass rounded-2xl p-4 bg-gray-700/50 border-gray-600/30">
          {phase === "searching" ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-white">
                汇金知识库搜索中... {countdown}s
              </span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: 0,
                  }}
                  className="w-2 h-2 bg-blue-400 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: 0.2,
                  }}
                  className="w-2 h-2 bg-blue-400 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: 0.4,
                  }}
                  className="w-2 h-2 bg-blue-400 rounded-full"
                />
              </div>
              <span className="text-white">生成中...</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
