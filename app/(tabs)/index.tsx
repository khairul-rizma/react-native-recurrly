// import "@/global.css";
// import { Text, View, Pressable, ScrollView } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { Link } from "expo-router";
//
// export default function App() {
//     return (
//         // SafeAreaView ensures content respects notches, status bars, and home indicators
//         <SafeAreaView className="flex-1 bg-slate-50">
//             {/* ScrollView now takes up the remaining safe space */}
//             <ScrollView contentContainerClassName="flex-grow justify-center items-center px-6 py-4">
//
//                 {/* Header Section */}
//                 <View className="items-center mb-10 mt-5">
//                     <Text className="text-6xl font-black text-indigo-600 mb-3 ">
//                         Recurrly
//                     </Text>
//                     <Text className="text-base text-slate-500 text-center px-4 leading-relaxed">
//                         Welcome to your development hub. Select a flow below to test your screens.
//                     </Text>
//                 </View>
//
//                 {/* Navigation Blocks Container */}
//                 <View className="w-full gap-8">
//
//                     {/* Core App Flow Section */}
//                     <View className="w-full gap-3">
//                         <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">
//                             Core App
//                         </Text>
//
//                         <Link href="/onboarding" asChild>
//                             <Pressable className="w-full bg-indigo-600 py-4 rounded-2xl items-center shadow-md active:bg-indigo-700">
//                                 <Text className="text-white font-bold text-lg">Launch Onboarding</Text>
//                             </Pressable>
//                         </Link>
//                     </View>
//
//                     {/* Authentication Section */}
//                     <View className="w-full gap-3">
//                         <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">
//                             Authentication
//                         </Text>
//
//                         <Link href="/(auth)/sign-in" asChild>
//                             <Pressable className="w-full bg-white border border-slate-200 py-4 rounded-2xl items-center shadow-sm active:bg-slate-100">
//                                 <Text className="text-slate-700 font-semibold text-lg">Sign In</Text>
//                             </Pressable>
//                         </Link>
//
//                         <Link href="/(auth)/sign-up" asChild>
//                             <Pressable className="w-full bg-white border border-slate-200 py-4 rounded-2xl items-center shadow-sm active:bg-slate-100">
//                                 <Text className="text-slate-700 font-semibold text-lg">Create an Account</Text>
//                             </Pressable>
//                         </Link>
//                     </View>
//
//                     {/* Subscriptions Section */}
//                     <View className="w-full gap-3">
//                         <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">
//                             Test Subscriptions
//                         </Text>
//
//                         {/* Spotify Button - using emerald/green styling */}
//                         <Link href="/subscriptions/spotify" asChild>
//                             <Pressable className="w-full bg-emerald-50 border border-emerald-200 py-4 rounded-2xl items-center shadow-sm active:bg-emerald-100">
//                                 <Text className="text-emerald-700 font-semibold text-lg">Spotify Subscription</Text>
//                             </Pressable>
//                         </Link>
//
//                         {/* Claude Max Button - using purple styling */}
//                         <Link href={{ pathname: "/subscriptions/[id]", params: { id: "claude" } }} asChild>
//                             <Pressable className="w-full bg-purple-50 border border-purple-200 py-4 rounded-2xl items-center shadow-sm active:bg-purple-100">
//                                 <Text className="text-purple-700 font-semibold text-lg">Claude Max Subscription</Text>
//                             </Pressable>
//                         </Link>
//                     </View>
//
//                 </View>
//
//                 {/* Version Info / Footer */}
//                 <Text className="text-sm font-medium text-slate-400 mt-12 mb-8">
//                     Expo Router • NativeWind v5 by Khairul
//                 </Text>
//
//             </ScrollView>
//         </SafeAreaView>
//     );
// }












// import "@/global.css";
// import React, { useState } from "react";
// import { FlatList, View, Text, Pressable, Image, Platform } from "react-native";
// import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
// import { formatCurrency } from "@/utils/format";
// import {
//     HOME_BALANCE,
//     HOME_USER,
//     HOME_SUBSCRIPTIONS,
//     UPCOMING_SUBSCRIPTIONS,
// } from "@/constants/data";
//
// // ==========================================
// // 1. DATA STRUCTURE DEFINITION
// // ==========================================
// type HomeScreenSectionItem =
//     | { type: "header"; key: "header" }
//     | { type: "balance"; data: typeof HOME_BALANCE; key: "balance" }
//     | { type: "upcoming"; data: UpcomingSubscription[]; heading: string; key: "upcoming" }
//     | { type: "list-header"; title: string; key: "list-header" }
//     | { type: "subscription"; data: Subscription; expanded: boolean; key: string }
//     | { type: "footer"; key: "footer" };
//
// const buildHomeScreenData = (expandedSubId: string | null): HomeScreenSectionItem[] => {
//     return [
//         { type: "header", key: "header" },
//         { type: "balance", data: HOME_BALANCE, key: "balance" },
//         { type: "upcoming", data: UPCOMING_SUBSCRIPTIONS, heading: "Upcoming", key: "upcoming" },
//         { type: "list-header", title: "All Subscriptions", key: "list-header" },
//         ...HOME_SUBSCRIPTIONS.map((sub) => ({
//             type: "subscription" as const,
//             data: sub,
//             expanded: sub.id === expandedSubId,
//             key: `sub-${sub.id}`,
//         })),
//         { type: "footer", key: "footer" },
//     ];
// };
//
// // ==========================================
// // 2. SUPPORTING UTILITIES & REUSABLE COMPONENTS
// // ==========================================
//
// const getStatusColors = (status: string | undefined) => {
//     switch (status?.toLowerCase()) {
//         case "active": return { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" };
//         case "paused": return { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" };
//         case "cancelled": return { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" };
//         default: return { bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200" };
//     }
// };
//
// const ListHeading = ({ title }: { title: string }) => (
//     <View className="mb-4 mt-8 flex-row items-center justify-between">
//         <Text className="text-xl font-bold text-slate-900 tracking-tight">{title}</Text>
//         <Text className="text-sm font-bold text-indigo-600">See all</Text>
//     </View>
// );
//
// const formatBalanceAmount = (amount: number) => `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
// const formatBalanceDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
// }
//
// const StatusBadge = ({ status }: { status: string | undefined }) => {
//     const { bg, text, border } = getStatusColors(status);
//     return (
//         <View className={`self-start px-3 py-1 rounded-full border ${bg} ${border}`}>
//             <Text className={`text-[10px] font-black uppercase tracking-widest ${text}`}>
//                 {status || "active"}
//             </Text>
//         </View>
//     );
// };
//
// // ==========================================
// // 3. COMPONENT RENDERERS FOR FLATLIST
// // ==========================================
//
// const HomeHeader = () => (
//     <View className="flex-row justify-between items-center mb-8">
//         <View className="flex-row items-center">
//             <View className="w-12 h-12 rounded-full bg-white border border-slate-200 items-center justify-center mr-4 shadow-sm">
//                 <Text className="text-indigo-600 text-xl font-black">{HOME_USER.name.charAt(0)}</Text>
//             </View>
//             <View>
//                 <Text className="text-sm font-semibold text-slate-600 mb-0.5">Good morning,</Text>
//                 <Text className="text-xl font-black text-slate-900 tracking-tight">{HOME_USER.name.split(" ")[0]}</Text>
//             </View>
//         </View>
//         <Pressable className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm items-center justify-center active:bg-slate-50">
//             <Text className="text-indigo-600 text-2xl font-medium leading-none mt-[-2px]">+</Text>
//         </Pressable>
//     </View>
// );
//
// const BalanceCard = ({ data }: { data: typeof HOME_BALANCE }) => (
//     <View className="bg-white rounded-[32px] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 mb-2 relative overflow-hidden">
//         {/* Colorful internal card glow */}
//         <View className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-100 rounded-full blur-3xl opacity-60" />
//         <View className="absolute -bottom-10 -left-10 w-32 h-32 bg-emerald-50 rounded-full blur-3xl opacity-60" />
//
//         <Text className="text-sm font-bold text-slate-500 tracking-wider mb-2 uppercase">
//             Total Monthly Spend
//         </Text>
//         <Text className="text-5xl font-black text-slate-900 tracking-tighter mb-4">
//             {formatBalanceAmount(data.amount)}
//         </Text>
//         <View className="flex-row items-center">
//             <View className="w-2 h-2 rounded-full bg-emerald-500 mr-2 shadow-[0_0_4px_rgba(16,185,129,0.4)]" />
//             <Text className="text-sm font-semibold text-slate-500">
//                 Next billing on {formatBalanceDate(data.nextRenewalDate)}
//             </Text>
//         </View>
//     </View>
// );
//
// const UpcomingCard = ({ item }: { item: UpcomingSubscription }) => (
//     // Added a slight translucency (bg-white/90) and backdrop blur style to let the background colors peek through
//     <View className="bg-white/90 rounded-3xl p-5 w-[130px] mr-4 shadow-sm border border-slate-100 items-center overflow-hidden">
//         <View className="w-14 h-14 rounded-full bg-slate-50 items-center justify-center mb-3 border border-slate-100">
//             <Image
//                 source={item.icon}
//                 className="w-7 h-7"
//                 resizeMode="contain"
//             />
//         </View>
//         <Text className="text-sm font-bold text-slate-800 mb-2 text-center" numberOfLines={1}>
//             {item.name}
//         </Text>
//         <View className="bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
//             <Text className="text-xs font-bold text-indigo-700">
//                 In {item.daysLeft} days
//             </Text>
//         </View>
//     </View>
// );
//
// const ExpandableSubscriptionCard = ({ item, expanded, onToggleExpansion }: {
//     item: Subscription;
//     expanded: boolean;
//     onToggleExpansion: () => void;
// }) => {
//     const serviceColor = item.color || "#F8FAFC";
//
//     return (
//         // Added slight translucency here as well
//         <Pressable
//             onPress={onToggleExpansion}
//             className={`bg-white/95 p-5 rounded-[28px] mb-4 border border-slate-100 active:bg-slate-50 transition-colors shadow-sm ${expanded ? "pb-6" : ""}`}
//         >
//             <View className="flex-row items-center">
//                 <View
//                     className="w-14 h-14 rounded-2xl items-center justify-center mr-4"
//                     style={{ backgroundColor: serviceColor }}
//                 >
//                     <Image
//                         source={item.icon}
//                         className="w-8 h-8"
//                         resizeMode="contain"
//                     />
//                 </View>
//
//                 <View className="flex-1 justify-center">
//                     <Text className="text-base font-black text-slate-900 mb-1" numberOfLines={1}>
//                         {item.name}
//                     </Text>
//                     <View className="flex-row items-center">
//                         <StatusBadge status={item.status} />
//                     </View>
//                 </View>
//
//                 <View className="items-end justify-center">
//                     <Text className="text-lg font-black text-slate-900 tracking-tight">
//                         ${item.price.toFixed(2)}
//                     </Text>
//                     <Text className="text-xs font-bold text-slate-400 uppercase mt-0.5">
//                         /{item.billing === "Monthly" ? "mo" : "yr"}
//                     </Text>
//                 </View>
//             </View>
//
//             {expanded && (
//                 <View className="pt-5 mt-5 border-t border-slate-100 border-dashed gap-4">
//                     <View className="flex-row justify-between items-center px-1">
//                         <Text className="text-sm font-semibold text-slate-500">Plan</Text>
//                         <Text className="text-sm font-bold text-slate-900">{item.plan}</Text>
//                     </View>
//                     <View className="flex-row justify-between items-center px-1">
//                         <Text className="text-sm font-semibold text-slate-500">Payment method</Text>
//                         <Text className="text-sm font-bold text-slate-900">{item.paymentMethod || "Not listed"}</Text>
//                     </View>
//                     <View className="flex-row justify-between items-center px-1">
//                         <Text className="text-sm font-semibold text-slate-500">Renewal Date</Text>
//                         <Text className="text-sm font-bold text-slate-900">
//                             {item.renewalDate ? new Date(item.renewalDate).toLocaleDateString() : "-"}
//                         </Text>
//                     </View>
//                     <Pressable className="bg-indigo-600 rounded-xl py-3.5 items-center mt-2 shadow-md shadow-indigo-200 active:bg-indigo-700">
//                         <Text className="text-sm font-bold text-white tracking-wide">Manage Subscription</Text>
//                     </Pressable>
//                 </View>
//             )}
//         </Pressable>
//     );
// };
//
// // ==========================================
// // 4. MAIN HOMESCREEN COMPONENT
// // ==========================================
//
// // New component to generate the colorful gradient background
// const BackgroundGlow = () => (
//     <View className="absolute inset-0 overflow-hidden pointer-events-none bg-slate-50/50">
//         <View className="absolute top-[-5%] left-[-10%] w-72 h-72 bg-indigo-200 rounded-full blur-[80px] opacity-40" />
//         <View className="absolute top-[20%] right-[-10%] w-80 h-80 bg-emerald-100 rounded-full blur-[100px] opacity-40" />
//         <View className="absolute bottom-[10%] left-[20%] w-96 h-96 bg-rose-100 rounded-full blur-[120px] opacity-30" />
//     </View>
// );
//
// export default function HomeScreen() {
//     const [expandedSubId, setExpandedSubId] = useState<string | null>(null);
//     const screenData = buildHomeScreenData(expandedSubId);
//
//     return (
//         <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={["top", "left", "right"]}>
//             {/* Colorful Background Layer */}
//             <BackgroundGlow />
//
//             <FlatList
//                 data={screenData}
//                 keyExtractor={(item) => item.key}
//                 contentContainerClassName={`px-6 pt-2 ${Platform.OS === 'ios' ? 'pb-28' : 'pb-24'}`}
//                 showsVerticalScrollIndicator={false}
//                 renderItem={({ item }) => {
//                     switch (item.type) {
//                         case "header":
//                             return <HomeHeader />;
//                         case "balance":
//                             return <BalanceCard data={item.data} />;
//                         case "upcoming":
//                             return (
//                                 <View className="mb-2">
//                                     <ListHeading title={item.heading} />
//                                     <FlatList
//                                         data={item.data}
//                                         keyExtractor={(sub) => `upcoming-${sub.id}`}
//                                         horizontal
//                                         showsHorizontalScrollIndicator={false}
//                                         contentContainerClassName="py-2"
//                                         renderItem={({ item: upcomingItem }) => (
//                                             <UpcomingCard item={upcomingItem} />
//                                         )}
//                                     />
//                                 </View>
//                             );
//                         case "list-header":
//                             return <ListHeading title={item.title} />;
//                         case "subscription":
//                             return (
//                                 <ExpandableSubscriptionCard
//                                     item={item.data}
//                                     expanded={item.expanded}
//                                     onToggleExpansion={() =>
//                                         setExpandedSubId((prev) => (prev === item.data.id ? null : item.data.id))
//                                     }
//                                 />
//                             );
//                         case "footer":
//                             return (
//                                 <View className="items-center mt-12 mb-8 gap-2">
//                                     <View className="w-12 h-1 bg-slate-200 rounded-full mb-2" />
//                                     <Text className="text-xs font-bold text-slate-400 tracking-wider">
//                                         SECURELY ENCRYPTED
//                                     </Text>
//                                 </View>
//                             );
//                         default:
//                             return null;
//                     }
//                 }}
//             />
//         </SafeAreaView>
//     );
// }



















//
import "@/global.css";
import React, { useState, useMemo } from "react";
import {
    FlatList,
    View,
    Text,
    Pressable,
    Image,
    Platform,
    Modal,
    TextInput,
    Keyboard,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    ScrollView,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { HOME_USER } from "@/constants/data";
import { icons } from "@/constants/icons";
import { useSubscriptions } from "@/context/SubscriptionsContext";

// ─── Palette ──────────────────────────────────────────────────────────────────
const C = {
    bg:     '#fff9e3',
    card:   '#fff8e7',
    navy:   '#081126',
    coral:  '#ea7a53',
    border: '#e2e8f0',
    muted:  '#94a3b8',
    muted2: '#64748b',
    white:  '#ffffff',
};

// ─── Categories ───────────────────────────────────────────────────────────────
const CATEGORIES: { label: string; emoji: string; color: string }[] = [
    { label: 'Entertainment', emoji: '🎬', color: '#7c3aed' },
    { label: 'Music',         emoji: '🎵', color: '#db2777' },
    { label: 'Productivity',  emoji: '⚡',  color: '#0891b2' },
    { label: 'Health',        emoji: '💪', color: '#16a34a' },
    { label: 'Finance',       emoji: '💳', color: '#ea7a53' },
    { label: 'Gaming',        emoji: '🎮', color: '#9333ea' },
    { label: 'Cloud',         emoji: '☁️',  color: '#2563eb' },
    { label: 'News',          emoji: '📰', color: '#b45309' },
    { label: 'Education',     emoji: '📚', color: '#0d9488' },
    { label: 'Shopping',      emoji: '🛍️',  color: '#e11d48' },
    { label: 'Food',          emoji: '🍔', color: '#ea580c' },
    { label: 'General',       emoji: '📦', color: '#475569' },
];

const getCategoryConfig = (label?: string) =>
    CATEGORIES.find((c) => c.label === label) ?? CATEGORIES[CATEGORIES.length - 1];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getStatusConfig = (status?: string) => {
    switch (status?.toLowerCase()) {
        case 'active':    return { bg: '#d1fae5', text: '#065f46', dot: '#10b981' };
        case 'paused':    return { bg: '#fef3c7', text: '#92400e', dot: '#f59e0b' };
        case 'cancelled': return { bg: '#fee2e2', text: '#991b1b', dot: '#ef4444' };
        default:          return { bg: '#f1f5f9', text: '#475569', dot: '#94a3b8' };
    }
};

const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
};

const getDayLabel = () =>
    new Date().toLocaleDateString('en-MY', {
        weekday: 'long', day: 'numeric', month: 'long',
    });

// ─── Sub-components ───────────────────────────────────────────────────────────

const SectionLabel = ({
                          text, count, action, onAction,
                      }: { text: string; count?: number; action?: string; onAction?: () => void }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: 14 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={{ fontSize: 10, fontWeight: '900', color: C.muted,
                textTransform: 'uppercase', letterSpacing: 2.5 }}>{text}</Text>
            {count !== undefined && (
                <View style={{ backgroundColor: C.border, borderRadius: 10,
                    paddingHorizontal: 7, paddingVertical: 2 }}>
                    <Text style={{ fontSize: 9, fontWeight: '900', color: C.muted2 }}>{count}</Text>
                </View>
            )}
        </View>
        {action && (
            <Pressable onPress={onAction}>
                <Text style={{ fontSize: 11, fontWeight: '700', color: C.coral }}>{action}</Text>
            </Pressable>
        )}
    </View>
);

const HeroCard = ({
                      balance, activeCount, totalCount, yearlyEstimate,
                  }: {
    balance: number; activeCount: number; totalCount: number; yearlyEstimate: number;
}) => (
    <View style={{
        backgroundColor: C.navy,
        borderRadius: 32, padding: 28, marginBottom: 16,
        shadowColor: C.navy,
        shadowOffset: { width: 0, height: 14 },
        shadowOpacity: 0.4, shadowRadius: 28,
        elevation: 12, overflow: 'hidden',
    }}>
        <View style={{ position: 'absolute', top: -50, right: -50,
            width: 180, height: 180, borderRadius: 90,
            backgroundColor: C.coral, opacity: 0.13 }} />
        <View style={{ position: 'absolute', bottom: -40, left: -30,
            width: 130, height: 130, borderRadius: 65,
            backgroundColor: '#3b82f6', opacity: 0.09 }} />

        <View style={{ flexDirection: 'row', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: 10 }}>
            <Text style={{ fontSize: 10, fontWeight: '800', color: C.muted,
                letterSpacing: 2.5, textTransform: 'uppercase' }}>Monthly Spend</Text>
            <View style={{ backgroundColor: '#10b981' + '25', paddingHorizontal: 12,
                paddingVertical: 5, borderRadius: 20 }}>
                <Text style={{ fontSize: 9, fontWeight: '900', color: '#34d399',
                    textTransform: 'uppercase', letterSpacing: 1 }}>↓ RM 120 saved</Text>
            </View>
        </View>

        <Text style={{ fontSize: 52, fontWeight: '900', color: C.white,
            letterSpacing: -2, marginBottom: 4 }}>
            {balance.toFixed(2)}
        </Text>
        <Text style={{ fontSize: 13, fontWeight: '700', color: '#475569', marginBottom: 24 }}>
            MYR / month  ·  ≈ MYR {yearlyEstimate.toFixed(0)} / year
        </Text>

        <View style={{ height: 1, backgroundColor: '#1e293b', marginBottom: 20 }} />

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {[
                { label: 'Active',  value: `${activeCount}`, accent: '#10b981' },
                { label: 'Total',   value: `${totalCount}`,  accent: C.muted   },
                { label: 'Yearly',  value: `${yearlyEstimate.toFixed(0)}`, accent: C.coral },
            ].map(({ label, value, accent }) => (
                <View key={label} style={{ alignItems: 'center', flex: 1 }}>
                    <Text style={{ color: accent, fontSize: 22, fontWeight: '900' }}>{value}</Text>
                    <Text style={{ color: '#475569', fontSize: 9, fontWeight: '700',
                        textTransform: 'uppercase', letterSpacing: 1.5, marginTop: 2 }}>{label}</Text>
                </View>
            ))}
        </View>
    </View>
);

const InsightBanner = ({ subscriptions }: { subscriptions: any[] }) => {
    const highest = useMemo(() =>
        [...subscriptions].sort((a, b) => b.price - a.price)[0], [subscriptions]);
    if (!highest) return null;

    return (
        <View style={{
            flexDirection: 'row', alignItems: 'center',
            backgroundColor: C.navy,
            borderRadius: 22, padding: 18, marginBottom: 16,
            shadowColor: C.navy,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.2, shadowRadius: 14,
            overflow: 'hidden',
        }}>
            <View style={{ position: 'absolute', top: -20, right: -20,
                width: 80, height: 80, borderRadius: 40,
                backgroundColor: C.coral, opacity: 0.1 }} />
            <View style={{
                width: 40, height: 40, borderRadius: 14,
                backgroundColor: C.coral + '25',
                alignItems: 'center', justifyContent: 'center', marginRight: 14,
            }}>
                <Text style={{ fontSize: 18 }}>🧠</Text>
            </View>
            <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 9, fontWeight: '900', color: C.muted,
                    textTransform: 'uppercase', letterSpacing: 2, marginBottom: 4 }}>
                    Smart Insight
                </Text>
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#cbd5e1', lineHeight: 18 }}>
                    Your biggest expense is{' '}
                    <Text style={{ fontWeight: '900', color: C.coral }}>{highest.name}</Text>
                    {' '}at{' '}
                    <Text style={{ fontWeight: '900', color: C.white }}>
                        MYR {highest.price.toFixed(2)}/mo
                    </Text>
                </Text>
            </View>
        </View>
    );
};

const SpendingBreakdown = ({ subscriptions }: { subscriptions: any[] }) => {
    const active = subscriptions.filter((s: any) => s.status !== 'cancelled');
    const total  = active.reduce((sum: number, s: any) => sum + s.price, 0);
    const top3   = active.slice(0, 3);
    const COLORS  = [C.coral, C.navy, '#3b82f6'];
    if (top3.length === 0) return null;

    return (
        <View style={{
            backgroundColor: C.card, borderRadius: 28,
            padding: 22, marginBottom: 16,
            borderWidth: 1, borderColor: C.border,
            shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.04, shadowRadius: 8,
        }}>
            <SectionLabel text="Spending Breakdown" />
            {top3.map((s: any, idx: number) => {
                const pct = total ? (s.price / total) * 100 : 0;
                return (
                    <View key={s.id} style={{ marginBottom: idx < top3.length - 1 ? 16 : 0 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between',
                            alignItems: 'center', marginBottom: 7 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                <View style={{
                                    width: 28, height: 28, borderRadius: 9,
                                    backgroundColor: s.color || C.coral,
                                    alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <Image source={s.icon} style={{ width: 16, height: 16 }} resizeMode="contain" />
                                </View>
                                <Text style={{ fontSize: 13, fontWeight: '800', color: C.navy }}>{s.name}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                <Text style={{ fontSize: 12, fontWeight: '900', color: C.navy }}>
                                    MYR {s.price.toFixed(2)}
                                </Text>
                                <View style={{ backgroundColor: C.border, borderRadius: 8,
                                    paddingHorizontal: 6, paddingVertical: 2 }}>
                                    <Text style={{ fontSize: 9, fontWeight: '900', color: C.muted2 }}>
                                        {pct.toFixed(0)}%
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ height: 6, backgroundColor: '#f1f5f9',
                            borderRadius: 99, overflow: 'hidden' }}>
                            <View style={{
                                height: '100%', width: `${Math.max(pct, 2)}%`,
                                backgroundColor: COLORS[idx], borderRadius: 99,
                            }} />
                        </View>
                    </View>
                );
            })}
        </View>
    );
};

const UpcomingCard = ({ item }: { item: any }) => {
    const urgent = item.daysLeft <= 3;
    return (
        <View style={{
            width: 148,
            backgroundColor: urgent ? '#fff1f2' : C.card,
            borderRadius: 26, padding: 18, marginRight: 12,
            borderWidth: 1,
            borderColor: urgent ? '#fecdd3' : C.border,
            shadowColor: urgent ? '#ef4444' : '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: urgent ? 0.1 : 0.04,
            shadowRadius: 10,
        }}>
            <View style={{
                width: 44, height: 44, borderRadius: 14,
                backgroundColor: item.color || '#f1f5f9',
                alignItems: 'center', justifyContent: 'center',
                marginBottom: 14,
                shadowColor: item.color,
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.25, shadowRadius: 6,
            }}>
                <Image source={item.icon} style={{ width: 24, height: 24 }} resizeMode="contain" />
            </View>

            <Text style={{ fontSize: 14, fontWeight: '900', color: C.navy, marginBottom: 4 }}
                  numberOfLines={1}>{item.name}</Text>

            <View style={{
                alignSelf: 'flex-start',
                backgroundColor: urgent ? '#ef4444' + '18' : C.coral + '18',
                borderRadius: 12, paddingHorizontal: 8, paddingVertical: 3,
                marginBottom: 12,
            }}>
                <Text style={{ fontSize: 9, fontWeight: '900',
                    color: urgent ? '#ef4444' : C.coral,
                    textTransform: 'uppercase', letterSpacing: 1 }}>
                    {urgent ? '⚡ Due soon' : `In ${item.daysLeft}d`}
                </Text>
            </View>

            <Text style={{ fontSize: 18, fontWeight: '900', color: C.navy }}>
                {item.price?.toFixed(2)}
            </Text>
            <Text style={{ fontSize: 9, fontWeight: '700', color: C.muted,
                textTransform: 'uppercase' }}>MYR / mo</Text>
        </View>
    );
};

const SubscriptionCard = ({ item, expanded, onToggle, onEdit, onRemove }: any) => {
    const status  = getStatusConfig(item.status);
    const catCfg  = getCategoryConfig(item.category);

    return (
        <Pressable
            onPress={onToggle}
            style={({ pressed }) => ({
                backgroundColor: expanded ? C.white : C.card,
                borderRadius: 26, padding: 18,
                marginBottom: 10, marginHorizontal: 20,
                borderWidth: 1, borderColor: C.border,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: expanded ? 6 : 2 },
                shadowOpacity: expanded ? 0.08 : 0.04,
                shadowRadius: expanded ? 16 : 6,
                elevation: expanded ? 4 : 1,
                opacity: pressed ? 0.95 : 1,
            })}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {/* Icon */}
                <View style={{
                    width: 50, height: 50, borderRadius: 16,
                    backgroundColor: item.color || '#f1f5f9',
                    alignItems: 'center', justifyContent: 'center',
                    marginRight: 14,
                    shadowColor: item.color,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.28, shadowRadius: 8,
                }}>
                    <Image source={item.icon} style={{ width: 28, height: 28 }} resizeMode="contain" />
                </View>

                {/* Name & status */}
                <View style={{ flex: 1 }}>
                    {/* Category pill */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                        <Text style={{ fontSize: 11 }}>{catCfg.emoji}</Text>
                        <Text style={{ fontSize: 9, fontWeight: '800', color: catCfg.color,
                            textTransform: 'uppercase', letterSpacing: 2 }}>
                            {item.category || 'General'}
                        </Text>
                    </View>
                    <Text style={{ fontSize: 15, fontWeight: '900', color: C.navy, marginBottom: 6 }}>
                        {item.name}
                    </Text>
                    <View style={{
                        flexDirection: 'row', alignItems: 'center',
                        backgroundColor: status.bg, alignSelf: 'flex-start',
                        paddingHorizontal: 9, paddingVertical: 3, borderRadius: 20,
                    }}>
                        <View style={{ width: 5, height: 5, borderRadius: 3,
                            backgroundColor: status.dot, marginRight: 5 }} />
                        <Text style={{ fontSize: 9, fontWeight: '900', color: status.text,
                            textTransform: 'uppercase', letterSpacing: 1 }}>
                            {item.status || 'active'}
                        </Text>
                    </View>
                </View>

                {/* Price + chevron */}
                <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: 17, fontWeight: '900', color: C.navy }}>
                        {item.price.toFixed(2)}
                    </Text>
                    <Text style={{ fontSize: 9, fontWeight: '700', color: C.muted,
                        textTransform: 'uppercase' }}>MYR / mo</Text>
                    <Text style={{ fontSize: 11, color: '#cbd5e1', marginTop: 8,
                        transform: [{ rotate: expanded ? '180deg' : '0deg' }] }}>▼</Text>
                </View>
            </View>

            {expanded && (
                <View>
                    <View style={{
                        backgroundColor: '#f8fafc', borderRadius: 14,
                        padding: 13, marginTop: 16,
                        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                    }}>
                        <Text style={{ fontSize: 11, fontWeight: '600', color: C.muted2 }}>
                            📅  Annual cost
                        </Text>
                        <Text style={{ fontSize: 13, fontWeight: '900', color: C.navy }}>
                            MYR {(item.price * 12).toFixed(2)}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
                        <Pressable
                            onPress={() => onRemove(item.id)}
                            style={({ pressed }) => ({
                                flex: 1, backgroundColor: pressed ? '#fee2e2' : '#fff1f2',
                                paddingVertical: 13, borderRadius: 16,
                                alignItems: 'center', borderWidth: 1, borderColor: '#fecdd3',
                            })}
                        >
                            <Text style={{ color: '#e11d48', fontWeight: '800', fontSize: 13 }}>
                                🗑  Delete
                            </Text>
                        </Pressable>
                        <Pressable
                            onPress={() => onEdit(item)}
                            style={({ pressed }) => ({
                                flex: 1, backgroundColor: C.coral,
                                paddingVertical: 13, borderRadius: 16,
                                alignItems: 'center', opacity: pressed ? 0.85 : 1,
                            })}
                        >
                            <Text style={{ color: C.white, fontWeight: '800', fontSize: 13 }}>
                                ✏️  Edit
                            </Text>
                        </Pressable>
                    </View>
                </View>
            )}
        </Pressable>
    );
};

// ─── Category Picker ──────────────────────────────────────────────────────────

const CategoryPicker = ({
                            selected,
                            onSelect,
                        }: {
    selected: string;
    onSelect: (label: string) => void;
}) => (
    <View style={{ marginBottom: 20 }}>
        <Text style={{
            fontSize: 10, fontWeight: '900', color: C.muted,
            textTransform: 'uppercase', letterSpacing: 2,
            marginLeft: 4, marginBottom: 12,
        }}>
            Category
        </Text>
        {/* 3-column grid */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {CATEGORIES.map((cat) => {
                const isSelected = selected === cat.label;
                return (
                    <Pressable
                        key={cat.label}
                        onPress={() => onSelect(cat.label)}
                        style={({ pressed }) => ({
                            flexBasis: '30.5%',
                            paddingVertical: 12,
                            paddingHorizontal: 6,
                            borderRadius: 18,
                            alignItems: 'center',
                            backgroundColor: isSelected ? cat.color + '18' : '#f8fafc',
                            borderWidth: 1.5,
                            borderColor: isSelected ? cat.color : C.border,
                            opacity: pressed ? 0.75 : 1,
                        })}
                    >
                        <Text style={{ fontSize: 20, marginBottom: 5 }}>{cat.emoji}</Text>
                        <Text style={{
                            fontSize: 9,
                            fontWeight: '900',
                            textTransform: 'uppercase',
                            letterSpacing: 0.8,
                            textAlign: 'center',
                            color: isSelected ? cat.color : C.muted2,
                        }}>
                            {cat.label}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    </View>
);

// ─── Modal Label ──────────────────────────────────────────────────────────────

const ModalLabel = ({ text }: { text: string }) => (
    <Text style={{ fontSize: 10, fontWeight: '900', color: C.muted,
        textTransform: 'uppercase', letterSpacing: 2,
        marginLeft: 4, marginBottom: 8 }}>{text}</Text>
);

const modalInputStyle = {
    backgroundColor: C.white,
    borderWidth: 1.5, borderColor: C.border,
    borderRadius: 18, padding: 16, marginBottom: 16,
    fontSize: 15, fontWeight: '700' as const, color: C.navy,
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function HomeScreen() {
    const {
        subscriptions, upcomingSubscriptions, balance,
        addSubscription, removeSubscription, updateSubscription, isLoading,
    } = useSubscriptions();

    const [expanded, setExpanded]   = useState<string | null>(null);
    const [modal, setModal]         = useState(false);
    const [editingSubId, setEditId] = useState<string | null>(null);
    const [name, setName]           = useState('');
    const [price, setPrice]         = useState('');
    const [status, setStatus]       = useState<'active' | 'paused' | 'cancelled'>('active');
    const [category, setCategory]   = useState('General');

    if (isLoading) return (
        <View style={{ flex: 1, backgroundColor: C.bg, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: C.muted, fontWeight: '800', fontSize: 12,
                letterSpacing: 2, textTransform: 'uppercase' }}>Loading…</Text>
        </View>
    );

    const activeSubs   = subscriptions.filter((s: any) => s.status === 'active');
    const totalBalance = balance.amount || 0;
    const yearlyEst    = totalBalance * 12;
    const firstName    = HOME_USER.name.split(' ')[0];
    const initial      = HOME_USER.name.charAt(0);

    const openEdit = (item: any) => {
        setEditId(item.id);
        setName(item.name);
        setPrice(item.price.toString());
        setStatus(item.status as any);
        setCategory(item.category || 'General');
        setModal(true);
    };

    const closeModal = () => {
        setModal(false); setEditId(null);
        setName(''); setPrice('');
        setStatus('active'); setCategory('General');
        Keyboard.dismiss();
    };

    const save = () => {
        if (!name || !price) return;
        const priceNum = parseFloat(price) || 0;
        const catCfg   = getCategoryConfig(category);

        if (editingSubId) {
            const old = subscriptions.find((s: any) => s.id === editingSubId);
            if (old) updateSubscription(editingSubId, {
                ...old, name, price: priceNum, status, category, color: catCfg.color,
            });
        } else {
            addSubscription({
                id: Date.now().toString(),
                icon: icons.wallet,
                name, price: priceNum, status,
                billing: 'Monthly', category, color: catCfg.color,
            });
        }
        closeModal();
    };

    // ── List Header ───────────────────────────────────────────────────────────
    const ListHeader = (
        <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
            {/* Greeting row */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: 24 }}>
                <View>
                    <Text style={{ fontSize: 11, fontWeight: '700', color: C.muted,
                        textTransform: 'uppercase', letterSpacing: 2, marginBottom: 3 }}>
                        {getGreeting()}
                    </Text>
                    <Text style={{ fontSize: 30, fontWeight: '900', color: C.navy,
                        letterSpacing: -0.5 }}>{firstName}</Text>
                    <Text style={{ fontSize: 11, fontWeight: '600', color: C.muted,
                        marginTop: 2 }}>{getDayLabel()}</Text>
                </View>
                <View style={{
                    width: 52, height: 52,
                    backgroundColor: C.navy,
                    borderRadius: 20,
                    alignItems: 'center', justifyContent: 'center',
                    shadowColor: C.navy,
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.25, shadowRadius: 12,
                }}>
                    <Text style={{ color: C.white, fontWeight: '900', fontSize: 22 }}>{initial}</Text>
                </View>
            </View>

            <HeroCard
                balance={totalBalance}
                activeCount={activeSubs.length}
                totalCount={subscriptions.length}
                yearlyEstimate={yearlyEst}
            />
            <InsightBanner subscriptions={subscriptions} />
            <SpendingBreakdown subscriptions={subscriptions} />

            {/* Upcoming Renewals */}
            <View style={{ marginBottom: 24 }}>
                <SectionLabel
                    text="Upcoming Renewals"
                    count={upcomingSubscriptions.length}
                />
                {upcomingSubscriptions.length > 0 ? (
                    <ScrollView
                        horizontal showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingRight: 4 }}
                    >
                        {upcomingSubscriptions.map((item: any) => (
                            <UpcomingCard key={item.id} item={item} />
                        ))}
                    </ScrollView>
                ) : (
                    <View style={{
                        backgroundColor: C.card, borderRadius: 22,
                        padding: 20, borderWidth: 1, borderColor: C.border,
                        alignItems: 'center',
                    }}>
                        <Text style={{ fontSize: 24, marginBottom: 6 }}>🎉</Text>
                        <Text style={{ fontSize: 13, fontWeight: '700', color: C.muted2 }}>
                            No renewals coming up soon
                        </Text>
                    </View>
                )}
            </View>

            <SectionLabel
                text="All Subscriptions"
                count={subscriptions.length}
            />
        </View>
    );

    // ── Render ────────────────────────────────────────────────────────────────
    const insets = useSafeAreaInsets();
    // Tab bar height (49pt standard) + bottom inset + breathing room
    const fabBottom = insets.bottom + 49 + 16;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
            <FlatList
                data={subscriptions}
                keyExtractor={(i) => i.id}
                contentContainerStyle={{ paddingBottom: 130 }}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={ListHeader}
                renderItem={({ item }) => (
                    <SubscriptionCard
                        item={item}
                        expanded={expanded === item.id}
                        onToggle={() => setExpanded(expanded === item.id ? null : item.id)}
                        onRemove={removeSubscription}
                        onEdit={openEdit}
                    />
                )}
                ListEmptyComponent={
                    <View style={{
                        marginHorizontal: 20, paddingVertical: 48,
                        alignItems: 'center', justifyContent: 'center',
                        backgroundColor: C.card, borderRadius: 28,
                        borderWidth: 1.5, borderColor: C.border,
                        borderStyle: 'dashed',
                    }}>
                        <Text style={{ fontSize: 36, marginBottom: 12 }}>📭</Text>
                        <Text style={{ fontSize: 16, fontWeight: '900', color: C.navy,
                            marginBottom: 6 }}>No Subscriptions Yet</Text>
                        <Text style={{ fontSize: 12, fontWeight: '500', color: C.muted,
                            textAlign: 'center', paddingHorizontal: 24 }}>
                            Tap + to start tracking your recurring expenses
                        </Text>
                    </View>
                }
            />

            {/* FAB */}
            <Pressable
                onPress={() => { setEditId(null); setModal(true); }}
                style={({ pressed }) => ({
                    position: 'absolute', bottom: fabBottom, right: 20,
                    backgroundColor: C.navy,
                    width: 58, height: 58, borderRadius: 20,
                    alignItems: 'center', justifyContent: 'center',
                    shadowColor: C.navy,
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.35, shadowRadius: 16,
                    elevation: 8,
                    opacity: pressed ? 0.85 : 1,
                })}
            >
                <Text style={{ color: C.white, fontSize: 28, fontWeight: '300',
                    marginTop: -3, lineHeight: 30 }}>+</Text>
            </Pressable>

            {/* ── Add / Edit Modal ──────────────────────────────────── */}
            <Modal visible={modal} transparent animationType="slide" onRequestClose={closeModal}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    {/* Dimmed backdrop — tap to dismiss */}
                    <Pressable
                        style={{ flex: 1, backgroundColor: 'rgba(8,17,38,0.55)' }}
                        onPress={() => { Keyboard.dismiss(); closeModal(); }}
                    />

                    {/* Sheet */}
                    <View style={{
                        backgroundColor: C.card,
                        borderTopLeftRadius: 40, borderTopRightRadius: 40,
                        paddingHorizontal: 24,
                        paddingTop: 12,
                        paddingBottom: Platform.OS === 'ios' ? 40 : 28,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: -8 },
                        shadowOpacity: 0.15, shadowRadius: 24,
                        maxHeight: '92%',
                    }}>
                        {/* Drag handle */}
                        <View style={{
                            width: 40, height: 4, borderRadius: 2,
                            backgroundColor: C.border,
                            alignSelf: 'center', marginBottom: 20,
                        }} />

                        {/* Modal header */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between',
                            alignItems: 'center', marginBottom: 24 }}>
                            <View>
                                <Text style={{ fontSize: 24, fontWeight: '900', color: C.navy }}>
                                    {editingSubId ? '✏️  Edit' : '＋  Add'} Expense
                                </Text>
                                <Text style={{ fontSize: 11, color: C.muted,
                                    fontWeight: '600', marginTop: 2 }}>
                                    {editingSubId
                                        ? 'Update your subscription details'
                                        : 'Track a new recurring expense'}
                                </Text>
                            </View>
                            <Pressable
                                onPress={closeModal}
                                style={({ pressed }) => ({
                                    width: 36, height: 36, borderRadius: 18,
                                    backgroundColor: pressed ? C.border : '#f1f5f9',
                                    alignItems: 'center', justifyContent: 'center',
                                })}
                            >
                                <Text style={{ fontSize: 14, color: C.muted2, fontWeight: '700' }}>✕</Text>
                            </Pressable>
                        </View>

                        {/* Scrollable form body */}
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                            contentContainerStyle={{ paddingBottom: 8 }}
                        >
                            {/* Service name */}
                            <ModalLabel text="Service Name" />
                            <TextInput
                                style={modalInputStyle}
                                placeholder="e.g. Netflix, Spotify…"
                                placeholderTextColor="#c0c8d6"
                                value={name}
                                onChangeText={setName}
                            />

                            {/* Price */}
                            <ModalLabel text="Monthly Price (MYR)" />
                            <TextInput
                                style={[modalInputStyle, { marginBottom: 20 }]}
                                placeholder="0.00"
                                placeholderTextColor="#c0c8d6"
                                keyboardType="numeric"
                                value={price}
                                onChangeText={setPrice}
                            />

                            {/* Category picker */}
                            <CategoryPicker
                                selected={category}
                                onSelect={setCategory}
                            />

                            {/* Status */}
                            <ModalLabel text="Status" />
                            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 28 }}>
                                {(['active', 'paused', 'cancelled'] as const).map((s) => {
                                    const cfg      = getStatusConfig(s);
                                    const selected = status === s;
                                    return (
                                        <Pressable
                                            key={s}
                                            onPress={() => setStatus(s)}
                                            style={{
                                                flex: 1, paddingVertical: 14,
                                                borderRadius: 18, alignItems: 'center',
                                                backgroundColor: selected ? cfg.bg : '#f8fafc',
                                                borderWidth: 1.5,
                                                borderColor: selected ? cfg.dot : C.border,
                                            }}
                                        >
                                            <View style={{
                                                width: 6, height: 6, borderRadius: 3,
                                                backgroundColor: cfg.dot, marginBottom: 5,
                                            }} />
                                            <Text style={{
                                                fontSize: 10, fontWeight: '900',
                                                textTransform: 'uppercase', letterSpacing: 1,
                                                color: selected ? cfg.text : C.muted,
                                            }}>{s}</Text>
                                        </Pressable>
                                    );
                                })}
                            </View>

                            {/* Save */}
                            <Pressable
                                onPress={save}
                                style={({ pressed }) => ({
                                    backgroundColor: C.navy, paddingVertical: 18,
                                    borderRadius: 22, alignItems: 'center',
                                    opacity: pressed ? 0.85 : 1,
                                    shadowColor: C.navy,
                                    shadowOffset: { width: 0, height: 8 },
                                    shadowOpacity: 0.3, shadowRadius: 16,
                                })}
                            >
                                <Text style={{ color: C.white, fontSize: 16,
                                    fontWeight: '900', letterSpacing: 0.5 }}>
                                    {editingSubId ? 'Update Subscription' : 'Save Subscription'}
                                </Text>
                            </Pressable>
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </SafeAreaView>
    );
}