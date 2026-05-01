import "@/global.css";
import { Text, View, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";

export default function App() {
    return (
        // SafeAreaView ensures content respects notches, status bars, and home indicators
        <SafeAreaView className="flex-1 bg-slate-50">
            {/* ScrollView now takes up the remaining safe space */}
            <ScrollView contentContainerClassName="flex-grow justify-center items-center px-6 py-4">

                {/* Header Section */}
                <View className="items-center mb-10 mt-5">
                    <Text className="text-6xl font-black text-indigo-600 mb-3 ">
                        Recurrly
                    </Text>
                    <Text className="text-base text-slate-500 text-center px-4 leading-relaxed">
                        Welcome to your development hub. Select a flow below to test your screens.
                    </Text>
                </View>

                {/* Navigation Blocks Container */}
                <View className="w-full gap-8">

                    {/* Core App Flow Section */}
                    <View className="w-full gap-3">
                        <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">
                            Core App
                        </Text>

                        <Link href="/onboarding" asChild>
                            <Pressable className="w-full bg-indigo-600 py-4 rounded-2xl items-center shadow-md active:bg-indigo-700">
                                <Text className="text-white font-bold text-lg">Launch Onboarding</Text>
                            </Pressable>
                        </Link>
                    </View>

                    {/* Authentication Section */}
                    <View className="w-full gap-3">
                        <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">
                            Authentication
                        </Text>

                        <Link href="/(auth)/sign-in" asChild>
                            <Pressable className="w-full bg-white border border-slate-200 py-4 rounded-2xl items-center shadow-sm active:bg-slate-100">
                                <Text className="text-slate-700 font-semibold text-lg">Sign In</Text>
                            </Pressable>
                        </Link>

                        <Link href="/(auth)/sign-up" asChild>
                            <Pressable className="w-full bg-white border border-slate-200 py-4 rounded-2xl items-center shadow-sm active:bg-slate-100">
                                <Text className="text-slate-700 font-semibold text-lg">Create an Account</Text>
                            </Pressable>
                        </Link>
                    </View>

                    {/* Subscriptions Section */}
                    <View className="w-full gap-3">
                        <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">
                            Test Subscriptions
                        </Text>

                        {/* Spotify Button - using emerald/green styling */}
                        <Link href="/subscriptions/spotify" asChild>
                            <Pressable className="w-full bg-emerald-50 border border-emerald-200 py-4 rounded-2xl items-center shadow-sm active:bg-emerald-100">
                                <Text className="text-emerald-700 font-semibold text-lg">Spotify Subscription</Text>
                            </Pressable>
                        </Link>

                        {/* Claude Max Button - using purple styling */}
                        <Link href={{ pathname: "/subscriptions/[id]", params: { id: "claude" } }} asChild>
                            <Pressable className="w-full bg-purple-50 border border-purple-200 py-4 rounded-2xl items-center shadow-sm active:bg-purple-100">
                                <Text className="text-purple-700 font-semibold text-lg">Claude Max Subscription</Text>
                            </Pressable>
                        </Link>
                    </View>

                </View>

                {/* Version Info / Footer */}
                <Text className="text-sm font-medium text-slate-400 mt-12 mb-8">
                    Expo Router • NativeWind v5 by Khairul
                </Text>

            </ScrollView>
        </SafeAreaView>
    );
}