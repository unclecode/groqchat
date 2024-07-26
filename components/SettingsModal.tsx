// @ts-nocheck
import React, { useState } from "react";
import StorageService from "../services/StorageService";
import { XMarkIcon } from "@heroicons/react/24/outline";
import SessionManager from "../services/SessionManager";

const SettingsModal: React.FC<{ onClose: () => void }> = ({ onClose, sessionManager }) => {
    const [mode, setMode] = useState(StorageService.getMode() || "dark");
    const [selectedModel, setSelectedModel] = useState(StorageService.getModel() || "llama-3.1-8b-instant");
    const [systemPrompt, setSystemPrompt] = useState(StorageService.getSystemPrompt() || "");
    const [groqAPIToken, setGroqAPIToken] = useState(StorageService.getGroqAPIToken() || "");
    const [databaseType, setDatabaseType] = useState(StorageService.getDatabaseType() || "indexedDB");
    const [openAIWhisperAPIToken, setOpenAIWhisperAPIToken] = useState(StorageService.getOpenAIWhisperAPIToken() || "");
    const [mongoDBConnectionString, setMongoDBConnectionString] = useState(
        StorageService.getMongoDBConnectionString() || ""
    );
    const [selectedSetting, setSelectedSetting] = useState("general");
    const [storageInfo, setStorageInfo] = useState<StorageInfo>({
        availableStorage: 0,
        usedStorage: 0,
        totalStorage: 0,
    });

    const handleResetOnboarding = () => {
        StorageService.saveGroqAPIToken("");
        onClose();
        // reload the page
        window.location.reload();
    };

    React.useEffect(() => {
        const fetchStorageInfo = async () => {
            if (sessionManager) {
                const info = await sessionManager.getStorageInfo();
                setStorageInfo(info);
            }
        };

        fetchStorageInfo();
    }, [sessionManager]);

    const formatStorageSize = (size: number): string => {
        if (size < 1024) {
            return `${size} bytes`;
        } else if (size < 1024 * 1024) {
            return `${(size / 1024).toFixed(2)} KB`;
        } else if (size < 1024 * 1024 * 1024) {
            return `${(size / (1024 * 1024)).toFixed(2)} MB`;
        } else {
            return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
        }
    };

    React.useEffect(() => {
        setMode(StorageService.getMode() || "dark");
        setSelectedModel(StorageService.getModel() || "llama-3.1-8b-instant");
        setSystemPrompt(StorageService.getSystemPrompt() || "");
        setGroqAPIToken(StorageService.getGroqAPIToken() || "");
        setMongoDBConnectionString(StorageService.getMongoDBConnectionString() || "");
        setDatabaseType(StorageService.getDatabaseType() || "indexedDB");
        setOpenAIWhisperAPIToken(StorageService.getOpenAIWhisperAPIToken() || "");
    }, []);

    const handleModelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedModel(event.target.value);
    };

    const handleSaveSettings = () => {
        StorageService.saveMode(mode);
        StorageService.saveSystemPrompt(systemPrompt);
        StorageService.saveGroqAPIToken(groqAPIToken);
        StorageService.saveMongoDBConnectionString(mongoDBConnectionString);
        StorageService.saveModel(selectedModel);
        StorageService.saveDatabaseType(databaseType);
        StorageService.saveOpenAIWhisperAPIToken(openAIWhisperAPIToken);

        onClose();
    };

    const handleModeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setMode(event.target.value);
    };

    const handleSystemPromptChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setSystemPrompt(event.target.value);
    };

    const handleGroqAPITokenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setGroqAPIToken(event.target.value);
    };

    const handleMongoDBConnectionStringChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMongoDBConnectionString(event.target.value);
    };

    const handleDatabaseTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setDatabaseType(event.target.value);
    };

    const handleOpenAIWhisperAPITokenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setOpenAIWhisperAPIToken(event.target.value);
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300"
            style={{ opacity: 1 }}
            onClick={onClose}
        >
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
            <div
                className="bg-zinc-800 rounded-lg shadow-lg w-full max-w-3xl transition-opacity duration-300 z-50"
                style={{ opacity: 1 }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex flex-col h-[600px]">
                    <div className="flex items-center justify-between bg-zinc-700 p-4 rounded-t-lg">
                        <h2 className="text-zinc-300 font-semibold">Settings</h2>
                        <XMarkIcon className="h-6 w-6 text-zinc-300 cursor-pointer" onClick={onClose} />
                    </div>
                    <div className="flex h-full">
                        <div className="w-64 border-r border-zinc-700">
                            <ul className="space-y-2 p-4">
                                <li
                                    className={`text-zinc-300 cursor-pointer hover:bg-zinc-700 rounded p-2 transition-all
                                    ${selectedSetting === "general" ? "font-semibold" : ""}`}
                                    onClick={() => setSelectedSetting("general")}
                                >
                                    General
                                </li>
                                <li
                                    className={`text-zinc-300 cursor-pointer  hover:bg-zinc-700 rounded p-2 transition-all ${
                                        selectedSetting === "database" ? "font-semibold" : ""
                                    }`}
                                    onClick={() => setSelectedSetting("database")}
                                >
                                    Database
                                </li>
                                <li
                                    className={`text-zinc-300 cursor-pointer  hover:bg-zinc-700 rounded p-2 transition-all ${
                                        selectedSetting === "credentials" ? "font-semibold" : ""
                                    }`}
                                    onClick={() => setSelectedSetting("credentials")}
                                >
                                    Credentials
                                </li>
                            </ul>
                        </div>
                        <div className="flex flex-col flex-1 overflow-y-auto p-4">
                            {selectedSetting === "general" && (
                                <div className="flex flex-col flex-grow">
                                    <div className="mb-4 space-y-2">
                                        <label htmlFor="model" className="block text-zinc-300">
                                            Model
                                        </label>
                                        <select
                                            id="model"
                                            value={selectedModel}
                                            onChange={handleModelChange}
                                            className="bg-zinc-800 text-zinc-300 rounded-md py-2 px-3 w-full border border-zinc-700"
                                        >
                                            <option value="">Select a model</option>
                                            <option value="llama-3.1-8b-instant">Llama-3.1-8b-instant</option>
                                            <option value="llama-3.1-70b-versatile">Llama-3.1-70b-versatile</option>
                                            <option value="llama-3.1-405b-reasoning" disabled>
                                                Llama-3.1-405b-reasoning
                                            </option>
                                            <option value="llama3-8b-8192">Llama3-8B-8192</option>
                                            <option value="llama3-70b-8192">Llama3-70B-8192</option>
                                        </select>
                                    </div>
                                    <div className="mb-4 space-y-2">
                                        <label htmlFor="mode" className="block text-zinc-300">
                                            Mode
                                        </label>
                                        <select
                                            id="mode"
                                            value={mode}
                                            onChange={handleModeChange}
                                            className="bg-zinc-800 text-zinc-300 rounded-md py-2 px-3 w-full border border-zinc-700"
                                        >
                                            <option value="light">Light</option>
                                            <option value="dark">Dark</option>
                                        </select>
                                    </div>
                                    <div className="mb-4 space-y-2">
                                        <label htmlFor="systemPrompt" className="block text-zinc-300">
                                            System Prompt
                                        </label>
                                        <textarea
                                            id="systemPrompt"
                                            value={systemPrompt}
                                            onChange={handleSystemPromptChange}
                                            className="bg-zinc-800 text-zinc-300 rounded-md py-2 px-3 w-full h-32 border border-zinc-700"
                                        ></textarea>
                                    </div>
                                    <button
                                        onClick={handleResetOnboarding}
                                        className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-all"
                                    >
                                        Reset Onboarding
                                    </button>
                                </div>
                            )}
                            {selectedSetting === "database" && (
                                // Check for database source type, IndexedDB, LocalStorage or MongoDB
                                <div className="flex flex-col flex-grow">
                                    <div className="mb-4 space-y-2">
                                        <label htmlFor="databaseSourceType" className="block text-zinc-300">
                                            Database Source Type
                                        </label>
                                        <select
                                            id="databaseSourceType"
                                            className="bg-zinc-800 text-zinc-300 rounded-md py-2 px-3 w-full border border-zinc-700"
                                        >
                                            <option value="indexeddb">IndexedDB</option>
                                            <option disabled value="localstorage">
                                                LocalStorage
                                            </option>
                                            <option disabled value="mongodb">
                                                MongoDB
                                            </option>
                                        </select>
                                    </div>
                                    <div className="mt-4 space-y-2">
                                        <div className="mb-4">
                                            <div className="text-sm font-medium text-gray-500">Storage Usage</div>
                                            <div className="mt-2">
                                                <div className="w-full bg-gray-700 rounded-full h-2.5">
                                                    <div
                                                        className="bg-slate-400 h-2.5 rounded-full"
                                                        style={{
                                                            width: `${
                                                                (storageInfo.usedStorage / storageInfo.totalStorage) *
                                                                100
                                                            }%`,
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                            <div className="mt-2 flex justify-between text-sm font-medium text-gray-500">
                                                <div>Used: {formatStorageSize(storageInfo.usedStorage)}</div>
                                                <div>Available: {formatStorageSize(storageInfo.availableStorage)}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {selectedSetting === "credentials" && (
                                <div className="flex flex-col flex-grow">
                                    <div className="mb-4 space-y-2">
                                        <label htmlFor="groqAPIToken" className="block text-zinc-300">
                                            Groq API Token
                                        </label>
                                        <input
                                            id="groqAPIToken"
                                            type="password"
                                            value={groqAPIToken}
                                            onChange={handleGroqAPITokenChange}
                                            className="bg-zinc-800 text-zinc-300 rounded-md py-2 px-3 w-full border border-zinc-700"
                                        />
                                    </div>
                                    <div className="mb-4 space-y-2">
                                        <label htmlFor="groqAPIToken" className="block text-zinc-300">
                                            OpenAI Whisper API Token
                                        </label>
                                        <input
                                            id="openAIWhisperAPIToken"
                                            type="password"
                                            value={openAIWhisperAPIToken}
                                            onChange={handleOpenAIWhisperAPITokenChange}
                                            className="bg-zinc-800 text-zinc-300 rounded-md py-2 px-3 w-full border border-zinc-700"
                                        />
                                    </div>
                                    <div className="mb-4  space-y-2 disabled" disabled>
                                        <label
                                            disabled
                                            htmlFor="mongoDBConnectionString"
                                            className="block text-zinc-300"
                                        >
                                            MongoDB Connection String
                                        </label>
                                        <input
                                            disabled
                                            id="mongoDBConnectionString"
                                            type="text"
                                            value={mongoDBConnectionString}
                                            onChange={handleMongoDBConnectionStringChange}
                                            className="bg-zinc-800 text-zinc-300 rounded-md py-2 px-3 w-full border border-zinc-700"
                                        />
                                    </div>
                                </div>
                            )}
                            <div className="flex justify-end">
                                <button
                                    onClick={handleSaveSettings}
                                    className="bg-zinc-700 text-zinc-300 py-2 px-4 rounded-md hover:bg-zinc-600 transition-all"
                                >
                                    Save Settings
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
