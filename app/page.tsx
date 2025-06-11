"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles, MessageSquare, Cpu } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import toast, { Toaster } from "react-hot-toast";
import type { ComponentPropsWithoutRef } from "react";
import { LoadingAnimation } from "./components/LoadingAnimation";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface ChatResponse {
  message: string;
  sessionId: string;
  success: boolean;
  error?: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState<
    "searching" | "generating" | null
  >(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(40);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (loadingPhase === "searching" && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setLoadingPhase("generating");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [loadingPhase, countdown]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setLoadingPhase("searching");
    setCountdown(40);

    // Start the chat request immediately
    const chatPromise = fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: userMessage.content,
        sessionId,
      }),
    });

    // Start the knowledge base search animation
    const searchPromise = new Promise((resolve) => setTimeout(resolve, 40000));

    try {
      // Wait for both the chat response and the search animation
      const [chatResponse, _] = await Promise.all([chatPromise, searchPromise]);
      const data: ChatResponse = await chatResponse.json();

      if (data.success) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.message,
          role: "assistant",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setSessionId(data.sessionId);
      } else {
        toast.error(data.error || "发送失败，请重试");
      }
    } catch (error) {
      console.error("发送消息失败:", error);
      toast.error("网络错误，请检查连接");
    } finally {
      setIsLoading(false);
      setLoadingPhase(null);
      setCountdown(40);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setSessionId(null);
    toast.success("对话已清空");
  };

  return (
    <div className="min-h-screen bg-gray-800 relative overflow-hidden">
      {/* 科技感背景 */}
      <div className="tech-bg"></div>
      <Toaster position="top-right" />

      {/* 主容器 */}
      <div className="relative z-10 flex flex-col h-screen overflow-hidden">
        {/* 头部 */}
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass border-b border-white/10 p-4 flex-shrink-0"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600"
              >
                <Cpu className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">
                  汇小金智能体Agent
                </h1>
                <p className="text-sm text-gray-400">基于DeepSeek的AI助手</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearChat}
                className="px-4 py-2 glass rounded-lg text-sm hover:bg-white/20 transition-colors"
              >
                清空对话
              </motion.button>
            </div>
          </div>
        </motion.header>

        {/* 主内容区 */}
        <div className="flex-1 flex max-w-7xl mx-auto w-full overflow-hidden">
          {/* 侧边栏 - 二维码区域 */}
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="w-80 p-6 glass border-r border-white/10 hidden lg:block flex-shrink-0"
          >
            <h2 className="text-xl font-semibold mb-6 gradient-text">
              语音通话入口
            </h2>
            <div className="space-y-6">
              {/* 二维码区域 */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="p-4 glass rounded-xl hover:bg-white/10 transition-colors text-center"
              >
                <div className="w-32 h-32 bg-white rounded-lg p-3 mx-auto mb-4">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(
                      "https://video.aliyuncs.com/aicall?token=eyJSZXF1ZXN0SWQiOiI1RTI1MzlEMi0zN0QzLTU5MTUtOTY0Qi03OTYzQUYyQzI5OTAiLCJXb3JrZmxvd1R5cGUiOiJWb2ljZUNoYXQiLCJUZW1wb3JhcnlBSUFnZW50SWQiOiJjYzJiMDYwNzEzNGQ0MjdiYjg1NDAyMTE3NGJlMjM1YiIsIkV4cGlyZVRpbWUiOiIyMDI1LTA2LTEyIDAzOjM1OjE0IiwiTmFtZSI6IkVRenRlWHhqIiwiUmVnaW9uIjoiY24taGFuZ3pob3UifQ=="
                    )}`}
                    alt="语音通话二维码"
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-sm text-gray-300 mb-4">扫码进入语音通话</p>
              </motion.div>

              {/* 直接访问按钮 */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    window.open(
                      "https://video.aliyuncs.com/aicall?token=eyJSZXF1ZXN0SWQiOiI1RTI1MzlEMi0zN0QzLTU5MTUtOTY0Qi03OTYzQUYyQzI5OTAiLCJXb3JrZmxvd1R5cGUiOiJWb2ljZUNoYXQiLCJUZW1wb3JhcnlBSUFnZW50SWQiOiJjYzJiMDYwNzEzNGQ0MjdiYjg1NDAyMTE3NGJlMjM1YiIsIkV4cGlyZVRpbWUiOiIyMDI1LTA2LTEyIDAzOjM1OjE0IiwiTmFtZSI6IkVRenRlWHhqIiwiUmVnaW9uIjoiY24taGFuZ3pob3UifQ==",
                      "_blank"
                    );
                  }}
                  className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg text-white font-medium hover:shadow-lg transition-shadow flex items-center justify-center space-x-2"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>直接语音通话</span>
                </motion.button>
              </motion.div>
            </div>
          </motion.aside>

          {/* 聊天区域 */}
          <main className="flex-1 flex flex-col min-h-0">
            {/* 消息列表 */}
            <div className="flex-1 overflow-y-auto p-6">
              {messages.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-20"
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="inline-block p-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 mb-6"
                  >
                    <Sparkles className="w-12 h-12 text-white" />
                  </motion.div>
                  <h2 className="text-3xl font-bold gradient-text mb-4">
                    欢迎使用汇小金智能体
                  </h2>
                  <p className="text-gray-400 max-w-md mx-auto">
                    hi，欢迎来到汇金国际商务社区，我是汇金智能体，有什么企业服务相关问题都可以咨询我。
                  </p>
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
                    {[
                      "介绍汇金国际商务社区",
                      "介绍DeepSeek最新动态",
                      "提供企业政策服务咨询",
                      "拱墅区1+N政策简要介绍",
                    ].map((suggestion, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setInput(suggestion)}
                        className="text-white p-3 glass rounded-lg text-sm hover:bg-white/20 transition-colors text-left"
                      >
                        {suggestion}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <div className="space-y-6">
                  <AnimatePresence>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`flex ${
                          message.role === "user"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`flex max-w-[80%] ${
                            message.role === "user"
                              ? "flex-row-reverse"
                              : "flex-row"
                          } items-start space-x-3`}
                        >
                          <div
                            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                              message.role === "user"
                                ? "bg-gradient-to-r from-blue-500 to-purple-600"
                                : "bg-gradient-to-r from-green-500 to-teal-600"
                            }`}
                          >
                            {message.role === "user" ? (
                              <User className="w-5 h-5 text-white" />
                            ) : (
                              <Bot className="w-5 h-5 text-white" />
                            )}
                          </div>

                          <div
                            className={`glass rounded-2xl p-4 ${
                              message.role === "user"
                                ? "bg-blue-500/20 border-blue-500/30"
                                : "bg-gray-700/50 border-gray-600/30"
                            }`}
                          >
                            <div className="prose prose-invert max-w-none">
                              {message.role === "assistant" ? (
                                <ReactMarkdown
                                  components={{
                                    code: ({
                                      inline,
                                      className,
                                      children,
                                      ...props
                                    }: ComponentPropsWithoutRef<"code"> & {
                                      inline?: boolean;
                                    }) => {
                                      const match = /language-(\w+)/.exec(
                                        className || ""
                                      );
                                      return !inline && match ? (
                                        <SyntaxHighlighter
                                          style={atomDark as any}
                                          language={match[1]}
                                          PreTag="div"
                                          {...props}
                                          className="text-white"
                                        >
                                          {String(children).replace(/\n$/, "")}
                                        </SyntaxHighlighter>
                                      ) : (
                                        <code
                                          className="bg-gray-800 px-1 py-0.5 rounded text-sm text-white"
                                          {...props}
                                        >
                                          {children}
                                        </code>
                                      );
                                    },
                                  }}
                                  className="text-white"
                                >
                                  {message.content}
                                </ReactMarkdown>
                              ) : (
                                <span className="text-white">
                                  {message.content}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {isLoading && (
                    <LoadingAnimation
                      phase={loadingPhase}
                      countdown={countdown}
                    />
                  )}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* 输入区域 */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="border-t border-white/10 p-6 flex-shrink-0"
            >
              <div className="glass rounded-2xl p-4">
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="输入您的问题..."
                      disabled={isLoading}
                      className="w-full bg-transparent border-none outline-none resize-none text-white placeholder-gray-400 max-h-32"
                      rows={1}
                      style={{ minHeight: "24px" }}
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={sendMessage}
                    disabled={!input.trim() || isLoading}
                    className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-shadow"
                  >
                    <Send className="w-5 h-5 text-white" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}
