import { View, Text, TextInput, Pressable, Image, KeyboardAvoidingView, Platform } from "react-native";
import React, { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const SignUp = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignUp = () => {
        // Logic for registration
        router.replace("/(tabs)");
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff9e3" }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                {/* Main Centered Container */}
                <View style={{ flex: 1, paddingHorizontal: 24, justifyContent: 'center' }}>

                    {/* Header Logo Section */}
                    <View className="items-center mb-8">
                        <View className="flex-row items-center">
                            <Image
                                source={require("@/assets/icons/logo.png")}
                                style={{ width: 44, height: 44, marginRight: 12 }}
                                resizeMode="contain"
                            />
                            <View>
                                <Text className="text-2xl font-black text-[#081126] leading-tight">Recurly</Text>
                                <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Smart Billing</Text>
                            </View>
                        </View>
                    </View>

                    {/* Welcome Text */}
                    <View className="items-center mb-8">
                        <Text className="text-3xl font-black text-[#081126] mb-2 text-center">Create account</Text>
                        <Text className="text-base font-medium text-slate-500 text-center px-4">
                            Start managing your subscriptions with ease today
                        </Text>
                    </View>

                    {/* Form Card */}
                    <View className="bg-[#fff8e7] rounded-[32px] p-7 border border-slate-200 shadow-sm w-full">
                        <View className="mb-6">

                            {/* Name Field */}
                            <View className="mb-4">
                                <Text className="text-sm font-bold text-[#081126] mb-2 ml-1">Full Name</Text>
                                <TextInput
                                    style={{ backgroundColor: '#fff9e3' }}
                                    className="border border-slate-200 rounded-2xl p-4 text-base font-medium text-[#081126]"
                                    placeholder="Enter your name"
                                    placeholderTextColor="#A0A0A0"
                                    value={name}
                                    onChangeText={setName}
                                    autoCapitalize="words"
                                />
                            </View>

                            {/* Email Field */}
                            <View className="mb-4">
                                <Text className="text-sm font-bold text-[#081126] mb-2 ml-1">Email</Text>
                                <TextInput
                                    style={{ backgroundColor: '#fff9e3' }}
                                    className="border border-slate-200 rounded-2xl p-4 text-base font-medium text-[#081126]"
                                    placeholder="Enter your email"
                                    placeholderTextColor="#A0A0A0"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>

                            {/* Password Field */}
                            <View>
                                <Text className="text-sm font-bold text-[#081126] mb-2 ml-1">Password</Text>
                                <TextInput
                                    style={{ backgroundColor: '#fff9e3' }}
                                    className="border border-slate-200 rounded-2xl p-4 text-base font-medium text-[#081126]"
                                    placeholder="Create a password"
                                    placeholderTextColor="#A0A0A0"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                />
                            </View>
                        </View>

                        {/* Sign Up Button */}
                        <Pressable
                            onPress={handleSignUp}
                            className="bg-[#ea7a53] py-4 rounded-2xl items-center shadow-sm active:opacity-90"
                        >
                            <Text className="text-white font-bold text-lg">Sign up</Text>
                        </Pressable>

                        {/* Footer Link */}
                        <View className="flex-row justify-center mt-6">
                            <Text className="text-sm font-medium text-slate-500">Already have an account? </Text>
                            <Link href="/(auth)/sign-in" asChild>
                                <Pressable>
                                    <Text className="text-sm font-bold text-[#ea7a53]">Sign in</Text>
                                </Pressable>
                            </Link>
                        </View>
                    </View>

                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default SignUp;