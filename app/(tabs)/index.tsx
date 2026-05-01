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





import "@/global.css";
import React, { useState } from "react";
import { FlatList, View, Text, Pressable, Image, Platform } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { formatCurrency } from "@/utils/format";
import {
    HOME_BALANCE,
    HOME_USER,
    HOME_SUBSCRIPTIONS,
    UPCOMING_SUBSCRIPTIONS,
} from "@/constants/data";

// ==========================================
// 1. DATA STRUCTURE DEFINITION
// ==========================================
type HomeScreenSectionItem =
    | { type: "header"; key: "header" }
    | { type: "balance"; data: typeof HOME_BALANCE; key: "balance" }
    | { type: "upcoming"; data: UpcomingSubscription[]; heading: string; key: "upcoming" }
    | { type: "list-header"; title: string; key: "list-header" }
    | { type: "subscription"; data: Subscription; expanded: boolean; key: string }
    | { type: "footer"; key: "footer" };

const buildHomeScreenData = (expandedSubId: string | null): HomeScreenSectionItem[] => {
    return [
        { type: "header", key: "header" },
        { type: "balance", data: HOME_BALANCE, key: "balance" },
        { type: "upcoming", data: UPCOMING_SUBSCRIPTIONS, heading: "Upcoming", key: "upcoming" },
        { type: "list-header", title: "All Subscriptions", key: "list-header" },
        ...HOME_SUBSCRIPTIONS.map((sub) => ({
            type: "subscription" as const,
            data: sub,
            expanded: sub.id === expandedSubId,
            key: `sub-${sub.id}`,
        })),
        { type: "footer", key: "footer" },
    ];
};

// ==========================================
// 2. SUPPORTING UTILITIES & REUSABLE COMPONENTS
// ==========================================

const getStatusColors = (status: string | undefined) => {
    switch (status?.toLowerCase()) {
        case "active": return { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" };
        case "paused": return { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" };
        case "cancelled": return { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" };
        default: return { bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200" };
    }
};

const ListHeading = ({ title }: { title: string }) => (
    <View className="mb-4 mt-8 flex-row items-center justify-between">
        <Text className="text-xl font-bold text-slate-900 tracking-tight">{title}</Text>
        <Text className="text-sm font-bold text-indigo-600">See all</Text>
    </View>
);

const formatBalanceAmount = (amount: number) => `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const formatBalanceDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const StatusBadge = ({ status }: { status: string | undefined }) => {
    const { bg, text, border } = getStatusColors(status);
    return (
        <View className={`self-start px-3 py-1 rounded-full border ${bg} ${border}`}>
            <Text className={`text-[10px] font-black uppercase tracking-widest ${text}`}>
                {status || "active"}
            </Text>
        </View>
    );
};

// ==========================================
// 3. COMPONENT RENDERERS FOR FLATLIST
// ==========================================

const HomeHeader = () => (
    <View className="flex-row justify-between items-center mb-8">
        <View className="flex-row items-center">
            <View className="w-12 h-12 rounded-full bg-white border border-slate-200 items-center justify-center mr-4 shadow-sm">
                <Text className="text-indigo-600 text-xl font-black">{HOME_USER.name.charAt(0)}</Text>
            </View>
            <View>
                <Text className="text-sm font-semibold text-slate-600 mb-0.5">Good morning,</Text>
                <Text className="text-xl font-black text-slate-900 tracking-tight">{HOME_USER.name.split(" ")[0]}</Text>
            </View>
        </View>
        <Pressable className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm items-center justify-center active:bg-slate-50">
            <Text className="text-indigo-600 text-2xl font-medium leading-none mt-[-2px]">+</Text>
        </Pressable>
    </View>
);

const BalanceCard = ({ data }: { data: typeof HOME_BALANCE }) => (
    <View className="bg-white rounded-[32px] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 mb-2 relative overflow-hidden">
        {/* Colorful internal card glow */}
        <View className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-100 rounded-full blur-3xl opacity-60" />
        <View className="absolute -bottom-10 -left-10 w-32 h-32 bg-emerald-50 rounded-full blur-3xl opacity-60" />

        <Text className="text-sm font-bold text-slate-500 tracking-wider mb-2 uppercase">
            Total Monthly Spend
        </Text>
        <Text className="text-5xl font-black text-slate-900 tracking-tighter mb-4">
            {formatBalanceAmount(data.amount)}
        </Text>
        <View className="flex-row items-center">
            <View className="w-2 h-2 rounded-full bg-emerald-500 mr-2 shadow-[0_0_4px_rgba(16,185,129,0.4)]" />
            <Text className="text-sm font-semibold text-slate-500">
                Next billing on {formatBalanceDate(data.nextRenewalDate)}
            </Text>
        </View>
    </View>
);

const UpcomingCard = ({ item }: { item: UpcomingSubscription }) => (
    // Added a slight translucency (bg-white/90) and backdrop blur style to let the background colors peek through
    <View className="bg-white/90 rounded-3xl p-5 w-[130px] mr-4 shadow-sm border border-slate-100 items-center overflow-hidden">
        <View className="w-14 h-14 rounded-full bg-slate-50 items-center justify-center mb-3 border border-slate-100">
            <Image
                source={item.icon}
                className="w-7 h-7"
                resizeMode="contain"
            />
        </View>
        <Text className="text-sm font-bold text-slate-800 mb-2 text-center" numberOfLines={1}>
            {item.name}
        </Text>
        <View className="bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
            <Text className="text-xs font-bold text-indigo-700">
                In {item.daysLeft} days
            </Text>
        </View>
    </View>
);

const ExpandableSubscriptionCard = ({ item, expanded, onToggleExpansion }: {
    item: Subscription;
    expanded: boolean;
    onToggleExpansion: () => void;
}) => {
    const serviceColor = item.color || "#F8FAFC";

    return (
        // Added slight translucency here as well
        <Pressable
            onPress={onToggleExpansion}
            className={`bg-white/95 p-5 rounded-[28px] mb-4 border border-slate-100 active:bg-slate-50 transition-colors shadow-sm ${expanded ? "pb-6" : ""}`}
        >
            <View className="flex-row items-center">
                <View
                    className="w-14 h-14 rounded-2xl items-center justify-center mr-4"
                    style={{ backgroundColor: serviceColor }}
                >
                    <Image
                        source={item.icon}
                        className="w-8 h-8"
                        resizeMode="contain"
                    />
                </View>

                <View className="flex-1 justify-center">
                    <Text className="text-base font-black text-slate-900 mb-1" numberOfLines={1}>
                        {item.name}
                    </Text>
                    <View className="flex-row items-center">
                        <StatusBadge status={item.status} />
                    </View>
                </View>

                <View className="items-end justify-center">
                    <Text className="text-lg font-black text-slate-900 tracking-tight">
                        ${item.price.toFixed(2)}
                    </Text>
                    <Text className="text-xs font-bold text-slate-400 uppercase mt-0.5">
                        /{item.billing === "Monthly" ? "mo" : "yr"}
                    </Text>
                </View>
            </View>

            {expanded && (
                <View className="pt-5 mt-5 border-t border-slate-100 border-dashed gap-4">
                    <View className="flex-row justify-between items-center px-1">
                        <Text className="text-sm font-semibold text-slate-500">Plan</Text>
                        <Text className="text-sm font-bold text-slate-900">{item.plan}</Text>
                    </View>
                    <View className="flex-row justify-between items-center px-1">
                        <Text className="text-sm font-semibold text-slate-500">Payment method</Text>
                        <Text className="text-sm font-bold text-slate-900">{item.paymentMethod || "Not listed"}</Text>
                    </View>
                    <View className="flex-row justify-between items-center px-1">
                        <Text className="text-sm font-semibold text-slate-500">Renewal Date</Text>
                        <Text className="text-sm font-bold text-slate-900">
                            {item.renewalDate ? new Date(item.renewalDate).toLocaleDateString() : "-"}
                        </Text>
                    </View>
                    <Pressable className="bg-indigo-600 rounded-xl py-3.5 items-center mt-2 shadow-md shadow-indigo-200 active:bg-indigo-700">
                        <Text className="text-sm font-bold text-white tracking-wide">Manage Subscription</Text>
                    </Pressable>
                </View>
            )}
        </Pressable>
    );
};

// ==========================================
// 4. MAIN HOMESCREEN COMPONENT
// ==========================================

// New component to generate the colorful gradient background
const BackgroundGlow = () => (
    <View className="absolute inset-0 overflow-hidden pointer-events-none bg-slate-50/50">
        <View className="absolute top-[-5%] left-[-10%] w-72 h-72 bg-indigo-200 rounded-full blur-[80px] opacity-40" />
        <View className="absolute top-[20%] right-[-10%] w-80 h-80 bg-emerald-100 rounded-full blur-[100px] opacity-40" />
        <View className="absolute bottom-[10%] left-[20%] w-96 h-96 bg-rose-100 rounded-full blur-[120px] opacity-30" />
    </View>
);

export default function HomeScreen() {
    const [expandedSubId, setExpandedSubId] = useState<string | null>(null);
    const screenData = buildHomeScreenData(expandedSubId);

    return (
        <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={["top", "left", "right"]}>
            {/* Colorful Background Layer */}
            <BackgroundGlow />

            <FlatList
                data={screenData}
                keyExtractor={(item) => item.key}
                contentContainerClassName={`px-6 pt-2 ${Platform.OS === 'ios' ? 'pb-28' : 'pb-24'}`}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                    switch (item.type) {
                        case "header":
                            return <HomeHeader />;
                        case "balance":
                            return <BalanceCard data={item.data} />;
                        case "upcoming":
                            return (
                                <View className="mb-2">
                                    <ListHeading title={item.heading} />
                                    <FlatList
                                        data={item.data}
                                        keyExtractor={(sub) => `upcoming-${sub.id}`}
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        contentContainerClassName="py-2"
                                        renderItem={({ item: upcomingItem }) => (
                                            <UpcomingCard item={upcomingItem} />
                                        )}
                                    />
                                </View>
                            );
                        case "list-header":
                            return <ListHeading title={item.title} />;
                        case "subscription":
                            return (
                                <ExpandableSubscriptionCard
                                    item={item.data}
                                    expanded={item.expanded}
                                    onToggleExpansion={() =>
                                        setExpandedSubId((prev) => (prev === item.data.id ? null : item.data.id))
                                    }
                                />
                            );
                        case "footer":
                            return (
                                <View className="items-center mt-12 mb-8 gap-2">
                                    <View className="w-12 h-1 bg-slate-200 rounded-full mb-2" />
                                    <Text className="text-xs font-bold text-slate-400 tracking-wider">
                                        SECURELY ENCRYPTED
                                    </Text>
                                </View>
                            );
                        default:
                            return null;
                    }
                }}
            />
        </SafeAreaView>
    );
}