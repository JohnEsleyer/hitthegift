'use client'

import { AppStore, makeStore } from '@/lib/store';
import {useRef} from 'react';
import {Provider} from 'react-redux';

interface StoreProviderProps{
    children: React.ReactNode;
}

export default function StoreProvider({
    children
}: StoreProviderProps){
    const storeRef = useRef<AppStore>();
    if (!storeRef.current){
        storeRef.current = makeStore();
    }

    return <Provider store={storeRef.current}>{children}</Provider>
}