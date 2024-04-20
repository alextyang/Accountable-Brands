"use client";

import { useTransition } from 'react';
import { confirmChoice, rejectChoice } from '../../../lib/utils/iconPicker/actions';
import { useRouter } from 'next/navigation';

// COMPONENT: Option to lower score of icon error/conflict
export function RejectButton({ iconKey, message, tableName }: { iconKey: string, message: string | undefined, tableName: string }) {

    const router = useRouter();
    const [isTransitionStarted, startTransition] = useTransition();

    if (!message || message.length < 2) return '';

    const action = rejectChoice.bind(null, tableName, iconKey);

    return (
        <p className="text-sm opacity-75 hover:opacity-100 hover:underline cursor-pointer" onClick={async () => {
            await action();
            startTransition(router.refresh);
        }}>{message}</p>
    );
}

// COMPONENT: Option to raise score of icon error/conflict
export function ConfirmButton({ iconKey, message, tableName }: { iconKey: string, message: string | undefined, tableName: string }) {

    const router = useRouter();
    const [isTransitionStarted, startTransition] = useTransition();

    if (!message || message.length < 2) return '';

    const action = confirmChoice.bind(null, tableName, iconKey);

    return (
        <p className="text-sm opacity-75 hover:opacity-100 hover:underline cursor-pointer" onClick={async () => {
            await action();
            startTransition(router.refresh);
        }}>{message}</p>
    );
}