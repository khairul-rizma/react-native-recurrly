import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HOME_SUBSCRIPTIONS } from '@/constants/data';

// 1. Define the Type Interface
interface SubscriptionsContextType {
    subscriptions: any[];
    addSubscription: (newSub: any) => void;
    removeSubscription: (id: string) => void;
    updateSubscription: (id: string, updatedFields: any) => void;
    balance: { amount: number };
    isLoading: boolean; // ✅ Added this to fix your error
}

const STORAGE_KEY = '@recurly_subscriptions';

// 2. Initialize context with the type
const SubscriptionsContext = createContext<SubscriptionsContextType | undefined>(undefined);

export const SubscriptionsProvider = ({ children }: { children: React.ReactNode }) => {
    const [subscriptions, setSubscriptions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadStoredData = async () => {
            try {
                const savedData = await AsyncStorage.getItem(STORAGE_KEY);
                if (savedData !== null) {
                    setSubscriptions(JSON.parse(savedData));
                } else {
                    setSubscriptions(HOME_SUBSCRIPTIONS);
                }
            } catch (e) {
                console.error("Error loading subscriptions:", e);
            } finally {
                setIsLoading(false);
            }
        };
        loadStoredData();
    }, []);

    useEffect(() => {
        const saveData = async () => {
            if (!isLoading) {
                try {
                    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(subscriptions));
                } catch (e) {
                    console.error("Error saving subscriptions:", e);
                }
            }
        };
        saveData();
    }, [subscriptions, isLoading]);

    const addSubscription = (newSub: any) => {
        setSubscriptions((prev) => [newSub, ...prev]);
    };

    const removeSubscription = (id: string) => {
        setSubscriptions((prev) => prev.filter(sub => sub.id !== id));
    };

    const updateSubscription = (id: string, updatedFields: any) => {
        setSubscriptions((prev) =>
            prev.map(sub => (sub.id === id ? { ...sub, ...updatedFields } : sub))
        );
    };

    const balance = useMemo(() => {
        return {
            amount: subscriptions.reduce((acc, curr) => {
                if (curr.status?.toLowerCase() === 'cancelled') return acc;
                return acc + (curr.price || 0);
            }, 0)
        };
    }, [subscriptions]);

    return (
        <SubscriptionsContext.Provider value={{
            subscriptions,
            addSubscription,
            removeSubscription,
            updateSubscription,
            balance,
            isLoading // ✅ This now matches the Interface above
        }}>
            {children}
        </SubscriptionsContext.Provider>
    );
};

// 3. Updated Hook with Error Handling
export const useSubscriptions = () => {
    const context = useContext(SubscriptionsContext);
    if (!context) {
        throw new Error("useSubscriptions must be used within a SubscriptionsProvider");
    }
    return context;
};