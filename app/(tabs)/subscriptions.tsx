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
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSubscriptions } from "@/context/SubscriptionsContext";
import { icons } from "@/constants/icons";

// ─── Palette ──────────────────────────────────────────────────────────────────
const C = {
    bg:     '#fff9e3',
    card:   '#fff8e7',
    navy:   '#081126',
    coral:  '#ea7a53',
    border: '#e2e8f0',
    muted:  '#94a3b8',
    muted2: '#64748b',
    white:  '#ffffff',
};

// ─── Categories (shared with index.tsx) ───────────────────────────────────────
const CATEGORIES: { label: string; emoji: string; color: string }[] = [
    { label: 'Entertainment', emoji: '🎬', color: '#7c3aed' },
    { label: 'Music',         emoji: '🎵', color: '#db2777' },
    { label: 'Productivity',  emoji: '⚡',  color: '#0891b2' },
    { label: 'Health',        emoji: '💪', color: '#16a34a' },
    { label: 'Finance',       emoji: '💳', color: '#ea7a53' },
    { label: 'Gaming',        emoji: '🎮', color: '#9333ea' },
    { label: 'Cloud',         emoji: '☁️',  color: '#2563eb' },
    { label: 'News',          emoji: '📰', color: '#b45309' },
    { label: 'Education',     emoji: '📚', color: '#0d9488' },
    { label: 'Shopping',      emoji: '🛍️',  color: '#e11d48' },
    { label: 'Food',          emoji: '🍔', color: '#ea580c' },
    { label: 'General',       emoji: '📦', color: '#475569' },
];

const getCategoryConfig = (label?: string) =>
    CATEGORIES.find((c) => c.label === label) ?? CATEGORIES[CATEGORIES.length - 1];

// ─── Types ────────────────────────────────────────────────────────────────────
type Status = 'active' | 'paused' | 'cancelled';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getStatusConfig = (status?: string) => {
    switch (status?.toLowerCase()) {
        case 'active':    return { bg: '#d1fae5', text: '#065f46', dot: '#10b981', label: 'Active' };
        case 'paused':    return { bg: '#fef3c7', text: '#92400e', dot: '#f59e0b', label: 'Paused' };
        case 'cancelled': return { bg: '#fee2e2', text: '#991b1b', dot: '#ef4444', label: 'Cancelled' };
        default:          return { bg: '#f1f5f9', text: '#475569', dot: '#94a3b8', label: 'Unknown' };
    }
};

const getBillingLabel = (billing: string) => billing === 'Yearly' ? '/ yr' : '/ mo';

// ─── Hero Card ────────────────────────────────────────────────────────────────
const HeroCard = ({ activeSubs, totalActiveSpend, totalCount }: {
    activeSubs: any[]; totalActiveSpend: number; totalCount: number;
}) => {
    const pausedCount = totalCount - activeSubs.length;
    const yearlyEst   = totalActiveSpend * 12;

    return (
        <View style={{
            backgroundColor: C.navy, borderRadius: 32, padding: 28, marginBottom: 28,
            shadowColor: C.navy, shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.35, shadowRadius: 24, elevation: 10, overflow: 'hidden',
        }}>
            <View style={{ position: 'absolute', top: -40, right: -40,
                width: 160, height: 160, borderRadius: 80,
                backgroundColor: C.coral, opacity: 0.15 }} />
            <View style={{ position: 'absolute', bottom: -30, left: -20,
                width: 100, height: 100, borderRadius: 50,
                backgroundColor: '#3b82f6', opacity: 0.1 }} />

            <Text style={{ color: C.muted, fontSize: 10, fontWeight: '800',
                letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 8 }}>
                Monthly Spend
            </Text>
            <Text style={{ color: C.white, fontSize: 48, fontWeight: '900',
                letterSpacing: -1, marginBottom: 4 }}>
                MYR {totalActiveSpend.toFixed(2)}
            </Text>
            <Text style={{ color: C.muted2, fontSize: 12, fontWeight: '700', marginBottom: 28 }}>
                ≈ MYR {yearlyEst.toFixed(2)} / year
            </Text>

            <View style={{ height: 1, backgroundColor: '#1e293b', marginBottom: 20 }} />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                {[
                    { label: 'Total',  value: `${totalCount}`,       accent: C.muted   },
                    { label: 'Active', value: `${activeSubs.length}`, accent: '#10b981' },
                    { label: 'Paused', value: `${pausedCount}`,       accent: '#f59e0b' },
                ].map(({ label, value, accent }) => (
                    <View key={label} style={{ alignItems: 'center', flex: 1 }}>
                        <Text style={{ color: accent, fontSize: 22, fontWeight: '900' }}>{value}</Text>
                        <Text style={{ color: '#475569', fontSize: 10, fontWeight: '700',
                            textTransform: 'uppercase', letterSpacing: 1.5, marginTop: 2 }}>{label}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

// ─── Category Breakdown Row ───────────────────────────────────────────────────
const CategoryRow = ({ category, total, count }: {
    category: string; total: number; count: number;
}) => {
    const catCfg = getCategoryConfig(category);
    return (
        <View style={{
            flexDirection: 'row', alignItems: 'center',
            backgroundColor: C.card, borderRadius: 16,
            paddingVertical: 12, paddingHorizontal: 16,
            borderWidth: 1, borderColor: C.border, marginBottom: 8,
        }}>
            {/* Emoji + colored dot */}
            <View style={{
                width: 32, height: 32, borderRadius: 10,
                backgroundColor: catCfg.color + '18',
                alignItems: 'center', justifyContent: 'center', marginRight: 12,
            }}>
                <Text style={{ fontSize: 16 }}>{catCfg.emoji}</Text>
            </View>
            <Text style={{ flex: 1, fontSize: 13, fontWeight: '700', color: C.navy }}>
                {category}
            </Text>
            <Text style={{ fontSize: 11, fontWeight: '700', color: C.muted, marginRight: 12 }}>
                {count} sub{count !== 1 ? 's' : ''}
            </Text>
            <Text style={{ fontSize: 14, fontWeight: '900', color: catCfg.color }}>
                MYR {total.toFixed(2)}
            </Text>
        </View>
    );
};

// ─── Info Chip ────────────────────────────────────────────────────────────────
const InfoChip = ({ label, value }: { label: string; value: string }) => (
    <View style={{
        flex: 1, backgroundColor: '#f8fafc', borderRadius: 14,
        padding: 12, alignItems: 'center',
    }}>
        <Text style={{ fontSize: 9, fontWeight: '700', color: C.muted,
            textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4 }}>{label}</Text>
        <Text style={{ fontSize: 12, fontWeight: '900', color: C.navy }}>{value}</Text>
    </View>
);

// ─── Subscription Card ────────────────────────────────────────────────────────
const SubCard = ({ sub, isExpanded, onPress, onEdit, onDelete }: {
    sub: any; isExpanded: boolean;
    onPress: () => void; onEdit: () => void; onDelete: () => void;
}) => {
    const status = getStatusConfig(sub.status);
    const catCfg = getCategoryConfig(sub.category);

    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => ({
                backgroundColor: isExpanded ? C.white : C.card,
                borderRadius: 28, padding: 20,
                borderWidth: 1, borderColor: C.border,
                marginBottom: 12,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: isExpanded ? 6 : 2 },
                shadowOpacity: isExpanded ? 0.08 : 0.04,
                shadowRadius: isExpanded ? 16 : 6,
                elevation: isExpanded ? 4 : 1,
                opacity: pressed ? 0.95 : 1,
            })}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {/* Icon bubble */}
                <View style={{
                    width: 56, height: 56, borderRadius: 18,
                    backgroundColor: sub.color || catCfg.color + '22',
                    alignItems: 'center', justifyContent: 'center', marginRight: 16,
                    shadowColor: sub.color || catCfg.color,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3, shadowRadius: 8,
                }}>
                    <Image source={sub.icon} style={{ width: 30, height: 30 }} resizeMode="contain" />
                </View>

                {/* Name + category + status */}
                <View style={{ flex: 1 }}>
                    {/* Category pill — matches index.tsx */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                        <Text style={{ fontSize: 12 }}>{catCfg.emoji}</Text>
                        <Text style={{
                            fontSize: 9, fontWeight: '800',
                            color: catCfg.color,
                            textTransform: 'uppercase', letterSpacing: 2,
                        }}>{sub.category || 'General'}</Text>
                    </View>

                    <Text style={{ fontSize: 16, fontWeight: '900', color: C.navy, marginBottom: 6 }}>
                        {sub.name}
                    </Text>

                    <View style={{
                        flexDirection: 'row', alignItems: 'center',
                        backgroundColor: status.bg, alignSelf: 'flex-start',
                        paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20,
                    }}>
                        <View style={{ width: 5, height: 5, borderRadius: 3,
                            backgroundColor: status.dot, marginRight: 5 }} />
                        <Text style={{ fontSize: 9, fontWeight: '900', color: status.text,
                            textTransform: 'uppercase', letterSpacing: 1 }}>{status.label}</Text>
                    </View>
                </View>

                {/* Price + chevron */}
                <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: 18, fontWeight: '900', color: C.navy }}>
                        {sub.price.toFixed(2)}
                    </Text>
                    <Text style={{ fontSize: 9, fontWeight: '700', color: C.muted,
                        textTransform: 'uppercase' }}>
                        MYR {getBillingLabel(sub.billing ?? 'Monthly')}
                    </Text>
                    <Text style={{ fontSize: 12, color: '#cbd5e1', marginTop: 8,
                        transform: [{ rotate: isExpanded ? '180deg' : '0deg' }] }}>▼</Text>
                </View>
            </View>

            {/* Expanded detail */}
            {isExpanded && (
                <View>
                    <View style={{
                        flexDirection: 'row', marginTop: 20, paddingTop: 20,
                        borderTopWidth: 1, borderTopColor: '#f1f5f9',
                        borderStyle: 'dashed', gap: 10,
                    }}>
                        <InfoChip label="Plan"     value={sub.plan || '—'} />
                        <InfoChip label="Billing"  value={sub.billing || 'Monthly'} />
                        <InfoChip label="Currency" value={sub.currency || 'MYR'} />
                    </View>

                    {sub.billing !== 'Yearly' && (
                        <View style={{
                            backgroundColor: '#f8fafc', borderRadius: 16,
                            padding: 14, marginTop: 12,
                            flexDirection: 'row', alignItems: 'center',
                            justifyContent: 'space-between',
                        }}>
                            <Text style={{ fontSize: 11, fontWeight: '700', color: C.muted2 }}>
                                📅 Annual projection
                            </Text>
                            <Text style={{ fontSize: 14, fontWeight: '900', color: C.navy }}>
                                MYR {(sub.price * 12).toFixed(2)}
                            </Text>
                        </View>
                    )}

                    <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
                        <Pressable
                            onPress={onDelete}
                            style={({ pressed }) => ({
                                flex: 1, paddingVertical: 14, borderRadius: 16,
                                alignItems: 'center', borderWidth: 1, borderColor: '#fecdd3',
                                backgroundColor: pressed ? '#fee2e2' : '#fff1f2',
                            })}
                        >
                            <Text style={{ color: '#e11d48', fontWeight: '800', fontSize: 13 }}>
                                🗑  Delete
                            </Text>
                        </Pressable>
                        <Pressable
                            onPress={onEdit}
                            style={({ pressed }) => ({
                                flex: 1, backgroundColor: C.coral,
                                paddingVertical: 14, borderRadius: 16,
                                alignItems: 'center', opacity: pressed ? 0.85 : 1,
                            })}
                        >
                            <Text style={{ color: C.white, fontWeight: '800', fontSize: 13 }}>
                                ✏️  Edit
                            </Text>
                        </Pressable>
                    </View>
                </View>
            )}
        </Pressable>
    );
};

// ─── Category Picker (matches index.tsx exactly) ──────────────────────────────
const CategoryPicker = ({
                            selected, onSelect,
                        }: { selected: string; onSelect: (label: string) => void }) => (
    <View style={{ marginBottom: 20 }}>
        <ModalLabel text="Category" />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {CATEGORIES.map((cat) => {
                const isSelected = selected === cat.label;
                return (
                    <Pressable
                        key={cat.label}
                        onPress={() => onSelect(cat.label)}
                        style={({ pressed }) => ({
                            flexBasis: '30.5%',
                            paddingVertical: 12, paddingHorizontal: 6,
                            borderRadius: 18, alignItems: 'center',
                            backgroundColor: isSelected ? cat.color + '18' : '#f8fafc',
                            borderWidth: 1.5,
                            borderColor: isSelected ? cat.color : C.border,
                            opacity: pressed ? 0.75 : 1,
                        })}
                    >
                        <Text style={{ fontSize: 20, marginBottom: 5 }}>{cat.emoji}</Text>
                        <Text style={{
                            fontSize: 9, fontWeight: '900',
                            textTransform: 'uppercase', letterSpacing: 0.8,
                            textAlign: 'center',
                            color: isSelected ? cat.color : C.muted2,
                        }}>{cat.label}</Text>
                    </Pressable>
                );
            })}
        </View>
    </View>
);

// ─── Modal Label ──────────────────────────────────────────────────────────────
const ModalLabel = ({ text }: { text: string }) => (
    <Text style={{ fontSize: 10, fontWeight: '900', color: C.muted,
        textTransform: 'uppercase', letterSpacing: 2,
        marginLeft: 4, marginBottom: 8 }}>{text}</Text>
);

const modalInputStyle = {
    backgroundColor: C.white,
    borderWidth: 1.5, borderColor: C.border,
    borderRadius: 18, padding: 16, marginBottom: 16,
    fontSize: 15, fontWeight: '700' as const, color: C.navy,
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
const Subscriptions = () => {
    const { subscriptions, removeSubscription, updateSubscription, addSubscription, isLoading } =
        useSubscriptions();

    const [activeFilter, setActiveFilter]     = useState('All');
    const [expandedSubId, setExpandedSubId]   = useState<string | null>(null);
    const [isModalVisible, setModalVisible]   = useState(false);
    const [showCategories, setShowCategories] = useState(false);

    const [editingSubId, setEditingSubId] = useState<string | null>(null);
    const [newName,     setNewName]     = useState('');
    const [newPrice,    setNewPrice]    = useState('');
    const [newStatus,   setNewStatus]   = useState<Status>('active');
    const [newCategory, setNewCategory] = useState('General');

    if (isLoading) return (
        <View style={{ flex: 1, backgroundColor: C.bg, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: C.muted, fontWeight: '800', letterSpacing: 2,
                textTransform: 'uppercase', fontSize: 12 }}>Loading…</Text>
        </View>
    );

    const activeSubs       = subscriptions.filter((s: any) => s.status === 'active');
    const totalActiveSpend = activeSubs.reduce((acc: number, s: any) => acc + s.price, 0);

    const filteredData = subscriptions.filter((s: any) =>
        activeFilter === 'All' ? true : s.status?.toLowerCase() === activeFilter.toLowerCase()
    );

    // Category breakdown uses CATEGORIES order for consistent colour mapping
    const categoryMap: Record<string, { total: number; count: number }> = {};
    activeSubs.forEach((s: any) => {
        const cat = s.category || 'General';
        if (!categoryMap[cat]) categoryMap[cat] = { total: 0, count: 0 };
        categoryMap[cat].total += s.price;
        categoryMap[cat].count += 1;
    });
    const categories = Object.entries(categoryMap).sort((a, b) => b[1].total - a[1].total);

    // ── Handlers ─────────────────────────────────────────────────────────────
    const handleSave = () => {
        if (!newName || !newPrice) return;
        const priceNum = parseFloat(newPrice) || 0;
        const catCfg   = getCategoryConfig(newCategory);

        if (editingSubId) {
            const old = subscriptions.find((s: any) => s.id === editingSubId);
            if (old) updateSubscription(editingSubId, {
                ...old,
                name: newName, price: priceNum,
                status: newStatus, category: newCategory,
                color: catCfg.color,
            });
        } else {
            addSubscription({
                id: Date.now().toString(),
                icon: icons.wallet,
                name: newName, price: priceNum,
                plan: 'Custom', category: newCategory,
                status: newStatus, currency: 'MYR',
                billing: 'Monthly', color: catCfg.color,
            });
        }
        closeModal();
    };

    const openEdit = (sub: any) => {
        setEditingSubId(sub.id);
        setNewName(sub.name);
        setNewPrice(sub.price.toString());
        setNewStatus(sub.status as Status);
        setNewCategory(sub.category || 'General');
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setEditingSubId(null);
        setNewName(''); setNewPrice('');
        setNewStatus('active'); setNewCategory('General');
        Keyboard.dismiss();
    };

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
            <ScrollView
                contentContainerStyle={{ paddingBottom: 120, paddingHorizontal: 20, paddingTop: 16 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Page title + add button */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between',
                    alignItems: 'center', marginBottom: 24 }}>
                    <View>
                        <Text style={{ fontSize: 30, fontWeight: '900', color: C.navy,
                            letterSpacing: -0.5 }}>Subscriptions</Text>
                        <Text style={{ fontSize: 11, fontWeight: '700', color: C.muted,
                            letterSpacing: 2, textTransform: 'uppercase', marginTop: 2 }}>
                            {subscriptions.length} tracked
                        </Text>
                    </View>
                    <Pressable
                        onPress={() => { setEditingSubId(null); setModalVisible(true); }}
                        style={({ pressed }) => ({
                            backgroundColor: C.navy,
                            width: 48, height: 48, borderRadius: 18,
                            alignItems: 'center', justifyContent: 'center',
                            shadowColor: C.navy,
                            shadowOffset: { width: 0, height: 6 },
                            shadowOpacity: 0.3, shadowRadius: 12,
                            opacity: pressed ? 0.8 : 1,
                        })}
                    >
                        <Text style={{ color: C.white, fontSize: 26, fontWeight: '300',
                            marginTop: -2, lineHeight: 28 }}>+</Text>
                    </Pressable>
                </View>

                {/* Hero card */}
                <HeroCard
                    activeSubs={activeSubs}
                    totalActiveSpend={totalActiveSpend}
                    totalCount={subscriptions.length}
                />

                {/* Category breakdown toggle */}
                {categories.length > 0 && (
                    <View style={{ marginBottom: 24 }}>
                        <Pressable
                            onPress={() => setShowCategories(!showCategories)}
                            style={{ flexDirection: 'row', justifyContent: 'space-between',
                                alignItems: 'center', marginBottom: 12 }}
                        >
                            <Text style={{ fontSize: 13, fontWeight: '900', color: C.navy,
                                textTransform: 'uppercase', letterSpacing: 1.5 }}>
                                Spend by Category
                            </Text>
                            <Text style={{ fontSize: 11, fontWeight: '700', color: C.coral }}>
                                {showCategories ? 'Hide ▲' : 'Show ▼'}
                            </Text>
                        </Pressable>
                        {showCategories && categories.map(([cat, data]) => (
                            <CategoryRow key={cat} category={cat} total={data.total} count={data.count} />
                        ))}
                    </View>
                )}

                {/* Filter pills */}
                <ScrollView
                    horizontal showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ gap: 8, paddingBottom: 4 }}
                    style={{ marginBottom: 20 }}
                >
                    {[
                        { label: 'All',       count: subscriptions.length },
                        { label: 'Active',    count: subscriptions.filter((s: any) => s.status === 'active').length },
                        { label: 'Paused',    count: subscriptions.filter((s: any) => s.status === 'paused').length },
                        { label: 'Cancelled', count: subscriptions.filter((s: any) => s.status === 'cancelled').length },
                    ].map(({ label, count }) => (
                        <Pressable
                            key={label}
                            onPress={() => setActiveFilter(label)}
                            style={({ pressed }) => ({
                                backgroundColor: activeFilter === label ? C.coral : C.card,
                                paddingHorizontal: 18, paddingVertical: 10,
                                borderRadius: 50,
                                borderWidth: 1,
                                borderColor: activeFilter === label ? C.coral : C.border,
                                flexDirection: 'row', alignItems: 'center', gap: 6,
                                opacity: pressed ? 0.85 : 1,
                            })}
                        >
                            <Text style={{
                                color: activeFilter === label ? C.white : C.muted2,
                                fontWeight: '900', fontSize: 11,
                                textTransform: 'uppercase', letterSpacing: 1.5,
                            }}>{label}</Text>
                            <View style={{
                                backgroundColor: activeFilter === label ? 'rgba(255,255,255,0.25)' : C.border,
                                borderRadius: 10, paddingHorizontal: 6, paddingVertical: 1,
                            }}>
                                <Text style={{
                                    color: activeFilter === label ? C.white : C.muted,
                                    fontSize: 9, fontWeight: '900',
                                }}>{count}</Text>
                            </View>
                        </Pressable>
                    ))}
                </ScrollView>

                {/* Section count label */}
                <Text style={{ fontSize: 11, fontWeight: '800', color: C.muted,
                    textTransform: 'uppercase', letterSpacing: 2, marginBottom: 14 }}>
                    {filteredData.length} {activeFilter === 'All' ? 'Total' : activeFilter} Subscriptions
                </Text>

                {/* Cards */}
                {filteredData.length > 0 ? (
                    filteredData.map((sub: any) => (
                        <SubCard
                            key={sub.id}
                            sub={sub}
                            isExpanded={expandedSubId === sub.id}
                            onPress={() => setExpandedSubId(expandedSubId === sub.id ? null : sub.id)}
                            onEdit={() => openEdit(sub)}
                            onDelete={() => removeSubscription(sub.id)}
                        />
                    ))
                ) : (
                    <View style={{
                        alignItems: 'center', justifyContent: 'center',
                        paddingVertical: 60, paddingHorizontal: 24,
                        backgroundColor: C.card, borderRadius: 32,
                        borderWidth: 1.5, borderColor: C.border, borderStyle: 'dashed',
                    }}>
                        <Text style={{ fontSize: 48, marginBottom: 16 }}>📭</Text>
                        <Text style={{ fontSize: 20, fontWeight: '900', color: C.navy,
                            textAlign: 'center', marginBottom: 8 }}>
                            No {activeFilter} Subscriptions
                        </Text>
                        <Text style={{ fontSize: 13, fontWeight: '500', color: C.muted,
                            textAlign: 'center', lineHeight: 20 }}>
                            You don't have any {activeFilter.toLowerCase()} subscriptions right now.
                        </Text>
                    </View>
                )}
            </ScrollView>

            {/* ── Add / Edit Modal ──────────────────────────────────────────── */}
            <Modal visible={isModalVisible} animationType="slide" transparent>
                <View style={{ flex: 1, justifyContent: 'flex-end',
                    backgroundColor: 'rgba(8,17,38,0.5)' }}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <KeyboardAvoidingView
                            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        >
                            <View style={{
                                backgroundColor: C.card,
                                borderTopLeftRadius: 40, borderTopRightRadius: 40,
                                paddingHorizontal: 24, paddingTop: 12,
                                paddingBottom: Platform.OS === 'ios' ? 40 : 28,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: -8 },
                                shadowOpacity: 0.15, shadowRadius: 24,
                                maxHeight: '92%',
                            }}>
                                {/* Drag handle */}
                                <View style={{
                                    width: 40, height: 4, borderRadius: 2,
                                    backgroundColor: C.border,
                                    alignSelf: 'center', marginBottom: 20,
                                }} />

                                {/* Modal header */}
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between',
                                    alignItems: 'center', marginBottom: 24 }}>
                                    <View>
                                        <Text style={{ fontSize: 24, fontWeight: '900', color: C.navy }}>
                                            {editingSubId ? '✏️  Edit' : '＋  Add'} Subscription
                                        </Text>
                                        <Text style={{ fontSize: 11, color: C.muted,
                                            fontWeight: '600', marginTop: 2 }}>
                                            {editingSubId
                                                ? 'Update your subscription details'
                                                : 'Track a new recurring expense'}
                                        </Text>
                                    </View>
                                    <Pressable
                                        onPress={closeModal}
                                        style={({ pressed }) => ({
                                            width: 36, height: 36, borderRadius: 18,
                                            backgroundColor: pressed ? C.border : '#f1f5f9',
                                            alignItems: 'center', justifyContent: 'center',
                                        })}
                                    >
                                        <Text style={{ fontSize: 14, color: C.muted2, fontWeight: '700' }}>✕</Text>
                                    </Pressable>
                                </View>

                                {/* Scrollable body */}
                                <ScrollView
                                    showsVerticalScrollIndicator={false}
                                    keyboardShouldPersistTaps="handled"
                                    contentContainerStyle={{ paddingBottom: 8 }}
                                >
                                    {/* Name */}
                                    <ModalLabel text="Service Name" />
                                    <TextInput
                                        style={modalInputStyle}
                                        placeholder="e.g. Netflix, Spotify…"
                                        placeholderTextColor="#c0c8d6"
                                        value={newName}
                                        onChangeText={setNewName}
                                    />

                                    {/* Price */}
                                    <ModalLabel text="Monthly Price (MYR)" />
                                    <TextInput
                                        style={[modalInputStyle, { marginBottom: 20 }]}
                                        placeholder="0.00"
                                        placeholderTextColor="#c0c8d6"
                                        keyboardType="numeric"
                                        value={newPrice}
                                        onChangeText={setNewPrice}
                                    />

                                    {/* Category picker — identical to index.tsx */}
                                    <CategoryPicker
                                        selected={newCategory}
                                        onSelect={setNewCategory}
                                    />

                                    {/* Status */}
                                    <ModalLabel text="Status" />
                                    <View style={{ flexDirection: 'row', gap: 8, marginBottom: 28 }}>
                                        {(['active', 'paused', 'cancelled'] as const).map((s) => {
                                            const cfg      = getStatusConfig(s);
                                            const selected = newStatus === s;
                                            return (
                                                <Pressable
                                                    key={s}
                                                    onPress={() => setNewStatus(s)}
                                                    style={{
                                                        flex: 1, paddingVertical: 14,
                                                        borderRadius: 18, alignItems: 'center',
                                                        backgroundColor: selected ? cfg.bg : '#f8fafc',
                                                        borderWidth: 1.5,
                                                        borderColor: selected ? cfg.dot : C.border,
                                                    }}
                                                >
                                                    <View style={{
                                                        width: 6, height: 6, borderRadius: 3,
                                                        backgroundColor: cfg.dot, marginBottom: 5,
                                                    }} />
                                                    <Text style={{
                                                        fontSize: 10, fontWeight: '900',
                                                        textTransform: 'uppercase', letterSpacing: 1,
                                                        color: selected ? cfg.text : C.muted,
                                                    }}>{s}</Text>
                                                </Pressable>
                                            );
                                        })}
                                    </View>

                                    {/* Save */}
                                    <Pressable
                                        onPress={handleSave}
                                        style={({ pressed }) => ({
                                            backgroundColor: C.navy, paddingVertical: 18,
                                            borderRadius: 22, alignItems: 'center',
                                            opacity: pressed ? 0.85 : 1,
                                            shadowColor: C.navy,
                                            shadowOffset: { width: 0, height: 8 },
                                            shadowOpacity: 0.3, shadowRadius: 16,
                                        })}
                                    >
                                        <Text style={{ color: C.white, fontSize: 16,
                                            fontWeight: '900', letterSpacing: 0.5 }}>
                                            {editingSubId ? 'Update Subscription' : 'Save Subscription'}
                                        </Text>
                                    </Pressable>
                                </ScrollView>
                            </View>
                        </KeyboardAvoidingView>
                    </TouchableWithoutFeedback>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default Subscriptions;