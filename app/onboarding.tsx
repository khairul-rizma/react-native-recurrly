import {
    View,
    Text,
    Image,
    Pressable,
    StatusBar,
    FlatList,
    Dimensions,
    NativeSyntheticEvent,
    NativeScrollEvent,
} from "react-native";
import React, { useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

const { width: W, height: H } = Dimensions.get("window");

// ─── Slide Data ───────────────────────────────────────────────────────────────
const SLIDES = [
    {
        id: "1",
        bg: "#fff9e3", // Cream
        emoji: "💳",
        tag: "WELCOME TO RECURLY",
        title: "Gain Financial\nClarity",
        body: "See exactly where your money goes every month — all your subscriptions in one beautiful dashboard.",
        shapes: [
            { size: 260, top: -80, left: -80, color: "#ea7a53", opacity: 0.15 },
            { size: 140, top: 60, right: -50, color: "#ea7a53", opacity: 0.1 },
            { size: 80, bottom: 180, left: 30, color: "#081126", opacity: 0.05 },
        ],
    },
    {
        id: "2",
        bg: "#081126", // Dark Blue
        emoji: "🧠",
        tag: "AI INSIGHTS",
        title: "Smart Spending\nAnalysis",
        body: "Get intelligent breakdowns by category, health scores, and instantly spot where you can save.",
        shapes: [
            { size: 300, top: -100, right: -100, color: "#ea7a53", opacity: 0.15 },
            { size: 160, bottom: 200, left: -60, color: "#fff9e3", opacity: 0.05 },
        ],
    },
    {
        id: "3",
        bg: "#ea7a53", // Coral
        emoji: "🔔",
        tag: "NEVER MISS A BILL",
        title: "Stay Ahead of\nRenewals",
        body: "Get notified before you're charged. Pause, cancel, or manage any subscription with a single tap.",
        shapes: [
            { size: 220, top: -60, right: -60, color: "#fff9e3", opacity: 0.2 },
            { size: 100, bottom: 220, left: -30, color: "#081126", opacity: 0.1 },
        ],
    },
    {
        id: "4",
        bg: "#fff9e3", // Cream
        emoji: "🚀",
        tag: "LET'S GO",
        title: "Take Control\nToday",
        body: "Join thousands who already track smarter. Set up your account and regain control in under 60 seconds.",
        shapes: [
            { size: 280, top: -90, left: -90, color: "#ea7a53", opacity: 0.15 },
            { size: 120, top: 80, right: -40, color: "#081126", opacity: 0.05 },
        ],
    },
];

const isLight = (bg: string) => bg === "#fff9e3";

// ─── Decorative Background Shapes ─────────────────────────────────────────────
const Shapes = ({ shapes }: { shapes: any[] }) => (
    <>
        {shapes.map((s, i) => (
            <View
                key={i}
                style={{
                    position: "absolute",
                    width: s.size, height: s.size,
                    borderRadius: s.size / 2,
                    backgroundColor: s.color,
                    opacity: s.opacity,
                    top: s.top, bottom: s.bottom, left: s.left, right: s.right,
                }}
            />
        ))}
    </>
);

// ─── Slide Content Variations ─────────────────────────────────────────────────

// Slide 1 & 4: Chips
const FloatingChips = ({ light }: { light: boolean }) => {
    const chips = [["💰", "Track Spend"], ["📉", "Cut Waste"], ["🔒", "Bank Level Security"]];
    return (
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, justifyContent: "center", marginTop: 32, paddingHorizontal: 20 }}>
            {chips.map(([emoji, label]) => (
                <View key={label} style={{
                    flexDirection: "row", alignItems: "center", gap: 8,
                    backgroundColor: light ? "#ffffff" : "rgba(255,255,255,0.1)",
                    borderRadius: 24, paddingHorizontal: 16, paddingVertical: 10,
                    shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: light ? 0.05 : 0, shadowRadius: 8,
                }}>
                    <Text style={{ fontSize: 16 }}>{emoji}</Text>
                    <Text style={{ fontSize: 13, fontWeight: "800", color: light ? "#081126" : "#ffffff" }}>{label}</Text>
                </View>
            ))}
        </View>
    );
};

// Slide 2: Bento Box Stats
const BentoStats = () => (
    <View style={{ width: "100%", paddingHorizontal: 30, marginTop: 32, gap: 12 }}>
        <View style={{ backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 24, padding: 20, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" }}>
            <Text style={{ fontSize: 12, fontWeight: "800", color: "#ea7a53", textTransform: "uppercase", letterSpacing: 1, mb: 4 }}>Total Monthly Spend</Text>
            <Text style={{ fontSize: 32, fontWeight: "900", color: "#ffffff" }}>RM 428.50</Text>
        </View>
        <View style={{ flexDirection: "row", gap: 12 }}>
            <View style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 24, padding: 20, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" }}>
                <Text style={{ fontSize: 24, fontWeight: "900", color: "#10b981", mb: 4 }}>92<Text style={{fontSize: 14}}>/100</Text></Text>
                <Text style={{ fontSize: 10, fontWeight: "800", color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>Health Score</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 24, padding: 20, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" }}>
                <Text style={{ fontSize: 24, fontWeight: "900", color: "#3b82f6", mb: 4 }}>8</Text>
                <Text style={{ fontSize: 10, fontWeight: "800", color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>Active Subs</Text>
            </View>
        </View>
    </View>
);

// Slide 3: Notification Alerts
const AlertBubbles = () => (
    <View style={{ width: "100%", paddingHorizontal: 30, marginTop: 32, gap: 12 }}>
        <View style={{ backgroundColor: "#fff9e3", borderRadius: 20, padding: 16, flexDirection: "row", alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 12 }}>
            <View style={{ w: 40, h: 40, backgroundColor: "#fee2e2", borderRadius: 12, alignItems: "center", justifyContent: "center", marginRight: 12 }}>
                <Text style={{ fontSize: 20 }}>⚠</Text>
            </View>
            <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: "900", color: "#081126" }}>Netflix Renews Tomorrow</Text>
                <Text style={{ fontSize: 12, fontWeight: "600", color: "#64748b" }}>RM 55.00 will be charged.</Text>
            </View>
        </View>
        <View style={{ backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 20, padding: 16, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.3)" }}>
            <View style={{ w: 40, h: 40, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 12, alignItems: "center", justifyContent: "center", marginRight: 12 }}>
                <Text style={{ fontSize: 20 }}>💡</Text>
            </View>
            <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: "900", color: "#fff9e3" }}>Unused Subscription</Text>
                <Text style={{ fontSize: 12, fontWeight: "600", color: "rgba(255,255,255,0.8)" }}>You haven't used Canva in 3 weeks.</Text>
            </View>
        </View>
    </View>
);

// ─── Individual Slide Component ───────────────────────────────────────────────
const Slide = ({ item }: { item: typeof SLIDES[0] }) => {
    const light = isLight(item.bg);
    const textColor = light ? "#081126" : "#ffffff";
    const mutedColor = light ? "rgba(8,17,38,0.6)" : "rgba(255,255,255,0.7)";

    return (
        <View style={{ width: W, height: H, backgroundColor: item.bg }}>
            <Shapes shapes={item.shapes} />

            {/* Upper Dynamic Content Area */}
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingTop: 40 }}>

                {/* Glassmorphic Icon Circle */}
                <View style={{
                    width: 140, height: 140, borderRadius: 70,
                    backgroundColor: light ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.05)",
                    borderWidth: 1, borderColor: light ? "#ffffff" : "rgba(255,255,255,0.1)",
                    alignItems: "center", justifyContent: "center",
                    shadowColor: "#081126", shadowOffset: { width: 0, height: 24 }, shadowOpacity: 0.08, shadowRadius: 32,
                }}>
                    <Text style={{ fontSize: 64 }}>{item.emoji}</Text>
                </View>

                {item.id === "1" && <FloatingChips light={light} />}
                {item.id === "2" && <BentoStats />}
                {item.id === "3" && <AlertBubbles />}
                {item.id === "4" && <FloatingChips light={light} />}

            </View>

            {/* Text Area */}
            <View style={{ paddingHorizontal: 32, paddingBottom: 140 }}>
                <View style={{
                    alignSelf: "flex-start", backgroundColor: light ? "#081126" : "#ffffff",
                    borderRadius: 12, paddingHorizontal: 10, paddingVertical: 6, marginBottom: 16,
                }}>
                    <Text style={{ fontSize: 10, fontWeight: "900", letterSpacing: 1.5, color: light ? "#ffffff" : "#081126" }}>
                        {item.tag}
                    </Text>
                </View>

                <Text style={{ fontSize: 40, fontWeight: "900", color: textColor, letterSpacing: -1, lineHeight: 44, marginBottom: 12 }}>
                    {item.title}
                </Text>

                <Text style={{ fontSize: 16, fontWeight: "500", color: mutedColor, lineHeight: 24 }}>
                    {item.body}
                </Text>
            </View>
        </View>
    );
};

// ─── Main Onboarding Component ────────────────────────────────────────────────
const Onboarding = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const flatRef = useRef<FlatList>(null);
    const isLastSlide = activeIndex === SLIDES.length - 1;
    const currentSlide = SLIDES[activeIndex];
    const light = isLight(currentSlide.bg);

    const goNext = () => {
        if (isLastSlide) {
            router.replace("/(auth)/sign-in");
            return;
        }
        const next = activeIndex + 1;
        flatRef.current?.scrollToIndex({ index: next, animated: true });
        setActiveIndex(next);
    };

    const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const idx = Math.round(e.nativeEvent.contentOffset.x / W);
        if (idx !== activeIndex) setActiveIndex(idx);
    };

    return (
        <View style={{ flex: 1, backgroundColor: currentSlide.bg }}>
            <StatusBar barStyle={light ? "dark-content" : "light-content"} />

            <FlatList
                ref={flatRef}
                data={SLIDES}
                keyExtractor={(i) => i.id}
                horizontal pagingEnabled
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={16}
                onScroll={onScroll}
                renderItem={({ item }) => <Slide item={item} />}
            />

            {/* Floating Bottom Navigation */}
            <SafeAreaView
                edges={["bottom"]}
                style={{ position: "absolute", bottom: 0, left: 0, right: 0, paddingHorizontal: 32, paddingBottom: 24, paddingTop: 24 }}
            >
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>

                    {/* Pagination Dots */}
                    <View style={{ flexDirection: "row", gap: 6 }}>
                        {SLIDES.map((_, i) => (
                            <View key={i} style={{
                                width: i === activeIndex ? 24 : 8, height: 8, borderRadius: 4,
                                backgroundColor: light ? "#081126" : "#ffffff",
                                opacity: i === activeIndex ? 1 : 0.2,
                            }} />
                        ))}
                    </View>

                    {/* Actions */}
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
                        {!isLastSlide && (
                            <Pressable onPress={() => router.replace("/(auth)/sign-in")}>
                                <Text style={{ fontSize: 15, fontWeight: "700", color: light ? "rgba(8,17,38,0.5)" : "rgba(255,255,255,0.5)" }}>
                                    Skip
                                </Text>
                            </Pressable>
                        )}

                        <Pressable
                            onPress={goNext}
                            style={{
                                backgroundColor: isLastSlide ? "#ea7a53" : (light ? "#081126" : "#ffffff"),
                                borderRadius: 28, paddingHorizontal: isLastSlide ? 32 : 24, paddingVertical: 16,
                                shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 16,
                            }}
                        >
                            <Text style={{ color: isLastSlide ? "#ffffff" : (light ? "#ffffff" : "#081126"), fontSize: 16, fontWeight: "900" }}>
                                {isLastSlide ? "Get Started ✨" : "Next"}
                            </Text>
                        </Pressable>
                    </View>

                </View>
            </SafeAreaView>
        </View>
    );
};

export default Onboarding;