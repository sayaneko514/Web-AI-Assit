'use client';

import { ToolInvocation } from 'ai';
import { useChat } from 'ai/react';
import { useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SendHorizontalIcon } from 'lucide-react';
import { TypewriterEffect } from './ui/typingText';
import { ScrollArea } from '@/components/ui/scrollArea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import CopyToClipboard from '@/components/copyToClipboard';
import ReactMarkdown from 'react-markdown';


const getConfirmationLabel = (result: string) => {
    if (result.includes('booked')) {
        return 'Booking Confirmation';
    } else if (result.includes('canceled')) {
        return 'Cancellation Confirmation';
    } else if (result.includes('rescheduled')) {
        return 'Rescheduling Confirmation';
    }
    return 'System Confirmation';
};

export default function Chat() {
    const ref = useRef<HTMLDivElement>(null);
    const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
        maxToolRoundtrips: 5
    });

    useEffect(() => {
        if (ref.current === null) return;
        ref.current.scrollTo(0, ref.current.scrollHeight);
    }, [messages]);

    const title = [
        { text: "Welcome" },
        { text: "to" },
        { text: "HairLab.", className: "bg-gradient-to-r from-[#f9ce34] to-[#6228d7] inline-block text-transparent bg-clip-text" },
    ];

    return (
        <section>
            <div className='container flex h-screen flex-col items-center justify-center'>
                <h1>
                    <TypewriterEffect words={title} />
                </h1>
                <div className='mt-4 w-full max-w-lg rounded-lg border p-4 backdrop-blur-lg bg-white/30 border border-black/[0.2] dark:border-white/[0.2] shadow-xl text-gray-900'>
                    <ScrollArea className='mb-2 h-[250px]' ref={ref}>
                        {error && <div className='text-sm text-red-400'>{error.message}</div>}
                        {messages.map((m) => (
                            <div key={m.id} className='mr-6 whitespace-per-wrap'>
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
                                {m.role === 'assistant' && !m.toolInvocations && (
                                    <div className='mb-6 flex gap-3'>
                                        <Avatar>
                                            <AvatarImage src='' />
                                            <AvatarFallback className='bg-red-300 text-white'>AI</AvatarFallback>
                                        </Avatar>
                                        <div className='mt-1.5 w-full'>
                                            <div className='flex justify-between'>
                                                <p className='font-semibold'>Assistant</p>
                                                <CopyToClipboard message={m} className='-mt-1' />
                                            </div>
                                            <div className='mt-1.5 text-sm text-zinc-800'>
                                                <ReactMarkdown>{m.content}</ReactMarkdown>
                                            </div>
                                        </div>         
                                    </div>
                                )}
                                {m.toolInvocations?.map((toolInvocation: ToolInvocation) => {
                                    const toolCallId = toolInvocation.toolCallId;
                                    const confirmationMessage = 'result' in toolInvocation
                                        ? toolInvocation.result as string
                                        : 'Processing...';
                                    const confirmationLabel = getConfirmationLabel(confirmationMessage);
                                    return (
                                        <div className='mb-6 flex gap-3' key={toolCallId}>
                                            <Avatar>
                                                <AvatarImage src='' />
                                                <AvatarFallback className='bg-yellow-300 text-white'>S</AvatarFallback>
                                            </Avatar>
                                            <div className='mt-1.5 w-full'>
                                                <div className='flex justify-between'>
                                                    <p className='font-semibold'>{confirmationLabel}</p>
                                                </div>
                                                <div className='mt-1.5 text-sm text-zinc-800 italic'>
                                                    <ReactMarkdown>{confirmationMessage}</ReactMarkdown>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
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
