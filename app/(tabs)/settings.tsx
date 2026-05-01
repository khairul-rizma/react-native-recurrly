import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HOME_USER } from '@/constants/data'; // Adjust this path to match your data.ts location

// Reusable component for individual setting rows
const SettingItem = ({
                         icon,
                         title,
                         value,
                         isDestructive = false,
                         hideBorder = false
                     }: {
    icon: string;
    title: string;
    value?: string;
    isDestructive?: boolean;
    hideBorder?: boolean;
}) => (
    <Pressable
        className={`flex-row items-center justify-between py-4 ${!hideBorder ? 'border-b border-slate-100' : ''} active:opacity-50`}
    >
        <View className="flex-row items-center">
            <View className="w-8 h-8 bg-slate-100 rounded-full items-center justify-center mr-3">
                <Text className="text-base">{icon}</Text>
            </View>
            <Text className={`text-base font-medium ${isDestructive ? 'text-rose-600' : 'text-slate-800'}`}>
                {title}
            </Text>
        </View>
        <View className="flex-row items-center">
            {value && (
                <Text className="text-slate-400 text-sm font-medium mr-2">{value}</Text>
            )}
            <Text className="text-slate-300 text-lg font-bold">›</Text>
        </View>
    </Pressable>
);

const Settings = () => {
    // Extract initials for the avatar (e.g., "Adrian | JS Mastery" -> "A")
    const initials = HOME_USER?.name ? HOME_USER.name.charAt(0).toUpperCase() : 'U';

    return (
        <SafeAreaView className="flex-1 bg-slate-50">
            <ScrollView
                contentContainerClassName="pb-32 px-6 pt-4" // pb-32 clears the floating tab bar
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View className="mb-6 mt-2">
                    <Text className="text-3xl font-black text-slate-900 tracking-tight">
                        Settings
                    </Text>
                </View>

                {/* User Profile Card */}
                <View className="bg-white rounded-3xl p-5 mb-8 shadow-sm border border-slate-100 flex-row items-center">
                    <View className="w-16 h-16 bg-indigo-600 rounded-full items-center justify-center mr-4">
                        <Text className="text-2xl font-bold text-white">{initials}</Text>
                    </View>
                    <View className="flex-1">
                        <Text className="text-xl font-bold text-slate-900 mb-0.5">
                            {HOME_USER?.name || "User"}
                        </Text>
                        <Text className="text-sm font-medium text-slate-500">
                            Pro Member
                        </Text>
                    </View>
                    <Pressable className="bg-indigo-50 px-4 py-2 rounded-full">
                        <Text className="text-indigo-600 font-bold text-sm">Edit</Text>
                    </Pressable>
                </View>

                {/* Preferences Group */}
                <Text className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-2 mb-3">
                    Preferences
                </Text>
                <View className="bg-white rounded-3xl px-5 shadow-sm border border-slate-100 mb-8">
                    <SettingItem icon="🎨" title="Appearance" value="System" />
                    <SettingItem icon="💵" title="Default Currency" value="USD ($)" />
                    <SettingItem icon="🔔" title="Notifications" />
                    <SettingItem icon="🌐" title="Language" value="English" hideBorder />
                </View>

                {/* Account Group */}
                <Text className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-2 mb-3">
                    Account
                </Text>
                <View className="bg-white rounded-3xl px-5 shadow-sm border border-slate-100 mb-8">
                    <SettingItem icon="💳" title="Payment Methods" value="2 Cards" />
                    <SettingItem icon="🔒" title="Security & Face ID" />
                    <SettingItem icon="📥" title="Export Data" hideBorder />
                </View>

                {/* Support Group */}
                <Text className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-2 mb-3">
                    Support
                </Text>
                <View className="bg-white rounded-3xl px-5 shadow-sm border border-slate-100 mb-8">
                    <SettingItem icon="❓" title="Help Center" />
                    <SettingItem icon="⭐" title="Rate the App" />
                    <SettingItem icon="📄" title="Privacy Policy" hideBorder />
                </View>

                {/* Logout Button */}
                <Pressable className="bg-rose-50 rounded-2xl py-4 items-center justify-center border border-rose-100 active:bg-rose-100 mb-4">
                    <Text className="text-rose-600 font-bold text-lg">Log Out</Text>
                </Pressable>

                {/* App Version */}
                <Text className="text-center text-slate-400 text-xs font-medium">
                    Recurrly v1.0.0
                </Text>

            </ScrollView>
        </SafeAreaView>
    );
};

export default Settings;