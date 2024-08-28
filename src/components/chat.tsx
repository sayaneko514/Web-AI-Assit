'use client';

import { useChat } from 'ai/react';
import { useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SendHorizontalIcon } from 'lucide-react';
import { TypewriterEffect } from './ui/typing-text';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import CopyToClipboard from '@/components/copy-to-clipboard';

export default function Chat() {
    const ref = useRef<HTMLDivElement>(null);
    const { messages, input, handleInputChange, handleSubmit, isLoading, error} = useChat({
    });

    useEffect(() => {
        if (ref.current === null) return;
        ref.current.scrollTo(0, ref.current.scrollHeight);
    }, [messages]);

    const words = [
        { text: "Naomi's" },
        { text: "HairLab.", className: "bg-gradient-to-r from-[#f9ce34] to-[#6228d7] inline-block text-transparent bg-clip-text" },
    ];

    return (
        <section>
            <div className='container flex h-screen flex-col items-center justify-center'>
                <h1 className='scroll-m-20 text-5xl font-bold font-extrabold tracking-tight lg:text-7xl'>
                    <TypewriterEffect words={words} />
                </h1>
                <div className='mt-4 w-full max-w-lg rounded-lg border p-4 backdrop-blur-lg bg-white/30 border-white/20 shadow-lg text-gray-900'>
                    <ScrollArea className='mb-2 h-[250px]' ref={ref}>
                        {error && <div className='text-sm text-red-400'>{error.message}</div>}
                        {messages.map((m) => (
                            <div key={m.id} className='mr-6 whitespace-per-wrap md:mr-12'>
                                {m.role === 'user' && (
                                    <div className='mb-6 flex gap-3'>
                                        <Avatar>
                                            <AvatarImage src='' />
                                            <AvatarFallback className='text-sm'>U</AvatarFallback>
                                        </Avatar>
                                        <div className='mt-1.5'>
                                            <p className='font-semibold'>You</p>
                                            <div className='mt-1.5 text-sm text-zinc-800'>
                                                {m.content}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {m.role === 'assistant' && (
                                    <div className='mb-6 flex gap-3'>
                                        <Avatar>
                                            <AvatarImage src='' />
                                            <AvatarFallback className='bg-red-300 text-white'>AI</AvatarFallback>
                                        </Avatar>
                                        <div className='mt-1.5 w-full'>
                                            <div className = 'flex justify-between'>
                                                <p className='font-semibold'>Assistant</p>
                                                <CopyToClipboard message={m} className='-mt-1'/>
                                            </div>
                                            <div className='mt-1.5 text-sm text-zinc-800'>
                                                {m.content}
                                            </div>
                                        </div>         
                                    </div>
                                )}
                            </div>
                        ))}
                    </ScrollArea>
                    <form onSubmit={handleSubmit} className='relative'>
                        <Input
                            value={input}
                            onChange={handleInputChange}
                            placeholder='How can I help you with...'
                            className='pr-12 placeholder:italic placeholder:text-zinc-600 h-10 backdrop-blur-lg bg-white/30 border-white/20 shadow-lg text-gray-900'
                        />
                        <Button
                            size='icon'
                            type='submit'
                            variant='secondary'
                            disabled={isLoading}
                            className='absolute right-1 top-1 h-8 w-10'
                        >
                            <SendHorizontalIcon className='h-5 w-5 text-zinc-50' />
                        </Button>
                    </form>
                </div>
            </div>
        </section>
    );
}
