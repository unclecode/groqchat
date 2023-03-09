import React, { useState } from 'react'
import { ArrowLeftOnRectangleIcon, BoltIcon, ChatBubbleLeftIcon, ExclamationTriangleIcon, HandThumbDownIcon, HandThumbUpIcon, LinkIcon, MoonIcon, PaperAirplaneIcon, PencilSquareIcon, PlusIcon, SignalIcon, SunIcon, TrashIcon, UserIcon } from "@heroicons/react/24/outline"
import Link from 'next/link'
import Image from 'next/image'
const Home = () => {
    const [hasAnswered, setHasAnswered] = useState(false)
    return (
        <div className='h-screen bg-white text-black flex'>
            <div className='w-64 flex flex-col'>
                <div className='relative flex flex-col flex-grow overflow-y-auto bg-black pt-5'>
                    <button className='flex space-x-1 p-2 hover:bg-gray-700 mx-2 border border-gray-300 rounded text-white'>
                        <PlusIcon className='h-6 w-6' />
                        New Chat
                    </button>
                    <div className='mt-5 flex flex-col text-white'>
                        <Link href="/home" className='flex space-x-2 p-2 hover:bg-black/80 mx-2 bg-gray-700 rounded text-white items-center'>
                            <ChatBubbleLeftIcon className='h-6 w-6 text-gray-300' />
                            <p>Translation Request</p>
                        </Link>
                    </div>
                    <div className='absolute bottom-0 inset-x-0 border-t border-gray-200/50 mx-2 py-6 px-2'>
                        <Link href="/home" className='flex space-x-2 p-2 hover:bg-black/80 mx-2 rounded text-white text-sm items-center'>
                            <TrashIcon className='h-5 w-5 text-gray-300' />
                            <p>Clear conversations</p>
                        </Link>
                        <Link href="/home" className='flex space-x-2 p-2 hover:bg-black/80 mx-2 rounded text-white text-sm items-center'>
                            <UserIcon className='h-5 w-5 text-gray-300' />
                            <p>Upgrade to plus</p>
                        </Link>
                        <Link href="/home" className='flex space-x-2 p-2 hover:bg-black/80 mx-2 rounded text-white text-sm items-center'>
                            <MoonIcon className='h-5 w-5 text-gray-300' />
                            <p>Dark Mode</p>
                        </Link>
                        <Link href="/home" className='flex space-x-2 p-2 hover:bg-black/80 mx-2 rounded text-white text-sm items-center'>
                            <LinkIcon className='h-5 w-5 text-gray-300' />
                            <p>Updates</p>
                        </Link>
                        <Link href="/home" className='flex space-x-2 p-2 hover:bg-black/80 mx-2 rounded text-white text-sm items-center'>
                            <ArrowLeftOnRectangleIcon className='h-5 w-5 text-gray-300' />
                            <p>Logout</p>
                        </Link>
                    </div>

                </div>
            </div>
            <div className='relative flex flex-1 flex-col h-full'>
                {!hasAnswered && <div className='flex flex-col space-y-4 justify-center items-center absolute inset-x-0 top-0 bottom-0'>
                    <h1 className='text-3xl font-bold pb-12'>ChatGPT</h1>
                    <div className='space-y-2'>
                        <div className='grid grid-cols-3 gap-4 text-center text-lg'>
                            <div className='p-2 font-semibold flex flex-col justify-center items-center'><SunIcon className='h-5 w-5' />Examples</div>
                            <div className='p-2 font-semibold flex flex-col justify-center items-center'><BoltIcon className='h-5 w-5' />Capabilities</div>
                            <div className='p-2 font-semibold flex flex-col justify-center items-center'><ExclamationTriangleIcon className='h-5 w-5' />Limitations</div>
                        </div>
                        <div className='grid grid-cols-3 gap-4 text-center text-black'>
                            <div className='p-2 bg-gray-300 hover:bg-gray-400 rounded-md  text-sm shadow-sm w-60'>Explain quantum computing in simple terms</div>
                            <div className='p-2 bg-gray-300 hover:bg-gray-400 rounded-md  text-sm shadow-sm w-60'>Remembers what user said earlier in the conversation</div>
                            <div className='p-2 bg-gray-300 hover:bg-gray-400 rounded-md  text-sm shadow-sm w-60'>May occasionally generate incorrect information</div>
                        </div>
                        <div className='grid grid-cols-3 gap-4 text-center'>
                            <div className='p-2 bg-gray-300 hover:bg-gray-400 rounded-md  text-sm shadow-sm w-60'>Explain quantum computing in simple terms</div>
                            <div className='p-2 bg-gray-300 hover:bg-gray-400 rounded-md  text-sm shadow-sm w-60'>Remembers what user said earlier in the conversation</div>
                            <div className='p-2 bg-gray-300 hover:bg-gray-400 rounded-md  text-sm shadow-sm w-60'>May occasionally generate incorrect information</div>
                        </div>
                        <div className='grid grid-cols-3 gap-4 text-center'>
                            <div className='p-2 bg-gray-300 hover:bg-gray-400 rounded-md  text-sm shadow-sm w-60'>Explain quantum computing in simple terms</div>
                            <div className='p-2 bg-gray-300 hover:bg-gray-400 rounded-md  text-sm shadow-sm w-60'>Remembers what user said earlier in the conversation</div>
                            <div className='p-2 bg-gray-300 hover:bg-gray-400 rounded-md  text-sm shadow-sm w-60'>May occasionally generate incorrect information</div>
                        </div>
                    </div>
                </div>}

                {hasAnswered && <div className='flex flex-col bg-white text-black'>
                    <div className='w-full flex items-center justify-center'>
                        <div className='flex space-x-4 bg-white items-center justify-between px-6 py-6 w-1/2'>
                            <div className='flex space-x-4 items-center'>
                                <div className='h-8 w-6 bg-indigo-500 text-center p-1 px-2 rounded text-white'>B</div>
                                <p>How does this work</p>
                            </div>
                            <PencilSquareIcon className='h-6 w-6' />
                        </div>
                    </div>
                    <div className='w-full flex items-center justify-center bg-gray-200 border-t border-b border-gray-500/40'>
                        <div className='flex space-x-4 items-center justify-between px-6 py-6 w-1/2'>
                            <div className='flex space-x-4 items-center'>
                                <div className='h-8 w-16 bg-teal-600 text-center p-2 rounded text-white relative'>
                                    <Image src="/logo.svg" fill alt='Open AI logo' />
                                </div>
                                <p>I'm assuming you're referring to how I work as a language model. As an AI language model, I was trained using vast amounts of data from the internet, books, and other sources. My training involved analyzing this data to identify patterns and relationships between words and phrases, as well as understanding the structure of language itself.

                                    When you ask me a question or provide me with a prompt, I use my knowledge of language to generate a response that is relevant and meaningful. I do this by using a complex algorithm</p>
                            </div>
                            <div className='flex space-x-1'>
                                <HandThumbUpIcon className='h-6 w-6' />
                                <HandThumbDownIcon className='h-6 w-6' />
                            </div>
                        </div>
                    </div>
                </div>}

                <div className='absolute bottom-0 inset-x-0 mx-auto px-4 py-6 max-w-3xl'>
                    <div className='text-black border border-gray-300 flex justify-center items-center space-x-2 shadow-md rounded px-2'>
                        <input className='flex-1 bg-white p-2 border-0 focus:outline-none' />
                        <PaperAirplaneIcon className='h-4 w-4 text-right -rotate-45' onClick={() => setHasAnswered(true)} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home