"use client";

import React, { useState, useEffect } from "react";
import { UserButton, useUser } from "@clerk/nextjs";

import InfiniteCarousel from "../components/infiniteCarousel";
import Chat from "../components/chat";
import { ChatOptionsModal } from "../components/modals";
import ModelSelector from "../components/selector";
import Sidebar from "../components/sidebar";
import { api } from "~/utils/api"; // Import the api

interface Message {
  user: string;
  text: string;
  model: string;
}

interface Chat {
  id: string;
  title: string;
  model: string;
}

const AI: React.FC = () => {
  const { user } = useUser();
  const userId = user?.id ?? "";
  const [selectedModel, setSelectedModel] = useState("CATBot");
  const [messages, setMessages] = useState<Message[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [chatOptionsOpen, setChatOptionsOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [showCarousel, setShowCarousel] = useState(true);
  const [isTyping, setIsTyping] = useState(false); // Add typing state
  const [chatIndex, setChatIndex] = useState(0); // Track the highest index used for chat naming

  const { mutateAsync: getOpenAIResponse } =
    api.openai.getOpenAIResponse.useMutation();
  const { data: chatBots, isLoading: isLoadingChatBots } =
    api.openai.getAllChatBots.useQuery();
  const { data: userChats, refetch: refetchChats } =
    api.openai.getChatsByUser.useQuery({ userId });
  const createChatMutation = api.openai.createChat.useMutation();
  const deleteChatMutation = api.openai.deleteChat.useMutation();
  const updateChatNameMutation = api.openai.updateChatName.useMutation();
  const createMessageMutation = api.openai.createMessage.useMutation();
  const getMessagesByChatQuery = api.openai.getMessagesByChat.useQuery(
    { chatId: selectedChat ?? "" },
    { enabled: !!selectedChat },
  );

  useEffect(() => {
    if (userChats) {
      setChats(
        userChats.map((chat) => ({
          id: chat.id,
          title: chat.name,
          model: selectedModel,
        })),
      );
      // Set the highest chat index used based on existing chat titles
      const maxIndex = Math.max(
        0,
        ...userChats
          .map((chat) => chat.name.match(/\d+$/))
          .filter((match) => match !== null)
          .map((match) => parseInt(match![0])),
      );
      setChatIndex(maxIndex);
    }
  }, [userChats]);

  useEffect(() => {
    if (getMessagesByChatQuery.data) {
      setMessages(
        getMessagesByChatQuery.data.map((msg) => ({
          user: msg.origin === "USER" ? "You" : "Bot",
          text: msg.content,
          model: selectedModel,
        })),
      );
      setShowCarousel(getMessagesByChatQuery.data.length === 0);
    }
  }, [getMessagesByChatQuery.data]);

  const newChat = async () => {
    const newChatTitle = `Chat ${chatIndex + 1}`;
    const newChat = await createChatMutation.mutateAsync({
      userId,
      orgId: "", // Set orgId if required
      name: newChatTitle,
    });
    setChats([
      ...chats,
      { id: newChat.id, title: newChatTitle, model: selectedModel },
    ]);
    setSelectedChat(newChat.id);
    setMessages([]);
    setShowCarousel(true); // Show carousel for new chat
    setChatIndex(chatIndex + 1); // Increment the chat index
  };

  const sendMessage = async (text: string, sender = "You") => {
    if (!selectedChat) {
      await createNewChatAndSendMessage(text, sender);
      return;
    }

    setMessages((prevMessages) => [
      ...prevMessages,
      { user: sender, text, model: selectedModel },
    ]);
    setShowCarousel(false); // Hide carousel after sending a message

    await createMessageMutation.mutateAsync({
      chatId: selectedChat,
      content: text,
      origin: sender === "You" ? "USER" : "BOT",
      originId: sender === "You" ? userId : selectedModel,
    });

    if (sender === "You") {
      setIsTyping(true); // Set typing state to true
      const conversation = messages.map((msg) => ({
        role: msg.user === "You" ? "user" : "system",
        content: msg.text,
      }));

      const instructions =
        chatBots?.find((bot) => bot.name === selectedModel)?.instructions ??
        "Your instructions here";

      try {
        const response = await getOpenAIResponse({
          instructions,
          userMessage: JSON.stringify([
            ...conversation,
            { role: "user", content: text },
          ]),
        });

        setMessages((prevMessages) => [
          ...prevMessages,
          { user: "Bot", text: response.message, model: selectedModel },
        ]);

        const botId =
          chatBots?.find((bot) => bot.name === selectedModel)?.id ??
          selectedModel;

        await createMessageMutation.mutateAsync({
          chatId: selectedChat,
          content: response.message,
          origin: "BOT",
          originId: botId,
        });
      } catch (error) {
        console.error("Error fetching OpenAI response:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            user: "Bot",
            text: "Sorry, there was an error processing your request.",
            model: selectedModel,
          },
        ]);
      } finally {
        setIsTyping(false); // Set typing state to false
      }
    }
  };

  const createNewChatAndSendMessage = async (text: string, sender = "You") => {
    const newChatTitle = `Chat ${chatIndex + 1}`;
    const newChat = await createChatMutation.mutateAsync({
      userId,
      orgId: "", // Set orgId if required
      name: newChatTitle,
    });
    setChats([
      ...chats,
      { id: newChat.id, title: newChatTitle, model: selectedModel },
    ]);
    setSelectedChat(newChat.id);
    setMessages([{ user: sender, text, model: selectedModel }]);
    setShowCarousel(false); // Hide carousel after creating a new chat
    setChatIndex(chatIndex + 1); // Increment the chat index

    await createMessageMutation.mutateAsync({
      chatId: newChat.id,
      content: text,
      origin: sender === "You" ? "USER" : "BOT",
      originId: sender === "You" ? userId : selectedModel,
    });

    if (sender === "You") {
      setIsTyping(true); // Set typing state to true
      const instructions =
        chatBots?.find((bot) => bot.name === selectedModel)?.instructions ??
        "Your instructions here";

      try {
        const response = await getOpenAIResponse({
          instructions,
          userMessage: JSON.stringify([{ role: "user", content: text }]),
        });

        setMessages((prevMessages) => [
          ...prevMessages,
          { user: "Bot", text: response.message, model: selectedModel },
        ]);

        const botId =
          chatBots?.find((bot) => bot.name === selectedModel)?.id ??
          selectedModel;

        await createMessageMutation.mutateAsync({
          chatId: newChat.id,
          content: response.message,
          origin: "BOT",
          originId: botId,
        });
      } catch (error) {
        console.error("Error fetching OpenAI response:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            user: "Bot",
            text: "Sorry, there was an error processing your request.",
            model: selectedModel,
          },
        ]);
      } finally {
        setIsTyping(false); // Set typing state to false
      }
    }
  };

  const handleCarouselClick = (label: string) => {
    void sendMessage(label, "You");
  };

  const selectChat = async (chatId: string) => {
    setSelectedChat(chatId);
    setShowCarousel(false); // Hide carousel when selecting a chat
    await getMessagesByChatQuery.refetch();
  };

  const handleRename = async (oldId: string, newTitle: string) => {
    const chat = chats.find((c) => c.id === oldId);
    if (chat) {
      await updateChatNameMutation.mutateAsync({
        chatId: chat.id,
        newName: newTitle,
      });
      setChats(
        chats.map((c) => (c.id === oldId ? { ...c, title: newTitle } : c)),
      );
    }
  };

  const handleDelete = async () => {
    if (selectedChat) {
      await deleteChatMutation.mutateAsync({ chatId: selectedChat });
      setChats(chats.filter((chat) => chat.id !== selectedChat));
      setSelectedChat(null);
      setMessages([]);
    }
    setChatOptionsOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-900 text-white">
      <Sidebar
        newChat={newChat}
        chats={chats}
        selectChat={selectChat}
        setSelectedChat={setSelectedChat}
        setChatOptionsOpen={setChatOptionsOpen}
        setModalPosition={setModalPosition}
        handleRename={handleRename}
        selectedChatId={selectedChat} // Pass selectedChatId to Sidebar
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center justify-between p-2 sm:justify-start sm:space-x-4">
          <div className="flex flex-1 justify-center sm:justify-start">
            <ModelSelector
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
            />
          </div>
          <div className="sm:hidden">
            <UserButton />
          </div>
        </div>
        <div className="flex flex-1 flex-col overflow-y-auto">
          {showCarousel && <InfiniteCarousel onClick={handleCarouselClick} />}
          <Chat
            messages={messages}
            sendMessage={sendMessage}
            selectedModel={selectedModel}
            isTyping={isTyping} // Pass typing state to Chat component
          />
        </div>
        {selectedChat && (
          <ChatOptionsModal
            isOpen={chatOptionsOpen}
            onClose={() => setChatOptionsOpen(false)}
            onRename={() => {
              const chat = chats.find((c) => c.id === selectedChat);
              if (chat) {
                const newName = prompt(
                  "Enter new name for the chat",
                  chat.title,
                );
                if (newName) handleRename(chat.id, newName);
              }
            }}
            onDelete={handleDelete}
            position={modalPosition}
          />
        )}
      </div>
    </div>
  );
};

export default AI;
