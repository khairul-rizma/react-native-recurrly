import { Tabs } from "expo-router";
import { View, Image, StyleSheet } from "react-native";
import { icons } from "@/constants/icons"; // Make sure this matches your path alias

// Reusable TabIcon component
const TabIcon = ({ focused, icon }: TabIconProps) => (
    <View style={styles.iconContainer}>
            <Image
                source={icon}
                resizeMode="contain"
                style={[
                        styles.icon,
                        // Using Indigo-600 for active, Slate-400 for inactive (matching your Recurrly theme)
                        { tintColor: focused ? "#4F46E5" : "#94A3B8" },
                ]}
            />
    </View>
);

const TabLayout = () => {
        return (
            <Tabs
                screenOptions={{
                        headerShown: false,
                        tabBarShowLabel: false, // Hiding labels makes the floating tab bar look much cleaner
                        tabBarStyle: styles.tabBar,
                }}
            >
                    <Tabs.Screen
                        name="index"
                        options={{
                                title: "Home",
                                tabBarIcon: ({ focused }) => (
                                    <TabIcon focused={focused} icon={icons.home} />
                                ),
                        }}
                    />

                    <Tabs.Screen
                        name="subscriptions"
                        options={{
                                title: "Subscriptions",
                                tabBarIcon: ({ focused }) => (
                                    <TabIcon focused={focused} icon={icons.wallet} />
                                ),
                        }}
                    />

                    <Tabs.Screen
                        name="insights"
                        options={{
                                title: "Insights",
                                tabBarIcon: ({ focused }) => (
                                    <TabIcon focused={focused} icon={icons.activity} />
                                ),
                        }}
                    />

                    <Tabs.Screen
                        name="settings"
                        options={{
                                title: "Settings",
                                tabBarIcon: ({ focused }) => (
                                    <TabIcon focused={focused} icon={icons.setting} />
                                ),
                        }}
                    />

                    <Tabs.Screen
                        name="subscriptions/[id]"
                        options={{
                                href: null, // Keeps the detailed view hidden from the bottom bar
                        }}
                    />
            </Tabs>
        );
};

const styles = StyleSheet.create({
        tabBar: {
                position: "absolute",
                bottom: 24,
                left: 20,
                right: 20,
                backgroundColor: "#FFFFFF",
                borderRadius: 32,
                height: 64,
                borderTopWidth: 0,
                paddingBottom: 0, // Fixes vertical alignment on iOS
                paddingHorizontal: 20,
                marginHorizontal: 20,

                // iOS Shadow
                shadowColor: "#000000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 12,

                // Android Shadow
                elevation: 8,
        },
        iconContainer: {
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
        },
        icon: {
                width: 24,
                height: 24,
                top: 10
        },
});

export default TabLayout;