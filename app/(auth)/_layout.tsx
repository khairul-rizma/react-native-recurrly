import { Stack } from 'expo-router';
import "@/global.css";

export default function AuthLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            {/* Explicitly list the files in this folder */}
            <Stack.Screen name="sign-in" />
            <Stack.Screen name="sign-up" />
        </Stack>
    );
}