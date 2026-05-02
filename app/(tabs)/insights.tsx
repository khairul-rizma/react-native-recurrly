import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSubscriptions } from '@/context/SubscriptionsContext';

const Insights = () => {
    // 1. Pull in your dynamic data
    // @ts-ignore
    const { subscriptions, balance, isLoading } = useSubscriptions();

    // 2. Handle Loading State
    if (isLoading) {
        return (
            <View className="flex-1 bg-[#fff9e3] justify-center items-center">
                <Text className="text-slate-400 font-bold">Loading insights...</Text>
            </View>
        );
    }

    // 3. Dynamic Calculations
    const activeSubscriptions = subscriptions.filter((s: any) => s.status !== 'cancelled');
    const activeCount = activeSubscriptions.length;

    // Group spending by category
    const categoryTotals = activeSubscriptions.reduce((acc: any, sub: any) => {
        const cat = sub.category || 'General';
        acc[cat] = (acc[cat] || 0) + sub.price;
        return acc;
    }, {});

    // Sort categories from highest spend to lowest
    const sortedCategories = Object.entries(categoryTotals)
        .map(([name, amount]) => ({ name, amount: amount as number }))
        .sort((a, b) => b.amount - a.amount);

    const totalSpend = balance.amount || 1; // Prevent divide by zero for progress bars

    // Brand colors for the progress bars
    const barColors = ['bg-[#ea7a53]', 'bg-[#081126]', 'bg-emerald-500', 'bg-amber-500', 'bg-purple-500'];

    return (
        <SafeAreaView className="flex-1 bg-[#fff9e3]">
            <ScrollView
                contentContainerClassName="pb-32 px-6 pt-4"
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View className="mb-8 mt-2">
                    <Text className="text-3xl font-black text-[#081126] tracking-tight">
                        Insights
                    </Text>
                    <Text className="text-base font-medium text-slate-500 mt-1">
                        Your spending at a glance
                    </Text>
                </View>

                {/* Hero Card: Dynamic Total Spending */}
                <View className="bg-[#081126] rounded-[32px] p-7 shadow-sm mb-8">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-slate-400 font-bold text-xs uppercase tracking-widest">
                            Monthly Spend
                        </Text>
                        <View className="bg-white/10 px-3 py-1 rounded-md">
                            <Text className="text-white text-[10px] font-black uppercase tracking-wider">
                                +12% vs last month
                            </Text>
                        </View>
                    </View>
                    <Text className="text-white text-5xl font-black tracking-tighter mb-2">
                        ${balance.amount.toFixed(2)}
                    </Text>
                    <Text className="text-slate-400 text-sm font-bold">
                        Across {activeCount} active subscriptions
                    </Text>
                </View>

                {/* Smart Alerts Section */}
                <Text className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4 mb-3">
                    Smart Alerts
                </Text>
                <View className="gap-4 mb-8">
                    {/* Alert Card 1 */}
                    <View className="bg-[#fff8e7] border border-amber-200 rounded-[24px] p-5 flex-row items-start shadow-sm">
                        <View className="w-10 h-10 bg-amber-100 rounded-full items-center justify-center mr-4">
                            <Text className="text-amber-600 text-lg">⚠️</Text>
                        </View>
                        <View className="flex-1">
                            <Text className="text-[#081126] font-black text-base mb-1">Unused Subscription</Text>
                            <Text className="text-slate-500 font-medium text-sm leading-relaxed">
                                You haven't used Canva Pro in 3 weeks. Consider pausing it to save money.
                            </Text>
                        </View>
                    </View>

                    {/* Alert Card 2 */}
                    <View className="bg-[#fff8e7] border border-emerald-200 rounded-[24px] p-5 flex-row items-start shadow-sm">
                        <View className="w-10 h-10 bg-emerald-100 rounded-full items-center justify-center mr-4">
                            <Text className="text-emerald-600 text-lg">💡</Text>
                        </View>
                        <View className="flex-1">
                            <Text className="text-[#081126] font-black text-base mb-1">Upcoming Renewal</Text>
                            <Text className="text-slate-500 font-medium text-sm leading-relaxed">
                                Adobe Creative Cloud is renewing next week. Ensure your Visa is funded.
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Dynamic Category Breakdown */}
                <View className="flex-row justify-between items-end mb-3 px-2">
                    <Text className="text-xs font-black text-slate-400 uppercase tracking-widest">
                        Top Categories
                    </Text>
                    <Pressable>
                        <Text className="text-[#ea7a53] font-bold text-sm">See all</Text>
                    </Pressable>
                </View>

                <View className="bg-[#fff8e7] rounded-[32px] p-6 shadow-sm border border-slate-200">
                    {sortedCategories.length > 0 ? (
                        sortedCategories.map((category, index) => {
                            const percentage = (category.amount / totalSpend) * 100;
                            // Cycle through the brand colors
                            const colorClass = barColors[index % barColors.length];

                            return (
                                <View key={category.name} className="mb-5 last:mb-0">
                                    <View className="flex-row justify-between mb-2">
                                        <Text className="text-[#081126] font-bold">{category.name}</Text>
                                        <Text className="text-[#081126] font-black">${category.amount.toFixed(2)}</Text>
                                    </View>
                                    {/* Progress Bar Background */}
                                    <View className="w-full h-2.5 bg-[#fff9e3] border border-slate-100 rounded-full overflow-hidden">
                                        {/* Progress Bar Fill */}
                                        <View
                                            className={`h-full rounded-full ${colorClass}`}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </View>
                                </View>
                            );
                        })
                    ) : (
                        <View className="py-4 items-center">
                            <Text className="text-slate-400 font-bold">No active spending data.</Text>
                        </View>
                    )}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

export default Insights;