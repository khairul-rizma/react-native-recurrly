import { View, Text, TextInput, Pressable, Image, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import React, { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const SignUp = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignUp = () => {
        router.replace("/(tabs)");
    };

    return (
        <SafeAreaView className="flex-1 bg-[#fff9e3]">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <ScrollView contentContainerClassName="flex-grow justify-center px-6 py-12" showsVerticalScrollIndicator={false}>

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
                                <Text className="text-[10px] font-bold text-black/60 uppercase tracking-widest">
                                    Smart Billing
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Welcome Text */}
                    <View className="items-center mb-8">
                        <Text className="text-3xl font-black text-[#081126] mb-2">Create an account</Text>
                        <Text className="text-base font-medium text-black/60 text-center">
                            Start managing your subscriptions today
                        </Text>
                    </View>

                    {/* Form Card */}
                    <View className="bg-[#fff8e7] rounded-[32px] p-6 border border-black/5 shadow-sm">

                        <View className="mb-6">
                            {/* Full Name Input */}
                            <View className="mb-5">
                                <Text className="text-sm font-bold text-[#081126] mb-2 ml-1">Full Name</Text>
                                <TextInput
                                    className="bg-[#fff9e3] border border-black/10 rounded-2xl p-4 text-base font-medium text-[#081126]"
                                    placeholder="Enter your full name"
                                    placeholderTextColor="#A0A0A0"
                                    value={name}
                                    onChangeText={setName}
                                    autoCapitalize="words"
                                />
                            </View>

                            {/* Email Input */}
                            <View className="mb-5">
                                <Text className="text-sm font-bold text-[#081126] mb-2 ml-1">Email</Text>
                                <TextInput
                                    className="bg-[#fff9e3] border border-black/10 rounded-2xl p-4 text-base font-medium text-[#081126]"
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
                                    className="bg-[#fff9e3] border border-black/10 rounded-2xl p-4 text-base font-medium text-[#081126]"
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
                            className="bg-[#ea7a53] py-4 rounded-2xl items-center shadow-sm active:opacity-80"
                        >
                            <Text className="text-white font-bold text-lg">Sign up</Text>
                        </Pressable>

                        {/* Sign In Link */}
                        <View className="flex-row justify-center mt-6">
                            <Text className="text-sm font-medium text-black/60">Already have an account? </Text>
                            <Link href="/(auth)/sign-in" asChild>
                                <Pressable>
                                    <Text className="text-sm font-bold text-[#ea7a53]">Sign in</Text>
                                </Pressable>
                            </Link>
                        </View>

                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default SignUp;