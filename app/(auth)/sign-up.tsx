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
    ScrollView,
} from "react-native";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

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
        Animated.timing(borderAnim, { toValue: 1, duration: 200, useNativeDriver: false }).start();
    };
    const onBlur = () => {
        setFocused(false);
        Animated.timing(borderAnim, { toValue: 0, duration: 200, useNativeDriver: false }).start();
    };

    const borderColor = borderAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ["#1e2a45", "#ea7a53"],
    });

    const labelColor = focused || value ? "#ea7a53" : "#4a5a7a";

    return (
        <View style={{ marginBottom: 18 }}>
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
                    <Pressable onPress={() => setShowPassword(!showPassword)} style={{ paddingRight: 16 }}>
                        <Text style={{ fontSize: 18 }}>{showPassword ? "🙈" : "👁️"}</Text>
                    </Pressable>
                )}
            </Animated.View>
        </View>
    );
};

// ─── Password Strength ─────────────────────────────────────────────────────────

const getPasswordStrength = (pw: string): { score: number; label: string; color: string } => {
    if (!pw) return { score: 0, label: "", color: "#1e2a45" };
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;

    if (score <= 1) return { score, label: "Weak", color: "#ef4444" };
    if (score === 2) return { score, label: "Fair", color: "#f59e0b" };
    if (score === 3) return { score, label: "Good", color: "#3b82f6" };
    return { score: 4, label: "Strong", color: "#22c55e" };
};

const PasswordStrengthBar = ({ password }: { password: string }) => {
    const strength = getPasswordStrength(password);
    if (!password) return null;

    return (
        <View style={{ marginTop: -8, marginBottom: 18 }}>
            <View style={{ flexDirection: "row", gap: 4, marginBottom: 6 }}>
                {[1, 2, 3, 4].map((i) => (
                    <View
                        key={i}
                        style={{
                            flex: 1,
                            height: 3,
                            borderRadius: 2,
                            backgroundColor: i <= strength.score ? strength.color : "#1e2a45",
                        }}
                    />
                ))}
            </View>
            <Text style={{ fontSize: 11, fontWeight: "700", color: strength.color, letterSpacing: 0.5 }}>
                {strength.label} password
            </Text>
        </View>
    );
};

// ─── Orb ──────────────────────────────────────────────────────────────────────

const Orb = ({ size, top, left, right, bottom, opacity }: any) => (
    <View
        style={{
            position: "absolute",
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: "#ea7a53",
            top, left, right, bottom,
            opacity,
            shadowColor: "#ea7a53",
            shadowOpacity: 0.8,
            shadowRadius: size * 0.4,
        }}
    />
);

// ─── Benefit Pill ──────────────────────────────────────────────────────────────

const BenefitPill = ({ emoji, label }: { emoji: string; label: string }) => (
    <View style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#0d1528",
        borderWidth: 1,
        borderColor: "#1e2a45",
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginRight: 8,
        marginBottom: 8,
    }}>
        <Text style={{ fontSize: 13, marginRight: 5 }}>{emoji}</Text>
        <Text style={{ color: "#7a8faf", fontSize: 11, fontWeight: "700" }}>{label}</Text>
    </View>
);

// ─── Sign Up Screen ────────────────────────────────────────────────────────────

const SignUp = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const scaleAnim = useRef(new Animated.Value(1)).current;

    const pressIn = () =>
        Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true }).start();
    const pressOut = () =>
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();

    const handleSignUp = async () => {
        if (!name || !email || !password) {
            Alert.alert("Missing fields", "Please fill in all fields.");
            return;
        }
        if (password.length < 8) {
            Alert.alert("Weak password", "Password must be at least 8 characters.");
            return;
        }
        setLoading(true);
        await new Promise((r) => setTimeout(r, 1200)); // simulate API
        setLoading(false);
        router.replace("/(tabs)");
    };

    const strength = getPasswordStrength(password);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#080f1e" }}>
            {/* Background orbs */}
            <Orb size={200} top={-60} left={-80} opacity={0.06} />
            <Orb size={120} top={300} right={-50} opacity={0.05} />
            <Orb size={70} bottom={120} left={40} opacity={0.04} />

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 48, paddingTop: 16 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Logo row */}
                    <View style={{ alignItems: "center", marginBottom: 40, marginTop: 8 }}>
                        <View style={{
                            width: 64, height: 64,
                            borderRadius: 32,
                            backgroundColor: "#0d1528",
                            borderWidth: 1.5,
                            borderColor: "#1e2a45",
                            alignItems: "center",
                            justifyContent: "center",
                            shadowColor: "#ea7a53",
                            shadowOpacity: 0.25,
                            shadowRadius: 20,
                        }}>
                            <Image
                                source={require("@/assets/icons/logo.png")}
                                style={{ width: 36, height: 36 }}
                                resizeMode="contain"
                            />
                        </View>
                        <View style={{ alignItems: "center", marginTop: 14 }}>
                            <Text style={{ fontSize: 26, fontWeight: "900", color: "#e8edf5", letterSpacing: -1 }}>
                                Recurly
                            </Text>
                            <Text style={{ fontSize: 10, fontWeight: "800", color: "#3a4a6a", letterSpacing: 3, textTransform: "uppercase", marginTop: 2 }}>
                                Smart Billing
                            </Text>
                        </View>
                    </View>

                    {/* Heading */}
                    <View style={{ marginBottom: 24 }}>
                        <Text style={{ fontSize: 32, fontWeight: "900", color: "#e8edf5", letterSpacing: -1, marginBottom: 8 }}>
                            Create account
                        </Text>
                        <Text style={{ fontSize: 15, color: "#4a5a7a", fontWeight: "500", lineHeight: 22 }}>
                            Join thousands tracking smarter
                        </Text>
                    </View>

                    {/* Benefit pills */}
                    <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 28 }}>
                        <BenefitPill emoji="📊" label="Spending insights" />
                        <BenefitPill emoji="🔔" label="Renewal alerts" />
                        <BenefitPill emoji="💰" label="Save money" />
                    </View>

                    {/* Form */}
                    <AnimatedInput
                        label="Full Name"
                        value={name}
                        onChangeText={setName}
                        placeholder="Your full name"
                        autoCapitalize="words"
                    />
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
                        placeholder="Min. 8 characters"
                        secureTextEntry
                    />
                    <PasswordStrengthBar password={password} />

                    {/* CTA */}
                    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                        <Pressable
                            onPress={handleSignUp}
                            onPressIn={pressIn}
                            onPressOut={pressOut}
                            disabled={loading}
                            style={{
                                backgroundColor: strength.score >= 3 || !password ? "#ea7a53" : "#ea7a53",
                                paddingVertical: 17,
                                borderRadius: 18,
                                alignItems: "center",
                                shadowColor: "#ea7a53",
                                shadowOffset: { width: 0, height: 8 },
                                shadowOpacity: 0.4,
                                shadowRadius: 16,
                                elevation: 8,
                                marginBottom: 24,
                            }}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={{ color: "#fff", fontSize: 16, fontWeight: "800", letterSpacing: 0.3 }}>
                                    Create account →
                                </Text>
                            )}
                        </Pressable>
                    </Animated.View>

                    {/* Terms note */}
                    <Text style={{ color: "#2a3a5a", fontSize: 11, fontWeight: "500", textAlign: "center", lineHeight: 17, marginBottom: 24 }}>
                        By signing up you agree to our{" "}
                        <Text style={{ color: "#ea7a53", fontWeight: "700" }}>Terms of Service</Text>
                        {" "}and{" "}
                        <Text style={{ color: "#ea7a53", fontWeight: "700" }}>Privacy Policy</Text>
                    </Text>

                    {/* Sign in link */}
                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ color: "#3a4a6a", fontSize: 14, fontWeight: "500" }}>
                            Already have an account?{" "}
                        </Text>
                        <Link href="/(auth)/sign-in" asChild>
                            <Pressable>
                                <Text style={{ color: "#ea7a53", fontSize: 14, fontWeight: "800" }}>
                                    Sign in
                                </Text>
                            </Pressable>
                        </Link>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default SignUp;