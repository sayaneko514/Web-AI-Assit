'use client'

import React from 'react';
import { cn } from '@/lib/utils';
import { type Message } from 'ai';
import { Button } from '@/components/ui/button';
import { CheckIcon, CopyIcon } from 'lucide-react';
import { useClipboard } from "@/app/hooks/use-clipboard";


interface ChatMessageActionsProps extends React.ComponentProps<'div'> {
    message: Message
}

export default function CopyToClipboard({
    message,
    className,
    ...props
}: ChatMessageActionsProps) {
    const { isCopied, copyToClipboard } = useClipboard({ timeout: 2000 })
    const onCopy = () => {
        if (isCopied) return
        copyToClipboard(message.content)
    }

    return (
        <div className={cn('', className)} {...props}>
            <Button
                variant='ghost'
                size='icon'
                className='h-8 w-8 '
                onClick={onCopy}
            >
                {isCopied ? (
                    <CheckIcon className='h-4 w-4 text-red-400' />
                ) : (
                    <CopyIcon className='h-4 w-4 text-zinc-400' />
                )}
                <span className='sr-only'>Copy message</span>
            </Button>
        </div>
    )
}
