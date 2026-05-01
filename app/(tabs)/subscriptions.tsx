import React from 'react';
import { View, Text, ScrollView, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HOME_SUBSCRIPTIONS } from '@/constants/data'; // Adjust this path if needed

const Subscriptions = () => {
    // Helper function to color-code the status badge
    const getStatusStyle = (status?: string) => {
        switch (status?.toLowerCase()) {
            case 'active':
                return { bg: 'bg-emerald-100', text: 'text-emerald-700' };
            case 'paused':
                return { bg: 'bg-amber-100', text: 'text-amber-700' };
            case 'cancelled':
                return { bg: 'bg-rose-100', text: 'text-rose-700' };
            default:
                return { bg: 'bg-slate-100', text: 'text-slate-700' };
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-50">
            <ScrollView
                contentContainerClassName="pb-32 px-6 pt-4" // pb-32 protects content from the floating tab bar
                showsVerticalScrollIndicator={false}
            >
                {/* Header Section */}
                <View className="flex-row justify-between items-end mb-6 mt-2">
                    <View>
                        <Text className="text-3xl font-black text-slate-900 tracking-tight">
                            Subscriptions
                        </Text>
                        <Text className="text-base text-slate-500 mt-1">
                            Manage your recurring payments
                        </Text>
                    </View>

                    {/* Add Button */}
                    <Pressable className="bg-indigo-100 w-12 h-12 rounded-full items-center justify-center shadow-sm active:bg-indigo-200">
                        <Text className="text-indigo-600 font-medium text-2xl leading-none mt-[-2px]">+</Text>
                    </Pressable>
                </View>

                {/* Filter Pills */}
                <View className="flex-row gap-3 mb-6">
                    <Pressable className="bg-indigo-600 px-5 py-2.5 rounded-full shadow-sm">
                        <Text className="text-white font-semibold text-sm">All</Text>
                    </Pressable>
                    <Pressable className="bg-white border border-slate-200 px-5 py-2.5 rounded-full shadow-sm">
                        <Text className="text-slate-600 font-semibold text-sm">Active</Text>
                    </Pressable>
                    <Pressable className="bg-white border border-slate-200 px-5 py-2.5 rounded-full shadow-sm">
                        <Text className="text-slate-600 font-semibold text-sm">Cancelled</Text>
                    </Pressable>
                </View>

                {/* Subscriptions List */}
                <View className="gap-4">
                    {HOME_SUBSCRIPTIONS.map((sub) => {
                        const statusStyle = getStatusStyle(sub.status);

                        return (
                            <Pressable
                                key={sub.id}
                                className="bg-white p-4 rounded-3xl flex-row items-center shadow-sm border border-slate-100 active:bg-slate-50"
                            >
                                {/* Icon with dynamic background color */}
                                <View
                                    className="w-14 h-14 rounded-2xl items-center justify-center mr-4"
                                    style={{ backgroundColor: sub.color || '#F3F4F6' }}
                                >
                                    <Image
                                        source={sub.icon}
                                        className="w-8 h-8"
                                        resizeMode="contain"
                                    />
                                </View>

                                {/* Subscription Details */}
                                <View className="flex-1">
                                    <Text className="text-base font-bold text-slate-900 mb-0.5">
                                        {sub.name}
                                    </Text>
                                    <Text className="text-sm font-medium text-slate-500 mb-1.5">
                                        {sub.plan}
                                    </Text>

                                    {/* Status Badge */}
                                    <View className={`self-start px-2.5 py-1 rounded-md ${statusStyle.bg}`}>
                                        <Text className={`text-xs font-bold uppercase tracking-wider ${statusStyle.text}`}>
                                            {sub.status}
                                        </Text>
                                    </View>
                                </View>

                                {/* Price & Billing */}
                                <View className="items-end">
                                    <Text className="text-lg font-black text-slate-900">
                                        ${sub.price.toFixed(2)}
                                    </Text>
                                    <Text className="text-xs font-semibold text-slate-400 mt-1 uppercase">
                                        /{sub.billing === 'Monthly' ? 'mo' : 'yr'}
                                    </Text>
                                </View>
                            </Pressable>
                        );
                    })}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

export default Subscriptions;