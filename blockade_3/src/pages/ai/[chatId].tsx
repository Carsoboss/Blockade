import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { UserButton, useUser } from "@clerk/nextjs";
import InfiniteCarousel from "../../components/infiniteCarousel";
import Chat from "../../components/chat";
import { ChatOptionsModal } from "../../components/modals";
import ModelSelector from "../../components/selector";
import Sidebar from "../../components/sidebar";
import { api } from "~/utils/api";
import { LoadingSpinner } from "../../components/loading";

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

const AIChat = () => {
  const { user } = useUser();
  const userId = user?.id ?? "";
  const router = useRouter();
  const { chatId } = router.query;

  const [selectedModel, setSelectedModel] = useState("CATBot");
  const [messages, setMessages] = useState<Message[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [chatOptionsOpen, setChatOptionsOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [showCarousel, setShowCarousel] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [chatIndex, setChatIndex] = useState(0);

  const { mutateAsync: getOpenAIResponse } =
    api.openai.getOpenAIResponse.useMutation();
  const { data: chatBots } = api.openai.getAllChatBots.useQuery();
  const { data: userChats, refetch: refetchChats } =
    api.openai.getChatsByUser.useQuery({ userId });
  const createChatMutation = api.openai.createChat.useMutation();
  const deleteChatMutation = api.openai.deleteChat.useMutation();
  const updateChatNameMutation = api.openai.updateChatName.useMutation();
  const createMessageMutation = api.openai.createMessage.useMutation();
  const { data: chatMessages, refetch: refetchMessages } =
    api.openai.getMessagesByChat.useQuery(
      { chatId: chatId as string },
      { enabled: !!chatId },
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
      const maxIndex = Math.max(
        0,
        ...userChats.map((chat) => {
          const match = chat.name.match(/Chat (\d+)/);
          return match && match[1] ? parseInt(match[1], 10) : 0;
        }),
      );
      setChatIndex(maxIndex);
    }
  }, [userChats]);

  useEffect(() => {
    if (chatMessages) {
      setMessages(
        chatMessages.map((msg) => ({
          user: msg.origin === "USER" ? "You" : "Bot",
          text: msg.content,
          model: selectedModel,
        })),
      );
      setShowCarousel(chatMessages.length === 0);
    }
  }, [chatMessages]);

  useEffect(() => {
    if (chatId && chatId !== "default") {
      setSelectedChat(chatId as string);
      refetchMessages();
    } else {
      setSelectedChat(null);
    }
  }, [chatId, refetchMessages]);

  const newChat = async () => {
    const newChatTitle = `Chat ${chatIndex + 1}`;
    const newChat = await createChatMutation.mutateAsync({
      userId,
      orgId: null,
      name: newChatTitle,
      model: selectedModel,
    });
    setChats([
      ...chats,
      { id: newChat.id, title: newChatTitle, model: selectedModel },
    ]);
    setChatIndex(chatIndex + 1);
    router.push(`/ai/${newChat.id}`);
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
    setShowCarousel(false);

    await createMessageMutation.mutateAsync({
      chatId: selectedChat,
      content: text,
      origin: sender === "You" ? "USER" : "BOT",
      originId: sender === "You" ? userId : selectedModel,
    });

    if (sender === "You") {
      setIsTyping(true);
      const conversation = messages.map((msg) => ({
        role: msg.user === "You" ? "user" : "system",
        content: msg.text,
      }));
      const chatBot = chatBots?.find((bot) => bot.name === selectedModel);
      if (!chatBot || !chatBot.instructions) {
        throw new Error("No instructions found for the selected model.");
      }
      const instructions = chatBot.instructions;

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
        await createMessageMutation.mutateAsync({
          chatId: selectedChat,
          content: response.message,
          origin: "BOT",
          originId: selectedModel,
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
        setIsTyping(false);
      }
    }
  };

  const createNewChatAndSendMessage = async (text: string, sender = "You") => {
    const newChatTitle = `Chat ${chatIndex + 1}`;
    const newChat = await createChatMutation.mutateAsync({
      userId,
      orgId: null,
      name: newChatTitle,
      model: selectedModel,
    });
    setChats([
      ...chats,
      { id: newChat.id, title: newChatTitle, model: selectedModel },
    ]);
    setChatIndex(chatIndex + 1);
    setSelectedChat(newChat.id);
    router.push(`/ai/${newChat.id}`);

    setMessages([{ user: sender, text, model: selectedModel }]);
    setShowCarousel(false);

    await createMessageMutation.mutateAsync({
      chatId: newChat.id,
      content: text,
      origin: sender === "You" ? "USER" : "BOT",
      originId: sender === "You" ? userId : selectedModel,
    });

    if (sender === "You") {
      setIsTyping(true);
      const chatBot = chatBots?.find((bot) => bot.name === selectedModel);
      if (!chatBot || !chatBot.instructions) {
        throw new Error("No instructions found for the selected model.");
      }
      const instructions = chatBot.instructions;

      try {
        const response = await getOpenAIResponse({
          instructions,
          userMessage: JSON.stringify([{ role: "user", content: text }]),
        });

        setMessages((prevMessages) => [
          ...prevMessages,
          { user: "Bot", text: response.message, model: selectedModel },
        ]);
        await createMessageMutation.mutateAsync({
          chatId: newChat.id,
          content: response.message,
          origin: "BOT",
          originId: selectedModel,
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
        setIsTyping(false);
      }
    }
  };

  const handleCarouselClick = (label: string) => {
    void sendMessage(label, "You");
  };

  const selectChat = async (chatId: string) => {
    if (chatId) {
      router.push(`/ai/${chatId}`);
      setShowCarousel(false);
      await refetchMessages();
    }
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
      const remainingChats = chats.filter((chat) => chat.id !== selectedChat);
      setChats(remainingChats);
      setSelectedChat(null);
      setMessages([]);

      if (remainingChats.length > 0) {
        router.push(`/ai/${remainingChats[0]?.id}`);
      } else {
        router.push(`/ai/default`);
      }
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
        selectedChatId={selectedChat}
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
            isTyping={isTyping}
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

export default AIChat;
