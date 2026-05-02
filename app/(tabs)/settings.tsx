import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    Pressable,
    Alert,
    Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HOME_USER } from '@/constants/data';
import { useAuth } from '@/context/AuthContext';

// ─── Types ────────────────────────────────────────────────────────────────────

type SettingItemProps = {
    icon: string;
    title: string;
    subtitle?: string;
    value?: string;
    isDestructive?: boolean;
    hideBorder?: boolean;
    isToggle?: boolean;
    toggleValue?: boolean;
    onToggle?: (v: boolean) => void;
    onPress?: () => void;
    badge?: string;
};

// ─── SettingItem ──────────────────────────────────────────────────────────────

const SettingItem = ({
                         icon,
                         title,
                         subtitle,
                         value,
                         isDestructive = false,
                         hideBorder = false,
                         isToggle = false,
                         toggleValue = false,
                         onToggle,
                         onPress,
                         badge,
                     }: SettingItemProps) => (
    <Pressable
        onPress={!isToggle ? onPress : undefined}
        className={`flex-row items-center py-4 ${
            !hideBorder ? 'border-b border-[#1e2a45]' : ''
        } active:opacity-60`}
        style={({ pressed }) => ({ opacity: pressed && !isToggle ? 0.6 : 1 })}
    >
        {/* Icon bubble */}
        <View className="w-10 h-10 rounded-2xl items-center justify-center mr-4"
              style={{ backgroundColor: isDestructive ? '#3d1a1a' : '#1a2540' }}>
            <Text className="text-xl">{icon}</Text>
        </View>

        {/* Labels */}
        <View className="flex-1">
            <View className="flex-row items-center">
                <Text
                    className={`text-[15px] font-bold tracking-tight ${
                        isDestructive ? 'text-rose-400' : 'text-[#e8edf5]'
                    }`}
                >
                    {title}
                </Text>
                {badge && (
                    <View className="ml-2 bg-[#ea7a53] px-2 py-0.5 rounded-full">
                        <Text className="text-[9px] font-black text-white uppercase tracking-widest">
                            {badge}
                        </Text>
                    </View>
                )}
            </View>
            {subtitle && (
                <Text className="text-xs text-[#4a5a7a] font-medium mt-0.5">{subtitle}</Text>
            )}
        </View>

        {/* Right side */}
        {isToggle ? (
            <Switch
                value={toggleValue}
                onValueChange={onToggle}
                trackColor={{ false: '#1e2a45', true: '#ea7a53' }}
                thumbColor={toggleValue ? '#fff' : '#4a5a7a'}
            />
        ) : (
            <View className="flex-row items-center">
                {value && (
                    <Text className="text-[#4a5a7a] text-sm font-semibold mr-2">{value}</Text>
                )}
                <Text className="text-[#2a3a5a] text-xl font-light">›</Text>
            </View>
        )}
    </Pressable>
);

// ─── Section Header ────────────────────────────────────────────────────────────

const SectionHeader = ({ label }: { label: string }) => (
    <Text className="text-[10px] font-black text-[#3a4a6a] uppercase tracking-[0.2em] ml-2 mb-3 mt-1">
        {label}
    </Text>
);

// ─── Card wrapper ──────────────────────────────────────────────────────────────

const Card = ({ children }: { children: React.ReactNode }) => (
    <View
        className="rounded-[28px] px-5 mb-6 border border-[#1e2a45]"
        style={{ backgroundColor: '#0d1528' }}
    >
        {children}
    </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────

const Settings = () => {
    const { logout } = useAuth();

    // Toggle states
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [faceIdEnabled, setFaceIdEnabled] = useState(true);
    const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

    const initials = HOME_USER?.name
        ? HOME_USER.name
            .split(' ')
            .map((n: string) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
        : 'U';

    const handleLogout = () => {
        Alert.alert('Log Out', 'Are you sure you want to log out of Recurly?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Log Out', style: 'destructive', onPress: () => logout() },
        ]);
    };

    const handleFeaturePress = (featureName: string) => {
        Alert.alert(
            'Coming Soon',
            `${featureName} settings will be available in a future update.`,
            [{ text: 'Got it' }]
        );
    };

    return (
        <SafeAreaView className="flex-1" style={{ backgroundColor: '#080f1e' }}>
            <ScrollView
                contentContainerStyle={{ paddingBottom: 120, paddingHorizontal: 20, paddingTop: 8 }}
                showsVerticalScrollIndicator={false}
            >
                {/* ── Page Title ── */}
                <View className="mb-8 mt-4 flex-row items-center justify-between">
                    <Text
                        className="text-4xl font-black text-[#e8edf5] tracking-tight"
                        style={{ letterSpacing: -1.5 }}
                    >
                        Settings
                    </Text>
                    <View className="w-9 h-9 rounded-full border border-[#1e2a45] items-center justify-center"
                          style={{ backgroundColor: '#0d1528' }}>
                        <Text className="text-base">⚙️</Text>
                    </View>
                </View>

                {/* ── Profile Card ── */}
                <View
                    className="rounded-[32px] p-5 mb-8 border border-[#1e2a45]"
                    style={{ backgroundColor: '#0d1528' }}
                >
                    <View className="flex-row items-center">
                        {/* Avatar */}
                        <View
                            className="w-16 h-16 rounded-2xl items-center justify-center mr-4"
                            style={{ backgroundColor: '#ea7a53' }}
                        >
                            <Text className="text-2xl font-black text-white">{initials}</Text>
                        </View>

                        {/* Name & badge */}
                        <View className="flex-1">
                            <Text className="text-xl font-black text-[#e8edf5] mb-1">
                                {HOME_USER?.name || 'User'}
                            </Text>
                            <View className="flex-row items-center gap-2">
                                <View className="bg-[#ea7a53]/15 px-2.5 py-0.5 rounded-full border border-[#ea7a53]/30">
                                    <Text className="text-[10px] font-black text-[#ea7a53] uppercase tracking-widest">
                                        ✦ Pro Member
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Edit button */}
                        <Pressable
                            onPress={() => handleFeaturePress('Edit Profile')}
                            className="border border-[#2a3a5a] px-4 py-2 rounded-xl active:opacity-60"
                            style={{ backgroundColor: '#131f36' }}
                        >
                            <Text className="text-[#7a8faf] font-bold text-sm">Edit</Text>
                        </Pressable>
                    </View>

                    {/* Stats row */}
                    <View
                        className="flex-row mt-5 rounded-2xl overflow-hidden border border-[#1e2a45]"
                        style={{ backgroundColor: '#0a1222' }}
                    >
                        {[
                            { label: 'Subscriptions', value: '12' },
                            { label: 'Monthly Spend', value: 'RM 284' },
                            { label: 'Saved', value: 'RM 60' },
                        ].map((stat, i, arr) => (
                            <View
                                key={stat.label}
                                className={`flex-1 items-center py-3 ${
                                    i < arr.length - 1 ? 'border-r border-[#1e2a45]' : ''
                                }`}
                            >
                                <Text className="text-lg font-black text-[#e8edf5]">
                                    {stat.value}
                                </Text>
                                <Text className="text-[9px] font-bold text-[#3a4a6a] uppercase tracking-widest mt-0.5">
                                    {stat.label}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* ── Preferences ── */}
                <SectionHeader label="Preferences" />
                <Card>
                    <SettingItem
                        icon="🎨"
                        title="Appearance"
                        subtitle="Theme & display"
                        value="Dark"
                        onPress={() => handleFeaturePress('Appearance')}
                    />
                    <SettingItem
                        icon="💵"
                        title="Default Currency"
                        subtitle="Used across all summaries"
                        value="RM"
                        onPress={() => handleFeaturePress('Currency')}
                    />
                    <SettingItem
                        icon="🔔"
                        title="Push Notifications"
                        subtitle="Renewal alerts & spend tips"
                        isToggle
                        toggleValue={notificationsEnabled}
                        onToggle={setNotificationsEnabled}
                    />
                    <SettingItem
                        icon="🌐"
                        title="Language"
                        subtitle="App display language"
                        value="English"
                        hideBorder
                        onPress={() => handleFeaturePress('Language')}
                    />
                </Card>

                {/* ── Account ── */}
                <SectionHeader label="Account" />
                <Card>
                    <SettingItem
                        icon="💳"
                        title="Payment Methods"
                        subtitle="Manage saved cards"
                        value="2 Cards"
                        onPress={() => handleFeaturePress('Payment Methods')}
                    />
                    <SettingItem
                        icon="🔒"
                        title="Face ID & Security"
                        subtitle="Biometric authentication"
                        isToggle
                        toggleValue={faceIdEnabled}
                        onToggle={setFaceIdEnabled}
                    />
                    <SettingItem
                        icon="🏷️"
                        title="Subscription Categories"
                        subtitle="Customise your labels"
                        onPress={() => handleFeaturePress('Categories')}
                        badge="New"
                    />
                    <SettingItem
                        icon="📥"
                        title="Export Data"
                        subtitle="Download as CSV or PDF"
                        hideBorder
                        onPress={() => handleFeaturePress('Data Export')}
                    />
                </Card>

                {/* ── Privacy ── */}
                <SectionHeader label="Privacy" />
                <Card>
                    <SettingItem
                        icon="📊"
                        title="Analytics Sharing"
                        subtitle="Help us improve Recurly"
                        isToggle
                        toggleValue={analyticsEnabled}
                        onToggle={setAnalyticsEnabled}
                    />
                    <SettingItem
                        icon="🛡️"
                        title="Privacy Policy"
                        hideBorder
                        onPress={() => handleFeaturePress('Privacy Policy')}
                    />
                </Card>

                {/* ── Support ── */}
                <SectionHeader label="Support" />
                <Card>
                    <SettingItem
                        icon="💬"
                        title="Help & Feedback"
                        subtitle="Chat with our team"
                        onPress={() => handleFeaturePress('Help')}
                    />
                    <SettingItem
                        icon="⭐"
                        title="Rate Recurly"
                        subtitle="Leave us a review"
                        hideBorder
                        onPress={() => handleFeaturePress('Rate')}
                    />
                </Card>

                {/* ── Danger Zone ── */}
                <SectionHeader label="Danger Zone" />
                <Card>
                    <SettingItem
                        icon="🗑️"
                        title="Delete Account"
                        subtitle="Permanently remove all data"
                        isDestructive
                        hideBorder
                        onPress={() =>
                            Alert.alert(
                                'Delete Account',
                                'This will permanently delete your account and all data. This action cannot be undone.',
                                [
                                    { text: 'Cancel', style: 'cancel' },
                                    { text: 'Delete', style: 'destructive', onPress: () => {} },
                                ]
                            )
                        }
                    />
                </Card>

                {/* ── Logout ── */}
                <Pressable
                    onPress={handleLogout}
                    className="rounded-2xl py-4 items-center justify-center border border-rose-900/40 mb-8 active:opacity-60"
                    style={{ backgroundColor: '#1f0c0c' }}
                >
                    <Text className="text-rose-400 font-black text-base tracking-wide">
                        Log Out
                    </Text>
                </Pressable>

                {/* ── Version ── */}
                <View className="items-center">
                    <View
                        className="px-4 py-1.5 rounded-full border border-[#1e2a45]"
                        style={{ backgroundColor: '#0d1528' }}
                    >
                        <Text className="text-[#2a3a5a] text-[10px] font-black uppercase tracking-[0.25em]">
                            Recurly v1.0.0 — Smart Billing
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Settings;