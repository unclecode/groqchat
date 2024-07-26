import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Login = () => {
    return (
        <div className='w-full h-screen bg-white flex justify-center items-center flex-col space-y-5'>
            <Image src="/logo.svg" alt="Open AI Logo" width={40} height={40} />
            <h2 className='text-3xl font-semibold text-black/90'>Welcome back</h2>
            <div className='flex flex-col space-y-4 w-80'>
                <input placeholder='Email Address' className='border border-gray-400 rounded text-black p-3' />
                <Link href="/home" className='bg-teal-600 hover:bg-teal-700 rounded-sm font-light text-white p-4 px-4 text-center'>Continue</Link>
                <span className='text-sm text-center'>Don&apos;t  have an account ? <Link href="/login" className='text-teal-600'>Sign up</Link></span>
            </div>

            <div className='w-80 relative '>
                <div className='absolute inset-0 flex items-center'>
                    <div className='w-full border-t border-gray-400'></div>
                </div>
                <div className='relative flex justify-center'>
                    <span className='bg-white px-2 text-gray-700 uppercase text-sm'>or</span>
                </div>
            </div>

            <div className='w-80 space-y-2'>
                <Link href="/home" className='border border-gray-400 hover:bg-gray-300 rounded text-black flex space-x-4 p-4 px-4'>
                    <Image src="/google.svg" alt="Open AI Logo" width={20} height={20} />
                    <p>Continue With Google</p>
                </Link>
                <Link href="/home" className='border border-gray-400 hover:bg-gray-300 rounded text-black flex space-x-4 p-4 px-4'>
                    <Image src="/microsoft.svg" alt="Open AI Logo" width={20} height={20} />
                    <p>Continue With Microsoft Account</p>
                </Link>
            </div>
        </div>
    )
}

export default Login