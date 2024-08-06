// @ts-nocheck
// InputForm.tsx
import React, { useRef, useEffect, useState } from "react";
import { PaperClipIcon, ArrowUpIcon, MicrophoneIcon, StopIcon } from "@heroicons/react/24/outline";
import StorageService from "../services/StorageService";

interface InputFormProps {
    userInput: string;
    setUserInput: (input: string) => void;
    handleUserInput: (e?: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

const InputForm: React.FC<InputFormProps> = ({ userInput, setUserInput, handleUserInput }) => {
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [openAIWhisperAPIToken, setOpenAIWhisperAPIToken] = useState<string | null>(null);
    const [groqAPIToken, setGroqAPIToken] = useState<string | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const [showUrlModal, setShowUrlModal] = useState(false);
    const [urlInput, setUrlInput] = useState("");

    useEffect(() => {
        const token = StorageService.getOpenAIWhisperAPIToken();
        setOpenAIWhisperAPIToken(token);
        setGroqAPIToken(StorageService.getGroqAPIToken());
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleUserInput(e);
        }
    };

    useEffect(() => {
        const textArea = textAreaRef.current;
        if (textArea) {
            textArea.style.height = "auto";
            textArea.style.height = `${textArea.scrollHeight}px`;
            textArea.style.maxHeight = "350px";
            textArea.style.overflowY = textArea.scrollHeight > 150 ? "scroll" : "hidden";
        }
    }, [userInput]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.addEventListener("dataavailable", (event) => {
                console.log("Data available");
                audioChunksRef.current.push(event.data);
            });

            mediaRecorder.start();
            setIsRecording(true);
        } catch (error) {
            console.error("Error starting recording:", error);
            setUserInput("Error: Unable to start recording. Please check your microphone permissions.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
            mediaRecorderRef.current.addEventListener("stop", transcribeAudio);
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const transcribeAudio = async () => {
        try {
            const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });

            // Create a new FormData object and append the audio data
            const formData = new FormData();
            formData.append("file", audioBlob, "recording.webm");
            // formData.append("model", "whisper-1");
            formData.append("model", "whisper-large-v3");
            formData.append("response_format", "text");

            // Send the request to the OpenAI API
            // const transcriptionResponse = await fetch("https://api.openai.com/v1/audio/transcriptions", {
            //     method: "POST",
            //     headers: {
            //         Authorization: `Bearer ${openAIWhisperAPIToken}`,
            //     },
            //     body: formData,
            // });

            const transcriptionResponse = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${groqAPIToken}`,
                },
                body: formData,
            });

            if (transcriptionResponse.ok) {
                const data = await transcriptionResponse.text();
                setUserInput(data.trim());
            } else {
                const errorData = await transcriptionResponse.json();
                setUserInput(`Error: ${errorData.error.message}`);
            }
        } catch (error) {
            console.error("Error transcribing audio:", error);
            setUserInput("Error: Unable to transcribe audio. Please try again.");
        }
    };

    const handleAttachmentClick = () => {
        setShowUrlModal(true);
    };

    const handleUrlSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (urlInput.trim()) {
            setUserInput((prev:string) => `${prev} @${urlInput.trim()}`.trim());
            setUrlInput("");
            setShowUrlModal(false);
        }
    };

    const handleMicrophoneClick = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    return (
        <div className="mx-auto max-w-3xl w-full p-4 pt-0 pb-8">
            <div className="flex space-x-2 w-full bg-zinc-800 rounded-xl p-2 border border-zinc-700 items-end">
                <button className="flex items-center space-x-2 pl-2 text-white mb-2" onClick={handleAttachmentClick}>
                    <PaperClipIcon className="h-5 w-5" />
                </button>
                <textarea
                    ref={textAreaRef}
                    className="flex-1 p-2 bg-transparent focus:outline-none text-zinc-300 resize-none overflow-y-auto"
                    placeholder="Type your message..."
                    value={userInput}
                    onInput={(e) => setUserInput(e.currentTarget.value)}
                    onKeyDown={handleKeyDown}
                    rows={1}
                />
                {groqAPIToken && (
                    <button
                        type="button"
                        onClick={handleMicrophoneClick}
                        className={`py-2 px-2 mb-1 rounded-md flex items-center justify-center transition-all ${
                            isRecording ? "bg-red-500 " : "bg-zinc-700 hover:bg-zinc-600"
                        }`}
                    >
                        {isRecording ? (
                            <StopIcon className="h-4 w-4 text-white transform px-0 animate-ping" />
                        ) : (
                            <MicrophoneIcon className="h-4 w-4 text-zinc-100 transform px-0 hover:text-zinc-200" />
                        )}
                    </button>
                )}
                <button
                    type="button"
                    onClick={handleUserInput}
                    className={`py-2 px-2 mb-1 rounded-md flex items-center justify-center ${
                        userInput.trim() ? "bg-zinc-200" : "bg-zinc-700"
                    }`}
                >
                    <ArrowUpIcon className="h-4 w-4 text-zinc-900 transform px-0" />
                </button>
            </div>

            {/* URL Input Modal */}
            {showUrlModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-zinc-800 p-8 rounded-lg shadow-xl transform transition-all duration-300 ease-in-out w-96">
                        <h2 className="text-xl font-semibold mb-4 text-zinc-200">Enter URL</h2>
                        <form onSubmit={handleUrlSubmit} className="space-y-4">
                            <input
                                type="url"
                                value={urlInput}
                                onChange={(e) => setUrlInput(e.target.value)}
                                placeholder="https://example.com"
                                className="w-full p-2 bg-zinc-700 text-zinc-200 rounded focus:outline-none focus:ring-2 focus:ring-zinc-500"
                                required
                            />
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setShowUrlModal(false)}
                                    className=" text-zinc-300 py-2 px-4 rounded-md hover:bg-zinc-600 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-zinc-700 text-zinc-300 py-2 px-4 rounded-md hover:bg-zinc-600 transition-all"
                                >
                                    Add URL
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InputForm;
