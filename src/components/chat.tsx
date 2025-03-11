import React, { useEffect, useRef, useState } from "react";
import {
  LightningIcon,
  SparkleIcon,
  SuperSparkleIcon,
  UpArrowIcon,
} from "./icons";

interface Message {
  user: string;
  text: string;
  model: string;
}

interface ChatProps {
  messages: Message[];
  sendMessage: (text: string, sender?: string) => void;
  selectedModel: string;
  isTyping: boolean; // Add typing prop
}

const Chat: React.FC<ChatProps> = ({
  messages,
  sendMessage,
  selectedModel,
  isTyping, // Use typing prop
}) => {
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  const handleSend = async () => {
    if (input.trim() === "") return;

    const userMessage = input;
    setInput("");

    sendMessage(userMessage, "You");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const getBotIcon = () => {
    switch (selectedModel) {
      case "ChatGPT 3.5":
        return <SparkleIcon className="mr-2 h-6 w-6 flex-shrink-0" />;
      case "ChatGPT 4.0":
        return <SuperSparkleIcon className="mr-2 h-6 w-6 flex-shrink-0" />;
      case "Custom Model":
        return <LightningIcon className="mr-2 h-6 w-6 flex-shrink-0" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div ref={chatContainerRef} className="mb-20 flex-1 overflow-y-auto p-6">
        {messages.map((message, index) => (
          <div key={index} className="my-4 px-6">
            <div
              className={`mb-2 ${
                message.user === "You" ? "text-right" : "text-left"
              }`}
            >
              {message.user !== "You" && getBotIcon()}
              <span
                className={`inline-block rounded-lg px-4 py-2 ${
                  message.user === "You"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-white"
                } break-words`}
                style={{
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                }}
              >
                {message.text}
              </span>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="my-4 px-6 text-left">
            <div className="inline-block rounded-lg bg-gray-800 p-2 text-white">
              <div className="flex space-x-1">
                <div className="dot h-1.5 w-1.5 animate-bounce rounded-full bg-gray-500"></div>
                <div className="dot h-1.5 w-1.5 animate-bounce rounded-full bg-gray-500 delay-75"></div>
                <div className="dot h-1.5 w-1.5 animate-bounce rounded-full bg-gray-500 delay-150"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <div className="fixed bottom-0 left-0 right-0 flex items-center justify-center border-t border-gray-700 p-2 sm:left-64">
        <div className="flex w-full max-w-2xl items-center">
          <textarea
            className="flex-1 resize-none rounded-lg border border-gray-700 bg-gray-800 p-2 text-white"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            style={{
              minHeight: "50px",
              maxHeight: "150px",
              overflowY: "auto",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              overflowWrap: "break-word",
            }}
          />
          <button
            className="ml-2 flex items-center justify-center rounded-full bg-blue-600 p-2"
            onClick={handleSend}
          >
            <UpArrowIcon className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
