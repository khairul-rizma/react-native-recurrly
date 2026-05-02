import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Image, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
// Import your hook
import { useAuth } from "@/context/AuthContext";

const SignIn = () => {
    // ✅ Hooks must be called inside the component!
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignIn = async () => {
        if (email === "test@gmail.com" && password === "qwertyuiop") {
            try {
                await login(); // Updates AsyncStorage and Auth State
                router.replace("/(tabs)");
            } catch (error) {
                Alert.alert("Error", "Something went wrong during login.");
            }
        } else {
            Alert.alert("Error", "Invalid credentials. Use test@gmail.com / qwertyuiop");
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff9e3" }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <View style={{ flex: 1, paddingHorizontal: 24, justifyContent: 'center' }}>

                    {/* Header */}
                    <View className="items-center mb-10">
                        <View className="flex-row items-center">
                            <Image
                                source={require("@/assets/icons/logo.png")}
                                style={{ width: 48, height: 48, marginRight: 12 }}
                                resizeMode="contain"
                            />
                            <View>
                                <Text className="text-2xl font-black text-[#081126] leading-tight">Recurly</Text>
                                <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Smart Billing</Text>
                            </View>
                        </View>
                    </View>

                    {/* Welcome Text */}
                    <View className="items-center mb-10">
                        <Text className="text-3xl font-black text-[#081126] mb-2 text-center">Welcome back</Text>
                        <Text className="text-base font-medium text-slate-500 text-center px-4">
                            Sign in to continue managing your subscriptions
                        </Text>
                    </View>

                    {/* Form Card */}
                    <View className="bg-[#fff8e7] rounded-[32px] p-7 border border-slate-200 shadow-sm w-full">
                        <View className="mb-6">
                            <View className="mb-5">
                                <Text className="text-sm font-bold text-[#081126] mb-2 ml-1">Email</Text>
                                <TextInput
                                    style={{ backgroundColor: '#fff9e3' }}
                                    className="border border-slate-200 rounded-2xl p-4 text-base font-medium text-[#081126]"
                                    placeholder="test@gmail.com"
                                    placeholderTextColor="#A0A0A0"
                                    value={email}
                                    onChangeText={setEmail}
                                    autoCapitalize="none"
                                />
                            </View>

                            <View>
                                <Text className="text-sm font-bold text-[#081126] mb-2 ml-1">Password</Text>
                                <TextInput
                                    style={{ backgroundColor: '#fff9e3' }}
                                    className="border border-slate-200 rounded-2xl p-4 text-base font-medium text-[#081126]"
                                    placeholder="••••••••"
                                    placeholderTextColor="#A0A0A0"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                />
                            </View>
                        </View>

                        <Pressable
                            onPress={handleSignIn}
                            className="bg-[#ea7a53] py-4 rounded-2xl items-center shadow-sm active:opacity-90"
                        >
                            <Text className="text-white font-bold text-lg">Sign in</Text>
                        </Pressable>

                        <View className="flex-row justify-center mt-6">
                            <Text className="text-sm font-medium text-slate-500">New to Recurly? </Text>
                            <Link href="/sign-up" asChild>
                                <Pressable>
                                    <Text className="text-sm font-bold text-[#ea7a53]">Create an account</Text>
                                </Pressable>
                            </Link>
                        </View>
                    </View>

                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default SignIn;