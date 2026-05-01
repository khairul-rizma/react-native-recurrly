import { View, Text, ActivityIndicator } from 'react-native';
import React from 'react';

const SplashScreen = () => {
    return (
        // flex-1 makes it take up the whole screen
        // items-center and justify-center perfectly center the content
        <View className="flex-1 items-center justify-center bg-indigo-600">

            {/* App Title / Logo Area */}
            <Text className="text-4xl font-extrabold text-white tracking-widest mb-6">
                RECURRLY
            </Text>

            {/* Loading Spinner */}
            <ActivityIndicator size="large" color="#ffffff" />

        </View>
    );
};

export default SplashScreen;