// chatbot.jsx
import { useState, useEffect, useRef } from "react";
import sendChatToBot from "../utils/chatbotApi";

export default function Chatbot({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Welcome to Trip Genie Chat Assistant! How can I help you?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    console.log("Messages updated:", messages);
    console.log("messagesEndRef.current:", messagesEndRef.current);
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
  
    const userMessage = { sender: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
  
    const lowerInput = input.toLowerCase();
  
    // Custom bot responses for certain questions
    const capabilitiesQuestions = [
      "what can you do",
      "how can you help me",
      "what do you offer",
      "your features",
      "how can you assist",
      "help options",
      "what are you capable of",
      "how can i use you"
    ];
  
    const matchesCapabilities = capabilitiesQuestions.some(q =>
      lowerInput.includes(q)
    );
  
    if (matchesCapabilities) {
      const response = "I'm here to help you with budget estimation, share information about popular places, suggest personalized itineraries, and more! Just ask me anything related to your travel plans!";
      setMessages(prev => [...prev, { sender: "bot", text: response }]);
      setIsLoading(false);
      return;
    }
  
    try {
      const response = await sendChatToBot(input);
      setMessages(prev => [...prev, { sender: "bot", text: response }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, {
        sender: "bot",
        text: "Sorry, I'm having trouble responding. Please try again later."
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-white w-80 h-[500px] shadow-xl rounded-xl flex flex-col border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Tour Guide Chatbot</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 focus:outline-none"
          >
            ✖
          </button>
        </div>

        {/* Messages container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-gray-100 text-gray-800 rounded-bl-none"
                }`}
              >
                {msg.text.split('\n').map((paragraph, i) => (
                  <p key={i} className="mb-2 last:mb-0">{paragraph}</p>
                ))}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 rounded-lg rounded-bl-none px-4 py-2 max-w-[80%]">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-100"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="border-t border-gray-200 p-3 bg-gray-50">
          <div className="flex items-center space-x-2">
            <input
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}