import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Insights = () => {
    return (
        <SafeAreaView className="flex-1 bg-slate-50">
            <ScrollView
                contentContainerClassName="pb-32 px-6 pt-4" // pb-32 gives space for your floating tab bar
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View className="mb-8 mt-2">
                    <Text className="text-3xl font-black text-slate-900 tracking-tight">
                        Insights
                    </Text>
                    <Text className="text-base text-slate-500 mt-1">
                        Your spending at a glance
                    </Text>
                </View>

                {/* Hero Card: Total Spending */}
                <View className="bg-indigo-600 rounded-3xl p-6 shadow-md mb-8">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-indigo-100 font-medium text-sm uppercase tracking-wider">
                            Monthly Spend
                        </Text>
                        <View className="bg-indigo-500/50 px-3 py-1 rounded-full">
                            <Text className="text-white text-xs font-bold">+12% vs last month</Text>
                        </View>
                    </View>
                    <Text className="text-white text-5xl font-black tracking-tighter mb-1">
                        $147.48
                    </Text>
                    <Text className="text-indigo-200 text-sm font-medium">
                        Across 8 active subscriptions
                    </Text>
                </View>

                {/* Smart Alerts Section */}
                <Text className="text-lg font-bold text-slate-900 mb-4">Smart Alerts</Text>
                <View className="gap-4 mb-8">
                    {/* Alert Card 1 */}
                    <View className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex-row items-start shadow-sm">
                        <View className="w-10 h-10 bg-amber-100 rounded-full items-center justify-center mr-4">
                            <Text className="text-amber-600 text-lg">⚠️</Text>
                        </View>
                        <View className="flex-1">
                            <Text className="text-amber-900 font-bold text-base mb-1">Unused Subscription</Text>
                            <Text className="text-amber-700/80 text-sm leading-relaxed">
                                You haven't used Canva Pro in 3 weeks. Consider pausing it to save $119.99/yr.
                            </Text>
                        </View>
                    </View>

                    {/* Alert Card 2 */}
                    <View className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex-row items-start shadow-sm">
                        <View className="w-10 h-10 bg-emerald-100 rounded-full items-center justify-center mr-4">
                            <Text className="text-emerald-600 text-lg">💡</Text>
                        </View>
                        <View className="flex-1">
                            <Text className="text-emerald-900 font-bold text-base mb-1">Upcoming Renewal</Text>
                            <Text className="text-emerald-700/80 text-sm leading-relaxed">
                                Adobe Creative Cloud is renewing next week. Ensure your Visa ending in 8530 is funded.
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Category Breakdown */}
                <View className="flex-row justify-between items-end mb-4">
                    <Text className="text-lg font-bold text-slate-900">Top Categories</Text>
                    <Pressable>
                        <Text className="text-indigo-600 font-semibold text-sm">See all</Text>
                    </Pressable>
                </View>

                <View className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">

                    {/* Category Item 1 */}
                    <View className="mb-5">
                        <View className="flex-row justify-between mb-2">
                            <Text className="text-slate-700 font-semibold">Design Tools</Text>
                            <Text className="text-slate-900 font-bold">$77.49</Text>
                        </View>
                        {/* Progress Bar Background */}
                        <View className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                            {/* Progress Bar Fill */}
                            <View className="h-full bg-indigo-500 rounded-full" style={{ width: '55%' }} />
                        </View>
                    </View>

                    {/* Category Item 2 */}
                    <View className="mb-5">
                        <View className="flex-row justify-between mb-2">
                            <Text className="text-slate-700 font-semibold">AI Tools</Text>
                            <Text className="text-slate-900 font-bold">$40.00</Text>
                        </View>
                        <View className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                            <View className="h-full bg-purple-500 rounded-full" style={{ width: '30%' }} />
                        </View>
                    </View>

                    {/* Category Item 3 */}
                    <View>
                        <View className="flex-row justify-between mb-2">
                            <Text className="text-slate-700 font-semibold">Developer Tools</Text>
                            <Text className="text-slate-900 font-bold">$9.99</Text>
                        </View>
                        <View className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                            <View className="h-full bg-emerald-500 rounded-full" style={{ width: '15%' }} />
                        </View>
                    </View>

                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

export default Insights;