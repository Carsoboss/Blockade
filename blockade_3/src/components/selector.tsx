import React, { useEffect, useRef, useState } from "react";
import { IconChevronDown } from "@tabler/icons-react";
import { SparkleIcon } from "./icons";
import Modal from "./modals";
import { api } from "~/utils/api"; // Import the api

const ModelSelector: React.FC<{
  selectedModel: string;
  setSelectedModel: (model: string) => void;
}> = ({ selectedModel, setSelectedModel }) => {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState("");
  const { data: models, isLoading: isLoadingModels } =
    api.openai.getAllChatBots.useQuery(); // Fetch chat bots

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const filteredModels =
    models
      ?.filter((model) =>
        model.name.toLowerCase().includes(search.toLowerCase()),
      )
      .map((model) => ({ name: model.name, icon: <SparkleIcon /> })) ?? [];

  const handleClickOutside = (event: MouseEvent) => {
    if (
      triggerRef.current &&
      !triggerRef.current.contains(event.target as Node) &&
      modalRef.current &&
      !modalRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        className="flex items-center rounded bg-gray-800 p-2 transition duration-200 hover:bg-gray-700"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedModel || "Select a Model"}
        <IconChevronDown className="ml-2 text-white" />
      </button>
      {isOpen && (
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          className="absolute left-0 mt-2 w-80 rounded-md border border-gray-700 bg-gray-800 shadow-lg"
          customPosition={{ top: 40, left: 0 }}
        >
          <div className="p-4" ref={modalRef}>
            <h2 className="mb-4 text-xl font-semibold text-white">
              Select a Model
            </h2>
            <input
              ref={inputRef}
              className="mb-4 w-full rounded border border-gray-700 bg-gray-800 p-2 text-white"
              placeholder="Search models..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="space-y-2">
              {filteredModels.map((model) => (
                <div
                  key={model.name}
                  className="flex cursor-pointer items-center justify-between rounded p-2 hover:bg-gray-700"
                  onClick={() => {
                    setSelectedModel(model.name);
                    setIsOpen(false);
                  }}
                >
                  <div className="flex items-center text-white">
                    {model.icon}
                    <span className="ml-2">{model.name}</span>
                  </div>
                  {model.name === selectedModel && (
                    <span className="text-blue-400">✔</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ModelSelector;
