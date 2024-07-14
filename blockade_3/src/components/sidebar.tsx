import React, { useState } from "react";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Pencil } from "lucide-react";

import { EllipsisIcon } from "./icons";

interface SidebarProps {
  newChat: () => void;
  chats: { id: string; title: string; model: string }[];
  selectChat: (chat: string) => void;
  setSelectedChat: (chat: string | null) => void;
  setChatOptionsOpen: (open: boolean) => void;
  setModalPosition: (position: { top: number; left: number }) => void;
  handleRename: (oldTitle: string, newTitle: string) => void;
  selectedChatId: string | null; // Add this prop to identify the selected chat
}

const Sidebar: React.FC<SidebarProps> = ({
  newChat,
  chats,
  selectChat,
  setSelectedChat,
  setChatOptionsOpen,
  setModalPosition,
  handleRename,
  selectedChatId, // Add this prop to identify the selected chat
}) => {
  const [editingChat, setEditingChat] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>("");

  const handleEllipsisClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    chat: string,
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setModalPosition({
      top: rect.top + window.scrollY + 20,
      left: rect.left + window.scrollX + 20,
    });
    setSelectedChat(chat);
    setChatOptionsOpen(true);
  };

  const handleEditClick = (chat: string, title: string) => {
    setEditingChat(chat);
    setEditingTitle(title);
  };

  const handleEditBlur = (chat: string) => {
    if (editingTitle.trim() === "") {
      setEditingTitle(chat); // Revert to original title if input is empty
    } else {
      handleRename(chat, editingTitle);
    }
    setEditingChat(null);
  };

  const handleEditKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    chat: string,
  ) => {
    if (e.key === "Enter") {
      handleEditBlur(chat);
    }
  };

  const groupedChats = chats.reduce(
    (acc, chat) => {
      if (!acc[chat.model]) {
        acc[chat.model] = [];
      }
      acc[chat.model]!.push(chat);
      return acc;
    },
    {} as Record<string, { id: string; title: string; model: string }[]>,
  );

  return (
    <Disclosure as="nav" className="relative h-full">
      {({ open }) => (
        <>
          <div className="absolute left-0 top-0 flex items-center p-4 sm:hidden">
            <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-200 hover:text-black focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white dark:hover:bg-gray-700 dark:hover:text-white">
              <span className="sr-only">Open main menu</span>
              {open ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </Disclosure.Button>
          </div>
          <div className="hidden sm:flex sm:h-full sm:w-64 sm:flex-col sm:overflow-y-auto sm:bg-gray-800 sm:p-4">
            <div className="mb-6 flex items-center space-x-2">
              <h1 className="text-xl font-semibold text-gray-200">Lex3 AI</h1>
            </div>
            <button
              className="mb-4 flex w-full items-center space-x-2 rounded p-2 text-left hover:bg-gray-700"
              onClick={newChat}
            >
              <Pencil className="h-5 w-5" />
              <span className="text-gray-200">New Chat</span>
            </button>
            <div className="flex flex-col space-y-2">
              {Object.keys(groupedChats).map((model) => (
                <div key={model}>
                  <div className="text-sm font-bold text-gray-500">{model}</div>
                  {groupedChats[model]?.map((chat, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between rounded p-2 text-left ${
                        chat.id === selectedChatId
                          ? "bg-gray-700"
                          : "hover:bg-gray-700"
                      }`}
                    >
                      <button
                        className="w-full text-left text-gray-200"
                        onClick={() => selectChat(chat.id)}
                        onDoubleClick={() =>
                          handleEditClick(chat.id, chat.title)
                        }
                      >
                        {editingChat === chat.id ? (
                          <input
                            className="w-full bg-gray-800 text-left text-gray-200"
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            onBlur={() => handleEditBlur(chat.id)}
                            onKeyPress={(e) => handleEditKeyPress(e, chat.id)}
                            autoFocus
                          />
                        ) : (
                          chat.title
                        )}
                      </button>
                      <button onClick={(e) => handleEllipsisClick(e, chat.id)}>
                        <EllipsisIcon className="h-5 w-5 text-gray-400" />
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <Disclosure.Panel className="fixed inset-0 z-20 w-3/4 bg-gray-800 sm:hidden">
            <div className="p-4">
              <div className="mb-4 flex justify-between">
                <h1 className="text-xl font-semibold text-gray-200">
                  Blockade AI
                </h1>
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Close main menu</span>
                  <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                </Disclosure.Button>
              </div>
              <button
                className="mb-4 flex w-full items-center space-x-2 rounded p-2 text-left hover:bg-gray-700"
                onClick={newChat}
              >
                <Pencil className="h-5 w-5" />
                <span className="text-gray-200">New Chat</span>
              </button>
              <div className="flex flex-col space-y-2">
                {Object.keys(groupedChats).map((model) => (
                  <div key={model}>
                    <div className="text-sm font-bold text-gray-500">
                      {model}
                    </div>
                    {groupedChats[model]?.map((chat, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between rounded p-2 text-left ${
                          chat.id === selectedChatId
                            ? "bg-gray-700"
                            : "hover:bg-gray-700"
                        }`}
                      >
                        <button
                          className="w-full text-left text-gray-200"
                          onClick={() => selectChat(chat.id)}
                          onDoubleClick={() =>
                            handleEditClick(chat.id, chat.title)
                          }
                        >
                          {editingChat === chat.id ? (
                            <input
                              className="w-full bg-gray-800 text-left text-gray-200"
                              value={editingTitle}
                              onChange={(e) => setEditingTitle(e.target.value)}
                              onBlur={() => handleEditBlur(chat.id)}
                              onKeyPress={(e) => handleEditKeyPress(e, chat.id)}
                              autoFocus
                            />
                          ) : (
                            chat.title
                          )}
                        </button>
                        <button
                          onClick={(e) => handleEllipsisClick(e, chat.id)}
                        >
                          <EllipsisIcon className="h-5 w-5 text-gray-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Sidebar;
