import { useState } from "react";
import sendChatToBot from "../utils/chatbotApi";

export default function Chatbot({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi there! How can I help you?" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");

    const response = await sendChatToBot(input);
    setMessages([...newMessages, { sender: "bot", text: response }]);
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-full right-0 mt-2 z-50">
      <div className="bg-white w-96 max-h-[70vh] shadow-2xl rounded-2xl flex flex-col p-4 border">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold">Tour Guide Chatbot</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500">
            ✖
          </button>
        </div>

        <div className="overflow-y-auto flex-1 mb-2 pr-1">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`mb-2 ${msg.sender === "user" ? "text-right" : "text-left"}`}
            >
              <div
                className={`inline-block px-3 py-2 rounded-xl ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <div className="flex w-full mt-2">
          <input
            className="border rounded-l-xl px-3 py-2 outline-none w-full"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
          />
          <button
            onClick={handleSend}
            className="bg-blue-500 text-white px-4 py-2 rounded-r-xl"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
