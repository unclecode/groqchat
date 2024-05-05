// components/ModelSelector.tsx
import React, { useState, useEffect } from "react";
import StorageService from "../services/StorageService";
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/24/outline';
// import models from '../public/models.json';

const models = [
    {
      "id": "llama3-8b-8192",
      "name": "LLaMA3 8b",
      "description": "llama3-8b-8192\nDeveloper: Meta\nContext Window: 8,192 tokens",
      "provider": "Groq"
    },
    {
      "id": "llama3-70b-8192",
      "name": "LLaMA3 70b",
      "description": "llama3-70b-8192\nDeveloper: Meta\nContext Window: 8,192 tokens",
      "provider": "Groq"
    },
    {
      "id": "mixtral-8x7b-32768",
      "name": "Mixtral 8x7b",
      "description": "mixtral-8x7b-32768\nDeveloper: Mistral\nContext Window: 32,768 tokens",
      "provider": "Groq"
    },
    {
      "id": "gemma-7b-it",
      "name": "Gemma 7b",
      "description": "gemma-7b-it\nDeveloper: Google\nContext Window: 8,192 tokens",
      "provider": "Groq"
    }
  ]

const ModelSelector = () => {

  const [isOpen, setIsOpen] = useState(false);
  const [currentModel, setCurrentModel] = useState('');
  const [modelList, setModelList] = useState([]);

  useEffect(() => {
    const storedModel = StorageService.getCurrentSessionModel() || StorageService.getDefaultModel() || '';
    setCurrentModel(storedModel);
    setModelList(models.filter(model => model.provider === 'Groq'));
  }, []);

  const handleModelChange = (model) => {
    setCurrentModel(model.id);
    StorageService.saveCurrentSessionModel(model.id);
    setIsOpen(false);
  };

  return (
    <div className="w-full p-5 transition-all duration-300">
      <div className="flex items-center justify-start">
        <div className="relative">
          <button
            className="flex items-center justify-between w-full bg-zinc-800 text-zinc-300 px-2 py-1 rounded transition-all duration-300 hover:bg-zinc-500"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="font-semibold">
              {modelList.find(model => model.id === currentModel)?.name || 'Select Model'}
            </span>
            <ChevronDownIcon className="w-5 h-5 ml-2" />
          </button>
          {isOpen && (
            <div className="absolute top-full left-0 mt-2 w-80 bg-zinc-700 text-zinc-300 rounded-md shadow-md transition-all duration-300 z-10 border border-zinc-600">
              {modelList.map(model => (
                <div
                  key={model.id}
                  className={`flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-zinc-600 transition-all duration-300 ${
                    currentModel === model.id ? 'bg-zinc-600' : ''
                  }`}
                  onClick={() => handleModelChange(model)}
                >
                  <div className="flex items-center">
                    <img src="/groq.svg" alt="Groq" className="w-6 h-6 mr-2" />
                    <div>
                      <p className="font-semibold">{model.name}</p>
                      <p className="text-sm" dangerouslySetInnerHTML={{ __html: model.description.replace(/\n/g, '<br/>') }}></p>
                    </div>
                  </div>
                  {currentModel === model.id && (
                    <CheckIcon className="w-8 h-8 ml-2 text-green-500" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModelSelector;