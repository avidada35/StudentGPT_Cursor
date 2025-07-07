import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Moon, 
  Sun, 
  Settings, 
  Trash2,
  Copy,
  Check,
  MessageSquare,
  Zap
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'

function App() {
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingMessage, setStreamingMessage] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const [copiedMessage, setCopiedMessage] = useState(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, streamingMessage])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const newMessage = {
      id: Date.now(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, newMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await fetch('http://localhost:8000/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: inputValue.trim() }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      
      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString()
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const copyMessage = async (content) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedMessage(content)
      setTimeout(() => setCopiedMessage(null), 2000)
    } catch (err) {
      console.error('Failed to copy message:', err)
    }
  }

  const clearChat = () => {
    setMessages([])
  }

  const MessageComponent = ({ message }) => {
    const isUser = message.role === 'user'
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div className={`flex items-start space-x-3 max-w-4xl ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
          {/* Avatar */}
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            isUser 
              ? 'bg-gradient-to-r from-ai-500 to-ai-600' 
              : 'bg-gradient-to-r from-gray-500 to-gray-600'
          }`}>
            {isUser ? (
              <User className="w-4 h-4 text-white" />
            ) : (
              <Bot className="w-4 h-4 text-white" />
            )}
          </div>

          {/* Message Content */}
          <div className={`message-bubble ${isUser ? 'user-message' : 'ai-message'} relative group`}>
            {!isUser && (
              <button
                onClick={() => copyMessage(message.content)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {copiedMessage === message.content ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-500" />
                )}
              </button>
            )}
            
            <div className="pr-8">
              {isUser ? (
                <p className="text-white">{message.content}</p>
              ) : (
                <div className="markdown-content">
                  <ReactMarkdown
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '')
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={tomorrow}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        )
                      }
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  const LoadingIndicator = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start mb-4"
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-gray-500 to-gray-600 flex items-center justify-center">
          <Bot className="w-4 h-4 text-white" />
        </div>
        <div className="message-bubble ai-message">
          <div className="typing-indicator">
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
          </div>
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
      {/* Header */}
      <header className="glass border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-ai-500 to-ai-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">StudentGPT</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Think Better, Not Feel Better</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 20 }}
              className="sidebar w-80 border-r border-gray-200/50 dark:border-gray-700/50 p-4 flex-shrink-0"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">Chat History</h3>
                  <button
                    onClick={clearChat}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-red-500"
                    title="Clear chat"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-2">
                  {messages.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      No messages yet. Start a conversation!
                    </p>
                  ) : (
                    messages.map((message, index) => (
                      <div
                        key={index}
                        className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center space-x-2">
                          {message.role === 'user' ? (
                            <User className="w-4 h-4 text-ai-500" />
                          ) : (
                            <Bot className="w-4 h-4 text-gray-500" />
                          )}
                          <p className="text-sm truncate">
                            {message.content.substring(0, 50)}...
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center h-full text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-r from-ai-500 to-ai-600 rounded-full flex items-center justify-center mb-6">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold gradient-text mb-2">
                  StudentGPT
                </h2>
                <p className="mt-2 text-base opacity-80">
                  BattleGround for your thoughts.
                </p>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full">
                  {[
                    "I keep switching career goals every week.  What’s wrong with me?",
                    "My phone addiction is ruining my focus.  How do I break the loop?",
                    "Parents want engineering, I want design.  How do I decide?",
                    "Why do I compare myself to toppers even when I try my best?"
                  ].map((suggestion, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setInputValue(suggestion)
                        inputRef.current?.focus()
                      }}
                      className="p-4 text-left bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-200"
                    >
                      <MessageSquare className="w-5 h-5 text-ai-500 mb-2" />
                      <p className="text-sm font-medium">{suggestion}</p>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            <AnimatePresence>
              {messages.map((message) => (
                <MessageComponent key={message.id} message={message} />
              ))}
            </AnimatePresence>

            {isLoading && <LoadingIndicator />}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Fixed Input Area */}
          <div className="flex-shrink-0 border-t border-gray-200/50 dark:border-gray-700/50">
            <div className="max-w-4xl mx-auto p-4">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-4 focus-within:ring-2 focus-within:ring-ai-500 focus-within:border-ai-500 transition-all duration-200">
                <div className="flex items-end space-x-3">
                  <div className="flex-1 min-w-0">
                    <textarea
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Share what’s on your mind…"
                      disabled={isLoading}
                      className="w-full resize-none border-0 bg-transparent focus:outline-none focus:ring-0 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100"
                      rows="1"
                      style={{ minHeight: '24px', maxHeight: '120px' }}
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={sendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    className="flex-shrink-0 p-3 rounded-full bg-gradient-to-r from-ai-500 to-ai-600 hover:from-ai-600 hover:to-ai-700 text-white transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
                  >
                    <Send className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
              <p className="text-sm opacity-70 text-center mt-2">
               @ Built for the thoughts you don’t tell anyone — StudentGPT is your thinking partner.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App 