// import React, { createContext, useState, useContext, ReactNode } from 'react';
// import { HOME_SUBSCRIPTIONS, UPCOMING_SUBSCRIPTIONS, HOME_BALANCE } from '@/constants/data';
//
// // Define what our context will look like
// interface SubscriptionsContextType {
//     subscriptions: Subscription[];
//     upcomingSubscriptions: UpcomingSubscription[];
//     balance: typeof HOME_BALANCE;
//     addSubscription: (sub: Subscription) => void;
//     removeSubscription: (id: string) => void;
// }
//
// const SubscriptionsContext = createContext<SubscriptionsContextType | undefined>(undefined);
//
// export const SubscriptionsProvider = ({ children }: { children: ReactNode }) => {
//     // Initialize state with your data.ts values
//     const [subscriptions, setSubscriptions] = useState<Subscription[]>(HOME_SUBSCRIPTIONS);
//     const [upcomingSubscriptions, setUpcomingSubscriptions] = useState<UpcomingSubscription[]>(UPCOMING_SUBSCRIPTIONS);
//     const [balance, setBalance] = useState(HOME_BALANCE);
//
//     // Function to add a new expense
//     const addSubscription = (sub: Subscription) => {
//         setSubscriptions(prev => [sub, ...prev]);
//         // Automatically update the total balance
//         setBalance(prev => ({ ...prev, amount: prev.amount + sub.price }));
//     };
//
//     // Function to remove an expense
//     const removeSubscription = (id: string) => {
//         const subToRemove = subscriptions.find(s => s.id === id);
//         if (subToRemove) {
//             setSubscriptions(prev => prev.filter((sub) => sub.id !== id));
//             // Automatically reduce the total balance
//             setBalance(prev => ({ ...prev, amount: prev.amount - subToRemove.price }));
//         }
//     };
//
//     return (
//         <SubscriptionsContext.Provider value={{
//             subscriptions,
//             upcomingSubscriptions,
//             balance,
//             addSubscription,
//             removeSubscription
//         }}>
//             {children}
//         </SubscriptionsContext.Provider>
//     );
// };
//
// // Custom hook to use the context easily
// export const useSubscriptions = () => {
//     const context = useContext(SubscriptionsContext);
//     if (!context) {
//         throw new Error('useSubscriptions must be used within a SubscriptionsProvider');
//     }
//     return context;
// };



import React, { createContext, useState, useContext, ReactNode } from 'react';
import { HOME_SUBSCRIPTIONS, UPCOMING_SUBSCRIPTIONS, HOME_BALANCE } from '@/constants/data';

interface SubscriptionsContextType {
    subscriptions: Subscription[];
    upcomingSubscriptions: UpcomingSubscription[];
    balance: typeof HOME_BALANCE;
    addSubscription: (sub: Subscription) => void;
    removeSubscription: (id: string) => void;
    updateSubscription: (id: string, updatedSub: Subscription) => void; // <-- 1. Add to type
}

const SubscriptionsContext = createContext<SubscriptionsContextType | undefined>(undefined);

export const SubscriptionsProvider = ({ children }: { children: ReactNode }) => {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>(HOME_SUBSCRIPTIONS);
    const [upcomingSubscriptions, setUpcomingSubscriptions] = useState<UpcomingSubscription[]>(UPCOMING_SUBSCRIPTIONS);
    const [balance, setBalance] = useState(HOME_BALANCE);

    const addSubscription = (sub: Subscription) => {
        setSubscriptions(prev => [sub, ...prev]);
        setBalance(prev => ({ ...prev, amount: prev.amount + sub.price }));
    };

    const removeSubscription = (id: string) => {
        const subToRemove = subscriptions.find(s => s.id === id);
        if (subToRemove) {
            setSubscriptions(prev => prev.filter((sub) => sub.id !== id));
            setBalance(prev => ({ ...prev, amount: prev.amount - subToRemove.price }));
        }
    };

    // 2. Add the update function
    const updateSubscription = (id: string, updatedSub: Subscription) => {
        setSubscriptions(prev => {
            const oldSubIndex = prev.findIndex(s => s.id === id);
            if (oldSubIndex === -1) return prev;

            const oldPrice = prev[oldSubIndex].price;
            const newPrice = updatedSub.price;

            // Adjust balance: remove old price, add new price
            setBalance(b => ({ ...b, amount: b.amount - oldPrice + newPrice }));

            const newSubs = [...prev];
            newSubs[oldSubIndex] = updatedSub;
            return newSubs;
        });
    };

    return (
        <SubscriptionsContext.Provider value={{
            subscriptions, upcomingSubscriptions, balance,
            addSubscription, removeSubscription, updateSubscription // <-- 3. Expose it
        }}>
            {children}
        </SubscriptionsContext.Provider>
    );
};

export const useSubscriptions = () => {
    const context = useContext(SubscriptionsContext);
    if (!context) throw new Error('useSubscriptions must be used within a SubscriptionsProvider');
    return context;
};