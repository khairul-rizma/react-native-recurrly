import { View, Text, TextInput, Pressable, Image, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import React, { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignIn = () => {
        router.replace("/(tabs)");
    };

    return (
        <SafeAreaView className="flex-1 bg-[#fff9e3]">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                {/* Added className="flex-1 w-full" to prevent view collapse */}
                <ScrollView className="flex-1 w-full" contentContainerClassName="flex-grow justify-center px-6 py-12" showsVerticalScrollIndicator={false}>

                    {/* Header Logo */}
                    <View className="items-center mb-12">
                        <View className="flex-row items-center">
                            <Image
                                source={require("@/assets/icons/logo.png")}
                                className="w-12 h-12 mr-3"
                                resizeMode="contain"
                            />
                            <View>
                                <Text className="text-2xl font-black text-[#081126] leading-tight">
                                    Recurly
                                </Text>
                                <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                    Smart Billing
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Welcome Text */}
                    <View className="items-center mb-8">
                        <Text className="text-3xl font-black text-[#081126] mb-2">Welcome back</Text>
                        <Text className="text-base font-medium text-slate-500 text-center">
                            Sign in to continue managing your subscriptions
                        </Text>
                    </View>

                    {/* Form Card */}
                    <View className="bg-[#fff8e7] rounded-[32px] p-6 border border-slate-200 shadow-sm">

                        <View className="mb-6">
                            {/* Email Input */}
                            <View className="mb-5">
                                <Text className="text-sm font-bold text-[#081126] mb-2 ml-1">Email</Text>
                                <TextInput
                                    className="bg-[#fff9e3] border border-slate-200 rounded-2xl p-4 text-base font-medium text-[#081126]"
                                    placeholder="Enter your email"
                                    placeholderTextColor="#A0A0A0"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>

                            {/* Password Input */}
                            <View>
                                <Text className="text-sm font-bold text-[#081126] mb-2 ml-1">Password</Text>
                                <TextInput
                                    className="bg-[#fff9e3] border border-slate-200 rounded-2xl p-4 text-base font-medium text-[#081126]"
                                    placeholder="Enter your password"
                                    placeholderTextColor="#A0A0A0"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                />
                            </View>
                        </View>

                        {/* Sign In Button */}
                        <Pressable
                            onPress={handleSignIn}
                            className="bg-[#ea7a53] py-4 rounded-2xl items-center shadow-sm active:opacity-80"
                        >
                            <Text className="text-white font-bold text-lg">Sign in</Text>
                        </Pressable>

                        {/* Sign Up Link - Changed href to standard /sign-up */}
                        <View className="flex-row justify-center mt-6">
                            <Text className="text-sm font-medium text-slate-500">New to Recurly? </Text>
                            <Link href="/sign-up" asChild>
                                <Pressable>
                                    <Text className="text-sm font-bold text-[#ea7a53]">Create an account</Text>
                                </Pressable>
                            </Link>
                        </View>

                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default SignIn;