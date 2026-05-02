import React from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HOME_USER } from '@/constants/data';
import { useAuth } from '@/context/AuthContext'; // Import your Auth Context

// Reusable component for individual setting rows
const SettingItem = ({
                         icon,
                         title,
                         value,
                         isDestructive = false,
                         hideBorder = false,
                         onPress
                     }: {
    icon: string;
    title: string;
    value?: string;
    isDestructive?: boolean;
    hideBorder?: boolean;
    onPress?: () => void;
}) => (
    <Pressable
        onPress={onPress}
        className={`flex-row items-center justify-between py-4 ${!hideBorder ? 'border-b border-slate-100' : ''} active:opacity-50`}
    >
        <View className="flex-row items-center">
            <View className="w-8 h-8 bg-[#fff9e3] rounded-full items-center justify-center mr-3 border border-slate-100">
                <Text className="text-base">{icon}</Text>
            </View>
            <Text className={`text-base font-bold ${isDestructive ? 'text-rose-600' : 'text-[#081126]'}`}>
                {title}
            </Text>
        </View>
        <View className="flex-row items-center">
            {value && (
                <Text className="text-slate-400 text-sm font-bold mr-2">{value}</Text>
            )}
            <Text className="text-slate-300 text-lg font-bold">›</Text>
        </View>
    </Pressable>
);

const Settings = () => {
    const { logout } = useAuth(); // Access the logout function
    const initials = HOME_USER?.name ? HOME_USER.name.charAt(0).toUpperCase() : 'U';

    const handleLogout = () => {
        Alert.alert(
            "Log Out",
            "Are you sure you want to log out of Recurly?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Log Out",
                    style: "destructive",
                    onPress: () => logout()
                }
            ]
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-[#fff9e3]">
            <ScrollView
                contentContainerClassName="pb-32 px-6 pt-4"
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View className="mb-6 mt-2">
                    <Text className="text-3xl font-black text-[#081126] tracking-tight">
                        Settings
                    </Text>
                </View>

                {/* User Profile Card */}
                <View className="bg-[#fff8e7] rounded-[32px] p-6 mb-8 shadow-sm border border-slate-200 flex-row items-center">
                    <View className="w-16 h-16 bg-[#081126] rounded-full items-center justify-center mr-4">
                        <Text className="text-2xl font-black text-white">{initials}</Text>
                    </View>
                    <View className="flex-1">
                        <Text className="text-xl font-black text-[#081126] mb-0.5">
                            {HOME_USER?.name || "User"}
                        </Text>
                        <View className="bg-[#ea7a53]/10 self-start px-2 py-0.5 rounded-md">
                            <Text className="text-[10px] font-black text-[#ea7a53] uppercase tracking-widest">
                                Pro Member
                            </Text>
                        </View>
                    </View>
                    <Pressable className="bg-white border border-slate-200 px-4 py-2 rounded-xl active:bg-slate-50">
                        <Text className="text-[#081126] font-bold text-sm">Edit</Text>
                    </Pressable>
                </View>

                {/* Preferences Group */}
                <Text className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4 mb-3">
                    Preferences
                </Text>
                <View className="bg-[#fff8e7] rounded-[32px] px-5 shadow-sm border border-slate-200 mb-8">
                    <SettingItem icon="🎨" title="Appearance" value="Light" />
                    <SettingItem icon="💵" title="Default Currency" value="MYR (RM)" />
                    <SettingItem icon="🔔" title="Notifications" />
                    <SettingItem icon="🌐" title="Language" value="English" hideBorder />
                </View>

                {/* Account Group */}
                <Text className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4 mb-3">
                    Account
                </Text>
                <View className="bg-[#fff8e7] rounded-[32px] px-5 shadow-sm border border-slate-200 mb-8">
                    <SettingItem icon="💳" title="Payment Methods" value="2 Cards" />
                    <SettingItem icon="🔒" title="Security & Face ID" />
                    <SettingItem icon="📥" title="Export Data" hideBorder />
                </View>

                {/* Logout Button */}
                <Pressable
                    onPress={handleLogout}
                    className="bg-rose-50 rounded-2xl py-4 items-center justify-center border border-rose-100 active:bg-rose-100 mb-6"
                >
                    <Text className="text-rose-600 font-black text-lg">Log Out</Text>
                </Pressable>

                {/* App Version */}
                <Text className="text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                    Recurly v1.0.0 — Smart Billing
                </Text>

            </ScrollView>
        </SafeAreaView>
    );
};

export default Settings;