import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    Pressable,
    Modal,
    TextInput,
    Keyboard,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSubscriptions } from "@/context/SubscriptionsContext";
import { icons } from "@/constants/icons";

const Subscriptions = () => {
    // 1. Context & Global State
    const { subscriptions, removeSubscription, updateSubscription, addSubscription, isLoading } = useSubscriptions();

    // 2. Local UI State
    const [activeFilter, setActiveFilter] = useState('All');
    const [expandedSubId, setExpandedSubId] = useState<string | null>(null);
    const [isModalVisible, setModalVisible] = useState(false);

    // 3. Form State
    const [editingSubId, setEditingSubId] = useState<string | null>(null);
    const [newName, setNewName] = useState("");
    const [newPrice, setNewPrice] = useState("");
    const [newStatus, setNewStatus] = useState<"active" | "paused" | "cancelled">("active");

    // 4. Loading State Check
    if (isLoading) {
        return (
            <View className="flex-1 bg-[#fff9e3] justify-center items-center">
                <Text className="text-slate-400 font-bold uppercase tracking-widest">Loading data...</Text>
            </View>
        );
    }

    // 5. Data Calculations for Header & Filtering
    const activeSubs = subscriptions.filter((s: any) => s.status === 'active');
    const totalActiveSpend = activeSubs.reduce((acc: number, sub: any) => acc + sub.price, 0);

    const filteredData = subscriptions.filter((sub: any) => {
        if (activeFilter === 'All') return true;
        return sub.status?.toLowerCase() === activeFilter.toLowerCase();
    });

    // Helpers
    const getStatusColors = (status: string | undefined) => {
        switch (status?.toLowerCase()) {
            case "active": return { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" };
            case "paused": return { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" };
            case "cancelled": return { bg: "bg-rose-50", text: "text-rose-700", dot: "bg-rose-500" };
            default: return { bg: "bg-slate-50", text: "text-slate-700", dot: "bg-slate-500" };
        }
    };

    const handleSave = () => {
        if (!newName || !newPrice) return;
        const priceNum = parseFloat(newPrice) || 0;

        if (editingSubId) {
            const oldSub = subscriptions.find((s: any) => s.id === editingSubId);
            if (oldSub) {
                updateSubscription(editingSubId, { ...oldSub, name: newName, price: priceNum, status: newStatus });
            }
        } else {
            addSubscription({
                id: Date.now().toString(),
                icon: icons.wallet,
                name: newName,
                plan: "Custom Expense",
                category: "Custom",
                status: newStatus,
                price: priceNum,
                currency: "MYR",
                billing: "Monthly",
                color: "#ea7a53",
            });
        }
        closeModal();
    };

    const openEdit = (sub: any) => {
        setEditingSubId(sub.id);
        setNewName(sub.name);
        setNewPrice(sub.price.toString());
        setNewStatus(sub.status as any);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setEditingSubId(null);
        setNewName("");
        setNewPrice("");
        setNewStatus("active");
        Keyboard.dismiss();
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff9e3" }}>
            <ScrollView contentContainerClassName="pb-32 px-6 pt-4" showsVerticalScrollIndicator={false}>

                {/* Informative Header */}
                <View className="flex-row justify-between items-end mb-8 mt-2">
                    <View>
                        <Text className="text-3xl font-black text-[#081126] tracking-tight">Subscriptions</Text>
                        <Text className="text-[11px] font-bold text-slate-500 mt-1 uppercase tracking-widest">
                            {activeSubs.length} Active • ${totalActiveSpend.toFixed(2)}/MO
                        </Text>
                    </View>
                    <Pressable
                        onPress={() => setModalVisible(true)}
                        className="bg-[#081126] w-12 h-12 rounded-2xl items-center justify-center shadow-sm active:opacity-80"
                    >
                        <Text className="text-white font-medium text-2xl mt-[-2px]">+</Text>
                    </Pressable>
                </View>

                {/* Filter Pills */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row mb-8" contentContainerStyle={{ gap: 10 }}>
                    {['All', 'Active', 'Paused', 'Cancelled'].map((label) => (
                        <Pressable
                            key={label}
                            onPress={() => setActiveFilter(label)}
                            className={`${activeFilter === label ? 'bg-[#ea7a53]' : 'bg-[#fff8e7] border border-slate-200'} px-6 py-3 rounded-full shadow-sm active:opacity-80`}
                        >
                            <Text className={`${activeFilter === label ? 'text-white' : 'text-slate-500'} font-black text-xs uppercase tracking-widest`}>
                                {label}
                            </Text>
                        </Pressable>
                    ))}
                </ScrollView>

                {/* List Items */}
                <View className="gap-4">
                    {filteredData.length > 0 ? (
                        filteredData.map((sub: any) => {
                            const { text, dot } = getStatusColors(sub.status);
                            const isExpanded = expandedSubId === sub.id;

                            return (
                                <Pressable
                                    key={sub.id}
                                    onPress={() => setExpandedSubId(isExpanded ? null : sub.id)}
                                    className={`bg-[#fff8e7] p-5 rounded-[28px] border border-slate-200 shadow-sm transition-all ${isExpanded ? 'bg-white' : ''}`}
                                >
                                    <View className="flex-row items-center">
                                        <View className="w-14 h-14 rounded-2xl items-center justify-center mr-4" style={{ backgroundColor: sub.color || '#fff' }}>
                                            <Image source={sub.icon} className="w-8 h-8" resizeMode="contain" />
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{sub.category || "General"}</Text>
                                            <Text className="text-base font-black text-[#081126] mb-1">{sub.name}</Text>
                                            <View className="flex-row items-center">
                                                <View className={`w-2 h-2 rounded-full mr-2 ${dot}`} />
                                                <Text className={`text-[10px] font-black uppercase ${text}`}>{sub.status}</Text>
                                            </View>
                                        </View>
                                        <View className="items-end justify-center">
                                            <Text className="text-lg font-black text-[#081126]">${sub.price.toFixed(2)}</Text>
                                            <Text className="text-[10px] font-bold text-slate-400 uppercase">/{sub.billing === "Yearly" ? "YR" : "MO"}</Text>
                                        </View>
                                    </View>

                                    {/* Expanded Actions */}
                                    {isExpanded && (
                                        <View className="pt-5 mt-5 border-t border-slate-200 border-dashed flex-row gap-3">
                                            <Pressable onPress={() => removeSubscription(sub.id)} className="flex-1 bg-rose-50 py-3.5 rounded-xl items-center border border-rose-100 active:bg-rose-100">
                                                <Text className="text-rose-600 font-bold text-sm">Delete</Text>
                                            </Pressable>
                                            <Pressable onPress={() => openEdit(sub)} className="flex-1 bg-[#ea7a53] py-3.5 rounded-xl items-center active:opacity-80">
                                                <Text className="text-white font-bold text-sm">Edit</Text>
                                            </Pressable>
                                        </View>
                                    )}
                                </Pressable>
                            );
                        })
                    ) : (
                        // Beautiful Empty State
                        <View className="items-center justify-center py-16 px-6 bg-[#fff8e7] rounded-[32px] border border-slate-200 border-dashed">
                            <Text className="text-5xl mb-4">📭</Text>
                            <Text className="text-xl font-black text-[#081126] text-center mb-2">No {activeFilter} Data</Text>
                            <Text className="text-sm font-medium text-slate-500 text-center">
                                You don't have any {activeFilter.toLowerCase()} subscriptions right now.
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Premium Restyled Modal */}
            <Modal visible={isModalVisible} animationType="slide" transparent>
                <View className="flex-1 justify-end bg-[#081126]/40">
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="bg-[#fff8e7] p-7 rounded-t-[40px] shadow-2xl">

                            <View className="flex-row justify-between items-center mb-8">
                                <Text className="text-2xl font-black text-[#081126]">{editingSubId ? "Edit" : "Add"} Subscription</Text>
                                <Pressable onPress={closeModal} className="w-8 h-8 bg-slate-200/50 rounded-full items-center justify-center active:bg-slate-200">
                                    <Text className="font-bold text-slate-500">✕</Text>
                                </Pressable>
                            </View>

                            <Text className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 mb-2">Service Name</Text>
                            <TextInput
                                className="bg-[#fff9e3] border border-slate-200 rounded-2xl p-4 mb-5 text-base font-bold text-[#081126]"
                                placeholder="e.g. Netflix"
                                placeholderTextColor="#A0A0A0"
                                value={newName}
                                onChangeText={setNewName}
                            />

                            <Text className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 mb-2">Price Amount</Text>
                            <TextInput
                                className="bg-[#fff9e3] border border-slate-200 rounded-2xl p-4 mb-6 text-base font-bold text-[#081126]"
                                placeholder="0.00"
                                placeholderTextColor="#A0A0A0"
                                keyboardType="numeric"
                                value={newPrice}
                                onChangeText={setNewPrice}
                            />

                            <Text className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 mb-2">Status</Text>
                            <View className="flex-row gap-2 mb-8">
                                {(['active', 'paused', 'cancelled'] as const).map((s) => {
                                    const isSelected = newStatus === s;
                                    return (
                                        <Pressable
                                            key={s}
                                            onPress={() => setNewStatus(s)}
                                            className={`flex-1 py-4 rounded-2xl border items-center ${isSelected ? 'bg-[#ea7a53]/10 border-[#ea7a53]' : 'bg-[#fff9e3] border-slate-200'}`}
                                        >
                                            <Text className={`text-xs font-black uppercase tracking-wider ${isSelected ? 'text-[#ea7a53]' : 'text-slate-400'}`}>
                                                {s}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </View>

                            <Pressable onPress={handleSave} className="bg-[#081126] py-4 rounded-2xl items-center shadow-md active:opacity-80 mb-8">
                                <Text className="text-white font-bold text-lg">{editingSubId ? "Update Changes" : "Save Subscription"}</Text>
                            </Pressable>

                        </KeyboardAvoidingView>
                    </TouchableWithoutFeedback>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default Subscriptions;