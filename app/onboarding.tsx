import { View, Text, Image, Pressable, StatusBar } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router"; // Import Link instead of router

const Onboarding = () => {
    return (
        <View className="flex-1 bg-[#ea7a53]">
            <StatusBar barStyle="light-content" />

            <View className="flex-1 w-full pt-16">
                <Image
                    source={require("@/assets/images/splash-pattern.png")}
                    className="w-full h-full"
                    resizeMode="contain"
                />
            </View>

            <SafeAreaView edges={["bottom"]} className="w-full px-8 pb-10 pt-8">
                <Text className="text-4xl font-black text-white text-center tracking-tight mb-3">
                    Gain Financial Clarity
                </Text>
                <Text className="text-base font-medium text-white/90 text-center mb-10">
                    Track, analyze and cancel with ease
                </Text>

                {/* Wrap your button in a Link to safely navigate to the (auth) group */}
                <Link href="/(auth)/sign-in" asChild>
                    <Pressable className="w-full bg-white py-4 rounded-full items-center shadow-sm active:opacity-80">
                        <Text className="text-[#081126] font-bold text-lg">
                            Get Started
                        </Text>
                    </Pressable>
                </Link>
            </SafeAreaView>
        </View>
    );
};

export default Onboarding;