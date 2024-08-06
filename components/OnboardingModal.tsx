import React, { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import StorageService from "../services/StorageService";

const OnboardingModal = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(1);
    const [groqAPIToken, setGroqAPIToken] = useState("");
    const [error, setError] = useState("");

    const handleNext = () => {
        if (step === 3 && !groqAPIToken.trim()) {
            setError("Please enter your Groq API Token");
            return;
        }
        setError("");
        if (step < 4) setStep(step + 1);
    };

    const handlePrevious = () => {
        setError("");
        if (step > 1) setStep(step - 1);
    };

    const handleSave = () => {
        if (!groqAPIToken.trim()) {
            setError("Please enter your Groq API Token");
            return;
        }
        StorageService.saveGroqAPIToken(groqAPIToken);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="flex flex-col bg-zinc-800 rounded-lg shadow-lg w-[40%] h-[40%] overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-zinc-700">
                    <h2 className="text-2xl font-medium text-zinc-300">{"\u{1F680}"} Welcome to GroqChat v0.1.0</h2>
                    <XMarkIcon className="h-6 w-6 text-zinc-300 cursor-pointer" onClick={onClose} />
                </div>

                <div className="flex-grow overflow-y-auto p-6">
                    {step === 1 && (
                        <div className="h-full flex flex-col text-zinc-300">
                            <div className="space-y-4">
                                <p>
                                    {"\u{1F9E0}"} This application is inspired by Groq, the fastest inference engine,
                                    and utilizes the latest LLAMA series models released by Meta - some of the best
                                    open-source models available.
                                </p>
                                <p>{"\u{2728}"} Key features and benefits:</p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>{"\u{1F4AC}"} Familiar interface resembling ChatGPT for ease of use</li>
                                    <li>{"\u{1F512}"} Completely local and secure - your data stays on your machine</li>
                                    <li>
                                        {"\u{1F517}"} Ability to attach links and inject their information as context
                                        into your chat
                                    </li>
                                    <li>{"\u{1F504}"} Share attachments across different conversations</li>
                                    <li>{"\u{270F}\u{FE0F}"} Edit and modify your conversations</li>
                                    <li>{"\u{26A1}"} Lightning-fast inference speed</li>
                                    <li>
                                        {"\u{1F399}\u{FE0F}"} Audio support using Groq&apos;s Whisper model integration
                                    </li>
                                    <li>
                                        {"\u{1F5A5}\u{FE0F}"} Open-source code - feel free to customize and contribute!
                                    </li>
                                </ul>
                                <p>
                                    {"\u{1F52E}"} Future plans include multi-modality support and a code interpreter.
                                    We&apos;re constantly working on adding more tools and features to enhance your
                                    experience.
                                </p>
                                <p>
                                    {"\u{1F31F}"} This project was born out of a desire for a more user-friendly
                                    interface to Groq&apos;s powerful capabilities. We&apos;re excited to share it with
                                    you and welcome your support in adding even more features!
                                </p>
                            </div>
                        </div>
                    )}

                    {/* {step === 2 && (
                        <div className="h-full flex flex-col">
                            <p className="text-zinc-300 mb-4">Lets watch a quick introduction video:</p>
                            <div className="flex-grow">
                                <iframe
                                    src="https://www.youtube.com/embed/jm7BBAmTwF8"
                                    frameBorder="0"
                                    allow="autoplay; encrypted-media"
                                    allowFullScreen
                                    className="w-full h-full"
                                ></iframe>
                            </div>
                        </div>
                    )} */}

                    {step === 2 && (
                        <div className="h-full flex flex-col">
                            <p className="text-zinc-300 mb-4">Please enter your Groq API Token:</p>
                            <input
                                type="password"
                                value={groqAPIToken}
                                onChange={(e) => {
                                    setGroqAPIToken(e.target.value);
                                    setError("");
                                }}
                                className="bg-zinc-700 text-zinc-300 rounded-md py-2 px-3 w-full mb-4"
                                placeholder="Enter your Groq API Token"
                            />
                            {error && <p className="text-red-500 mb-4">{error}</p>}
                            <div className="bg-zinc-700 rounded-md p-4 mb-4 text-zinc-300 text-sm">
                                <p className="font-semibold mb-2">{"\u{1F512}"} Privacy & Security Note:</p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>Your API token is saved locally in your browser&apos;s IndexedDB.</li>
                                    <li>We do not have a backend server storing your token.</li>
                                    <li>Your browser communicates directly with the Groq API.</li>
                                    <li>
                                        If you use a different browser or clear your data, you&apos;ll need to re-enter
                                        your API key.
                                    </li>
                                    <li>
                                        The only server-side function we use is for crawling links you provide as
                                        context for AI conversations.
                                    </li>
                                </ul>
                                <p className="mt-2">
                                    This approach ensures your API key remains private and under your control.
                                </p>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="h-full flex flex-col">
                            <p className="text-zinc-300 mb-4">
                                Great! You are all set up. Here are some additional steps:
                            </p>
                            <ul className="list-disc pl-5 mb-4 text-zinc-300">
                                <li>
                                    Follow my GitHub repository:{" "}
                                    <a
                                        href="https://github.com/unclecode/groqcakk"
                                        className="text-blue-400 hover:underline"
                                    >
                                        GitHub Repo
                                    </a>
                                </li>
                                <li>
                                    Follow my on X (Twitter):{" "}
                                    <a href="https://twitter.com/unclecode" className="text-blue-400 hover:underline">
                                        @YourTwitter
                                    </a>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>

                <div className="flex justify-between p-4 border-t border-zinc-700">
                    {step > 1 && (
                        <button
                            onClick={handlePrevious}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        >
                            Back
                        </button>
                    )}
                    {step < 4 ? (
                        <button
                            onClick={handleNext}
                            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 ml-auto"
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            onClick={handleSave}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-auto"
                        >
                            Finish
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OnboardingModal;
