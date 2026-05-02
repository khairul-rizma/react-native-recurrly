import React, { useState, useRef } from "react";
import {
    View,
    Text,
    TextInput,
    Pressable,
    Image,
    KeyboardAvoidingView,
    Platform,
    Alert,
    Animated,
    ActivityIndicator,
} from "react-native";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";

// ─── Animated Input ────────────────────────────────────────────────────────────

const AnimatedInput = ({
                           label,
                           value,
                           onChangeText,
                           placeholder,
                           secureTextEntry = false,
                           keyboardType = "default",
                           autoCapitalize = "none",
                       }: {
    label: string;
    value: string;
    onChangeText: (t: string) => void;
    placeholder: string;
    secureTextEntry?: boolean;
    keyboardType?: any;
    autoCapitalize?: any;
}) => {
    const borderAnim = useRef(new Animated.Value(0)).current;
    const [focused, setFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const onFocus = () => {
        setFocused(true);
        Animated.timing(borderAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: false,
        }).start();
    };

    const onBlur = () => {
        setFocused(false);
        Animated.timing(borderAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
    };

    const borderColor = borderAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ["#1e2a45", "#ea7a53"],
    });

    const labelColor = focused || value ? "#ea7a53" : "#4a5a7a";

    return (
        <View className="mb-5">
            <Text style={{ color: labelColor, fontSize: 11, fontWeight: "800", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8, marginLeft: 2 }}>
                {label}
            </Text>
            <Animated.View
                style={{
                    borderWidth: 1.5,
                    borderColor,
                    borderRadius: 18,
                    backgroundColor: "#0a1222",
                    flexDirection: "row",
                    alignItems: "center",
                    overflow: "hidden",
                }}
            >
                <TextInput
                    style={{
                        flex: 1,
                        paddingVertical: 16,
                        paddingHorizontal: 18,
                        fontSize: 15,
                        fontWeight: "600",
                        color: "#e8edf5",
                    }}
                    placeholder={placeholder}
                    placeholderTextColor="#2a3a5a"
                    value={value}
                    onChangeText={onChangeText}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    secureTextEntry={secureTextEntry && !showPassword}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                />
                {secureTextEntry && (
                    <Pressable onPress={() => setShowPassword(!showPassword)} className="pr-4">
                        <Text style={{ fontSize: 18 }}>{showPassword ? "🙈" : "👁️"}</Text>
                    </Pressable>
                )}
            </Animated.View>
        </View>
    );
};

// ─── Decorative Orb ───────────────────────────────────────────────────────────

const Orb = ({ size, top, left, right, opacity }: any) => (
    <View
        style={{
            position: "absolute",
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: "#ea7a53",
            top,
            left,
            right,
            opacity,
            // Simulated glow via shadow
            shadowColor: "#ea7a53",
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.6,
            shadowRadius: size * 0.4,
        }}
    />
);

// ─── Sign In Screen ────────────────────────────────────────────────────────────

const SignIn = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    // Button press animation
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const pressIn = () =>
        Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true }).start();
    const pressOut = () =>
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();

    const handleSignIn = async () => {
        if (!email || !password) {
            Alert.alert("Missing fields", "Please enter your email and password.");
            return;
        }
        if (email === "test@gmail.com" && password === "qwertyuiop") {
            setLoading(true);
            try {
                await login();
                router.replace("/(tabs)");
            } catch {
                Alert.alert("Error", "Something went wrong during login.");
            } finally {
                setLoading(false);
            }
        } else {
            Alert.alert("Invalid credentials", "Use test@gmail.com / qwertyuiop");
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#080f1e" }}>
            {/* Background orbs */}
            <Orb size={220} top={-80} right={-60} opacity={0.07} />
            <Orb size={140} top={200} left={-70} opacity={0.05} />
            <Orb size={80} top={420} right={30} opacity={0.04} />

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <View style={{ flex: 1, paddingHorizontal: 24, justifyContent: "center" }}>

                    {/* Logo */}
                    <View style={{ alignItems: "center", marginBottom: 48 }}>
                        {/* Glowing ring behind logo */}
                        <View style={{
                            width: 80, height: 80,
                            borderRadius: 40,
                            backgroundColor: "#ea7a53",
                            opacity: 0.1,
                            position: "absolute",
                            shadowColor: "#ea7a53",
                            shadowOpacity: 1,
                            shadowRadius: 30,
                        }} />
                        <View style={{
                            width: 64, height: 64,
                            borderRadius: 32,
                            backgroundColor: "#0d1528",
                            borderWidth: 1.5,
                            borderColor: "#1e2a45",
                            alignItems: "center",
                            justifyContent: "center",
                        }}>
                            <Image
                                source={require("@/assets/icons/logo.png")}
                                style={{ width: 36, height: 36 }}
                                resizeMode="contain"
                            />
                        </View>
                        <View style={{ alignItems: "center", marginTop: 16 }}>
                            <Text style={{ fontSize: 28, fontWeight: "900", color: "#e8edf5", letterSpacing: -1 }}>
                                Recurly
                            </Text>
                            <Text style={{ fontSize: 10, fontWeight: "800", color: "#3a4a6a", letterSpacing: 3, textTransform: "uppercase", marginTop: 2 }}>
                                Smart Billing
                            </Text>
                        </View>
                    </View>

                    {/* Welcome text */}
                    <View style={{ marginBottom: 32 }}>
                        <Text style={{ fontSize: 32, fontWeight: "900", color: "#e8edf5", letterSpacing: -1, marginBottom: 8 }}>
                            Welcome back
                        </Text>
                        <Text style={{ fontSize: 15, color: "#4a5a7a", fontWeight: "500", lineHeight: 22 }}>
                            Sign in to keep your subscriptions under control
                        </Text>
                    </View>

                    {/* Form */}
                    <View>
                        <AnimatedInput
                            label="Email"
                            value={email}
                            onChangeText={setEmail}
                            placeholder="your@email.com"
                            keyboardType="email-address"
                        />
                        <AnimatedInput
                            label="Password"
                            value={password}
                            onChangeText={setPassword}
                            placeholder="••••••••••"
                            secureTextEntry
                        />

                        {/* Forgot password */}
                        <Pressable
                            onPress={() => Alert.alert("Coming soon", "Password reset will be available soon.")}
                            style={{ alignSelf: "flex-end", marginBottom: 28, marginTop: -8 }}
                        >
                            <Text style={{ color: "#ea7a53", fontSize: 12, fontWeight: "700" }}>
                                Forgot password?
                            </Text>
                        </Pressable>

                        {/* Sign in button */}
                        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                            <Pressable
                                onPress={handleSignIn}
                                onPressIn={pressIn}
                                onPressOut={pressOut}
                                disabled={loading}
                                style={{
                                    backgroundColor: "#ea7a53",
                                    paddingVertical: 17,
                                    borderRadius: 18,
                                    alignItems: "center",
                                    shadowColor: "#ea7a53",
                                    shadowOffset: { width: 0, height: 8 },
                                    shadowOpacity: 0.4,
                                    shadowRadius: 16,
                                    elevation: 8,
                                }}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={{ color: "#fff", fontSize: 16, fontWeight: "800", letterSpacing: 0.3 }}>
                                        Sign in →
                                    </Text>
                                )}
                            </Pressable>
                        </Animated.View>

                        {/* Divider */}
                        <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 24 }}>
                            <View style={{ flex: 1, height: 1, backgroundColor: "#1e2a45" }} />
                            <Text style={{ color: "#2a3a5a", fontSize: 11, fontWeight: "700", marginHorizontal: 12, letterSpacing: 1 }}>
                                OR
                            </Text>
                            <View style={{ flex: 1, height: 1, backgroundColor: "#1e2a45" }} />
                        </View>

                        {/* Sign up link */}
                        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                            <Text style={{ color: "#3a4a6a", fontSize: 14, fontWeight: "500" }}>
                                New to Recurly?{" "}
                            </Text>
                            <Link href="/sign-up" asChild>
                                <Pressable>
                                    <Text style={{ color: "#ea7a53", fontSize: 14, fontWeight: "800" }}>
                                        Create account
                                    </Text>
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