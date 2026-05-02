import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSubscriptions } from '@/context/SubscriptionsContext';

// ─── Palette (mirrors Subscriptions page) ─────────────────────────────────────
const C = {
    bg:      '#fff9e3',
    card:    '#fff8e7',
    navy:    '#081126',
    coral:   '#ea7a53',
    border:  '#e2e8f0',
    muted:   '#94a3b8',
    muted2:  '#64748b',
    white:   '#ffffff',
};

const BAR_COLORS = ['#ea7a53', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getHealthScore = (totalSpend: number, count: number): { score: number; label: string; color: string; bg: string } => {
    if (totalSpend === 0) return { score: 100, label: 'Excellent',  color: '#10b981', bg: '#d1fae5' };
    if (totalSpend < 100 && count <= 5)  return { score: 90,  label: 'Excellent',  color: '#10b981', bg: '#d1fae5' };
    if (totalSpend < 200 && count <= 8)  return { score: 72,  label: 'Good',        color: '#3b82f6', bg: '#dbeafe' };
    if (totalSpend < 350 || count <= 12) return { score: 50,  label: 'Fair',        color: '#f59e0b', bg: '#fef3c7' };
    return                                      { score: 28,  label: 'Review Now',  color: '#ef4444', bg: '#fee2e2' };
};

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Section label */
const SectionLabel = ({ text, action, onAction }: {
    text: string; action?: string; onAction?: () => void;
}) => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 12 }}>
        <Text style={{ fontSize: 10, fontWeight: '900', color: C.muted,
            textTransform: 'uppercase', letterSpacing: 2.5 }}>{text}</Text>
        {action && (
            <Pressable onPress={onAction}>
                <Text style={{ fontSize: 11, fontWeight: '700', color: C.coral }}>{action}</Text>
            </Pressable>
        )}
    </View>
);

/** Quick metric tile */
const MetricTile = ({ label, value, sub, accent }: {
    label: string; value: string; sub?: string; accent: string;
}) => (
    <View style={{
        flex: 1,
        backgroundColor: C.card,
        borderRadius: 22,
        padding: 16,
        borderWidth: 1,
        borderColor: C.border,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
    }}>
        <View style={{
            width: 6, height: 6, borderRadius: 3,
            backgroundColor: accent, marginBottom: 8,
        }} />
        <Text style={{ fontSize: 20, fontWeight: '900', color: C.navy, letterSpacing: -0.5 }}>
            {value}
        </Text>
        {sub && (
            <Text style={{ fontSize: 9, fontWeight: '700', color: C.muted,
                marginTop: 1, letterSpacing: 0.5 }}>{sub}</Text>
        )}
        <Text style={{ fontSize: 9, fontWeight: '800', color: C.muted,
            textTransform: 'uppercase', letterSpacing: 1.5, marginTop: 4,
            textAlign: 'center' }}>{label}</Text>
    </View>
);

/** Radial-style health score ring (drawn with nested Views) */
const HealthRing = ({ score, label, color, bg }: {
    score: number; label: string; color: string; bg: string;
}) => {
    const SIZE = 90;
    const STROKE = 8;
    // Arc approximation using border segments
    return (
        <View style={{ alignItems: 'center', justifyContent: 'center', width: SIZE, height: SIZE }}>
            {/* Outer ring track */}
            <View style={{
                position: 'absolute',
                width: SIZE, height: SIZE,
                borderRadius: SIZE / 2,
                borderWidth: STROKE,
                borderColor: '#e2e8f0',
            }} />
            {/* Progress overlay — top half */}
            {score >= 50 && (
                <View style={{
                    position: 'absolute',
                    width: SIZE, height: SIZE / 2,
                    top: 0, overflow: 'hidden',
                }}>
                    <View style={{
                        width: SIZE, height: SIZE,
                        borderRadius: SIZE / 2,
                        borderWidth: STROKE,
                        borderColor: color,
                        borderBottomColor: 'transparent',
                        borderLeftColor: 'transparent',
                    }} />
                </View>
            )}
            {/* Progress overlay — bottom half (for scores < 50) */}
            {score < 50 && score > 0 && (
                <View style={{
                    position: 'absolute',
                    width: SIZE, height: SIZE / 2,
                    top: 0, overflow: 'hidden',
                }}>
                    <View style={{
                        width: SIZE, height: SIZE,
                        borderRadius: SIZE / 2,
                        borderWidth: STROKE,
                        borderColor: color,
                        borderBottomColor: 'transparent',
                        borderLeftColor: score < 25 ? 'transparent' : color,
                        transform: [{ rotate: `${(score / 50) * 180}deg` }],
                    }} />
                </View>
            )}
            {/* Center label */}
            <View style={{
                width: SIZE - STROKE * 2 - 8,
                height: SIZE - STROKE * 2 - 8,
                borderRadius: (SIZE - STROKE * 2 - 8) / 2,
                backgroundColor: bg,
                alignItems: 'center', justifyContent: 'center',
            }}>
                <Text style={{ fontSize: 20, fontWeight: '900', color }}>{score}</Text>
                <Text style={{ fontSize: 7, fontWeight: '800', color,
                    textTransform: 'uppercase', letterSpacing: 1 }}>/ 100</Text>
            </View>
        </View>
    );
};

/** Alert card */
const AlertCard = ({ type, title, message }: {
    type: 'warning' | 'info' | 'success'; title: string; message: string;
}) => {
    const cfg = {
        warning: { bg: '#fef3c7', border: '#fcd34d', icon: '⚠️',  textColor: '#92400e' },
        info:    { bg: '#eff6ff', border: '#93c5fd', icon: '💡',  textColor: '#1e40af' },
        success: { bg: '#f0fdf4', border: '#86efac', icon: '✅',  textColor: '#166534' },
    }[type];

    return (
        <View style={{
            flexDirection: 'row',
            backgroundColor: cfg.bg,
            borderRadius: 22,
            padding: 18,
            borderWidth: 1,
            borderColor: cfg.border,
            marginBottom: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.04,
            shadowRadius: 6,
        }}>
            <Text style={{ fontSize: 18, marginRight: 14, marginTop: 1 }}>{cfg.icon}</Text>
            <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, fontWeight: '900', color: C.navy, marginBottom: 3 }}>
                    {title}
                </Text>
                <Text style={{ fontSize: 12, fontWeight: '500', color: C.muted2, lineHeight: 18 }}>
                    {message}
                </Text>
            </View>
        </View>
    );
};

/** Category bar row */
const CategoryBar = ({
                         name, amount, percentage, color, rank,
                     }: {
    name: string; amount: number; percentage: number; color: string; rank: number;
}) => (
    <View style={{ marginBottom: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <View style={{
                width: 24, height: 24, borderRadius: 8,
                backgroundColor: color + '22',
                alignItems: 'center', justifyContent: 'center',
                marginRight: 10,
            }}>
                <Text style={{ fontSize: 10, fontWeight: '900', color }}>{rank}</Text>
            </View>
            <Text style={{ flex: 1, fontSize: 13, fontWeight: '800', color: C.navy }}>{name}</Text>
            <Text style={{ fontSize: 13, fontWeight: '900', color: C.navy }}>
                MYR {amount.toFixed(2)}
            </Text>
        </View>
        {/* Bar track */}
        <View style={{
            height: 8, backgroundColor: '#f1f5f9',
            borderRadius: 99, overflow: 'hidden',
        }}>
            <View style={{
                height: '100%', width: `${Math.max(percentage, 3)}%`,
                backgroundColor: color,
                borderRadius: 99,
            }} />
        </View>
        <Text style={{ fontSize: 10, fontWeight: '700', color: C.muted, marginTop: 4 }}>
            {percentage.toFixed(0)}% of active spend
        </Text>
    </View>
);

/** Spotlight card for highest subscription */
const SpotlightCard = ({ sub }: { sub: any }) => (
    <View style={{
        backgroundColor: C.navy,
        borderRadius: 28,
        padding: 22,
        marginBottom: 10,
        shadowColor: C.navy,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3, shadowRadius: 20,
        overflow: 'hidden',
    }}>
        {/* decorative blob */}
        <View style={{
            position: 'absolute', top: -30, right: -30,
            width: 120, height: 120, borderRadius: 60,
            backgroundColor: C.coral, opacity: 0.12,
        }} />
        <Text style={{ fontSize: 9, fontWeight: '900', color: C.muted,
            textTransform: 'uppercase', letterSpacing: 2.5, marginBottom: 14 }}>
            💸  Biggest Expense
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{
                width: 52, height: 52, borderRadius: 16,
                backgroundColor: sub.color || C.coral,
                alignItems: 'center', justifyContent: 'center',
                marginRight: 16,
                shadowColor: sub.color,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.4, shadowRadius: 8,
            }}>
                <Image source={sub.icon} style={{ width: 28, height: 28 }} resizeMode="contain" />
            </View>
            <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 9, fontWeight: '800', color: '#475569',
                    textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 3 }}>
                    {sub.category || 'General'}
                </Text>
                <Text style={{ fontSize: 17, fontWeight: '900', color: C.white }}>
                    {sub.name}
                </Text>
                <Text style={{ fontSize: 11, fontWeight: '600', color: '#64748b', marginTop: 2 }}>
                    {sub.plan || 'Standard plan'}
                </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 22, fontWeight: '900', color: C.coral }}>
                    {sub.price.toFixed(2)}
                </Text>
                <Text style={{ fontSize: 9, fontWeight: '700', color: '#475569',
                    textTransform: 'uppercase' }}>
                    MYR / mo
                </Text>
                <Text style={{ fontSize: 9, fontWeight: '700', color: '#334155', marginTop: 4 }}>
                    ≈ {(sub.price * 12).toFixed(0)} / yr
                </Text>
            </View>
        </View>
    </View>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const Insights = () => {
    const { subscriptions, balance, isLoading } = useSubscriptions();
    const [billingView, setBillingView] = useState<'monthly' | 'yearly'>('monthly');

    if (isLoading) {
        return (
            <View style={{ flex: 1, backgroundColor: C.bg, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: C.muted, fontWeight: '800', letterSpacing: 2,
                    textTransform: 'uppercase', fontSize: 12 }}>Loading…</Text>
            </View>
        );
    }

    // ── Calculations ──────────────────────────────────────────────────────────
    const active    = subscriptions.filter((s: any) => s.status === 'active');
    const paused    = subscriptions.filter((s: any) => s.status === 'paused');
    const cancelled = subscriptions.filter((s: any) => s.status === 'cancelled');

    const totalMonthly  = active.reduce((acc: number, s: any) => acc + s.price, 0);
    const totalYearly   = totalMonthly * 12;
    const displayAmount = billingView === 'monthly' ? totalMonthly : totalYearly;
    const avgSpend      = active.length ? totalMonthly / active.length : 0;
    const pausedSavings = paused.reduce((acc: number, s: any) => acc + s.price, 0);

    const highest = [...active].sort((a: any, b: any) => b.price - a.price)[0];
    const cheapest = [...active].sort((a: any, b: any) => a.price - b.price)[0];

    const health = getHealthScore(totalMonthly, active.length);

    // Category breakdown
    const catMap: Record<string, number> = {};
    active.forEach((s: any) => {
        const c = s.category || 'General';
        catMap[c] = (catMap[c] || 0) + s.price;
    });
    const sortedCats = Object.entries(catMap)
        .map(([name, amount]) => ({ name, amount: amount as number }))
        .sort((a, b) => b.amount - a.amount);

    // Alerts
    const alerts: Array<{ type: 'warning' | 'info' | 'success'; title: string; message: string }> = [];

    if (active.length === 0) {
        alerts.push({ type: 'success', title: 'No Active Subscriptions',
            message: 'Add subscriptions to start tracking your spending habits.' });
    } else if (totalMonthly > 300) {
        alerts.push({ type: 'warning', title: 'High Monthly Spend',
            message: `At MYR ${totalMonthly.toFixed(2)}/mo you're spending MYR ${totalYearly.toFixed(2)} a year. Review unused services.` });
    } else if (totalMonthly > 150) {
        alerts.push({ type: 'info', title: 'Moderate Spend Detected',
            message: `MYR ${totalMonthly.toFixed(2)}/mo is manageable, but there may be room to optimise.` });
    } else {
        alerts.push({ type: 'success', title: 'Spending Looks Healthy',
            message: `MYR ${totalMonthly.toFixed(2)}/mo across ${active.length} subscriptions — well within a reasonable range.` });
    }

    if (active.length > 8) {
        alerts.push({ type: 'warning', title: 'Subscription Overload',
            message: `${active.length} active services is a lot to track. Consider consolidating overlapping ones.` });
    }

    if (paused.length > 0) {
        alerts.push({ type: 'info', title: `${paused.length} Paused Service${paused.length > 1 ? 's' : ''}`,
            message: `You're saving MYR ${pausedSavings.toFixed(2)}/mo while paused. Resume or cancel them to keep things tidy.` });
    }

    if (highest && highest.price > totalMonthly * 0.5 && active.length > 1) {
        alerts.push({ type: 'info', title: 'One Subscription Dominates',
            message: `${highest.name} makes up over 50% of your monthly spend. Is it worth it?` });
    }

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
            <ScrollView
                contentContainerStyle={{ paddingBottom: 120, paddingHorizontal: 20, paddingTop: 16 }}
                showsVerticalScrollIndicator={false}
            >
                {/* ── Header ─────────────────────────────────────────────── */}
                <View style={{ marginBottom: 24 }}>
                    <Text style={{ fontSize: 30, fontWeight: '900', color: C.navy, letterSpacing: -0.5 }}>
                        Insights
                    </Text>
                    <Text style={{ fontSize: 11, fontWeight: '700', color: C.muted,
                        letterSpacing: 2, textTransform: 'uppercase', marginTop: 2 }}>
                        Smart spending analysis
                    </Text>
                </View>

                {/* ── Hero Card ──────────────────────────────────────────── */}
                <View style={{
                    backgroundColor: C.navy,
                    borderRadius: 32,
                    padding: 28,
                    marginBottom: 16,
                    shadowColor: C.navy,
                    shadowOffset: { width: 0, height: 12 },
                    shadowOpacity: 0.35, shadowRadius: 24,
                    elevation: 10, overflow: 'hidden',
                }}>
                    {/* Decorative blobs */}
                    <View style={{ position: 'absolute', top: -50, right: -50,
                        width: 180, height: 180, borderRadius: 90,
                        backgroundColor: C.coral, opacity: 0.12 }} />
                    <View style={{ position: 'absolute', bottom: -30, left: -20,
                        width: 110, height: 110, borderRadius: 55,
                        backgroundColor: '#3b82f6', opacity: 0.1 }} />

                    {/* Billing toggle */}
                    <View style={{ flexDirection: 'row', alignItems: 'center',
                        justifyContent: 'space-between', marginBottom: 20 }}>
                        <Text style={{ fontSize: 10, fontWeight: '800', color: C.muted,
                            letterSpacing: 2.5, textTransform: 'uppercase' }}>Total Spend</Text>
                        <View style={{ flexDirection: 'row', backgroundColor: '#0f1f3d',
                            borderRadius: 20, padding: 3, gap: 2 }}>
                            {(['monthly', 'yearly'] as const).map(v => (
                                <Pressable
                                    key={v}
                                    onPress={() => setBillingView(v)}
                                    style={{
                                        paddingHorizontal: 14, paddingVertical: 6,
                                        borderRadius: 16,
                                        backgroundColor: billingView === v ? C.coral : 'transparent',
                                    }}
                                >
                                    <Text style={{ fontSize: 10, fontWeight: '900',
                                        color: billingView === v ? '#fff' : '#475569',
                                        textTransform: 'uppercase', letterSpacing: 1 }}>{v}</Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>

                    {/* Amount */}
                    <Text style={{ fontSize: 50, fontWeight: '900', color: '#fff',
                        letterSpacing: -1.5, marginBottom: 4 }}>
                        {displayAmount.toFixed(2)}
                    </Text>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: '#475569', marginBottom: 24 }}>
                        MYR / {billingView === 'monthly' ? 'month' : 'year'}
                        {'  ·  '}{active.length} active subscriptions
                    </Text>

                    <View style={{ height: 1, backgroundColor: '#1e293b', marginBottom: 20 }} />

                    {/* Stats row */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        {[
                            { label: 'Avg / Sub',  value: `${avgSpend.toFixed(0)}`,  accent: '#94a3b8', unit: 'MYR' },
                            { label: 'Paused',     value: `${paused.length}`,         accent: '#f59e0b', unit: 'subs' },
                            { label: 'Cancelled',  value: `${cancelled.length}`,      accent: '#ef4444', unit: 'subs' },
                        ].map(({ label, value, accent, unit }) => (
                            <View key={label} style={{ alignItems: 'center', flex: 1 }}>
                                <Text style={{ color: accent, fontSize: 22, fontWeight: '900' }}>{value}</Text>
                                <Text style={{ color: '#334155', fontSize: 9, fontWeight: '700',
                                    textTransform: 'uppercase', letterSpacing: 0.5 }}>{unit}</Text>
                                <Text style={{ color: '#475569', fontSize: 9, fontWeight: '700',
                                    textTransform: 'uppercase', letterSpacing: 1.5, marginTop: 1 }}>{label}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* ── Health Score + Quick Metrics row ──────────────────── */}
                <View style={{ flexDirection: 'row', gap: 12, marginBottom: 28 }}>
                    {/* Health Score */}
                    <View style={{
                        backgroundColor: C.card, borderRadius: 28,
                        padding: 20, borderWidth: 1, borderColor: C.border,
                        alignItems: 'center', justifyContent: 'center',
                        flex: 1.1,
                        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.05, shadowRadius: 8,
                    }}>
                        <Text style={{ fontSize: 9, fontWeight: '900', color: C.muted,
                            textTransform: 'uppercase', letterSpacing: 2,
                            marginBottom: 14, textAlign: 'center' }}>Health Score</Text>
                        <HealthRing {...health} />
                        <View style={{
                            marginTop: 14, backgroundColor: health.bg,
                            paddingHorizontal: 12, paddingVertical: 5,
                            borderRadius: 20,
                        }}>
                            <Text style={{ fontSize: 10, fontWeight: '900',
                                color: health.color, textTransform: 'uppercase',
                                letterSpacing: 1 }}>{health.label}</Text>
                        </View>
                    </View>

                    {/* Quick metrics stacked */}
                    <View style={{ flex: 1, gap: 10 }}>
                        <MetricTile
                            label="Highest"
                            value={highest ? `${highest.price.toFixed(0)}` : '—'}
                            sub={highest ? `MYR / mo` : undefined}
                            accent={C.coral}
                        />
                        <MetricTile
                            label="Lowest"
                            value={cheapest ? `${cheapest.price.toFixed(0)}` : '—'}
                            sub={cheapest ? `MYR / mo` : undefined}
                            accent='#10b981'
                        />
                    </View>
                </View>

                {/* ── Biggest Expense Spotlight ─────────────────────────── */}
                {highest && (
                    <View style={{ marginBottom: 28 }}>
                        <SectionLabel text="Spotlight" />
                        <SpotlightCard sub={highest} />
                    </View>
                )}

                {/* ── Smart Alerts ──────────────────────────────────────── */}
                <View style={{ marginBottom: 28 }}>
                    <SectionLabel text={`Smart Alerts  •  ${alerts.length}`} />
                    {alerts.map((a, i) => (
                        <AlertCard key={i} {...a} />
                    ))}
                </View>

                {/* ── Category Breakdown ────────────────────────────────── */}
                {sortedCats.length > 0 && (
                    <View style={{ marginBottom: 28 }}>
                        <SectionLabel text="Spend by Category" />
                        <View style={{
                            backgroundColor: C.card,
                            borderRadius: 32,
                            padding: 24,
                            borderWidth: 1,
                            borderColor: C.border,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.04, shadowRadius: 8,
                        }}>
                            {sortedCats.map((cat, i) => (
                                <CategoryBar
                                    key={cat.name}
                                    name={cat.name}
                                    amount={cat.amount}
                                    percentage={totalMonthly ? (cat.amount / totalMonthly) * 100 : 0}
                                    color={BAR_COLORS[i % BAR_COLORS.length]}
                                    rank={i + 1}
                                />
                            ))}
                        </View>
                    </View>
                )}

                {/* ── Paused Savings Banner ─────────────────────────────── */}
                {pausedSavings > 0 && (
                    <View style={{
                        flexDirection: 'row',
                        backgroundColor: '#fffbeb',
                        borderRadius: 24,
                        padding: 20,
                        borderWidth: 1,
                        borderColor: '#fcd34d',
                        alignItems: 'center',
                        gap: 16,
                        marginBottom: 28,
                    }}>
                        <Text style={{ fontSize: 32 }}>⏸</Text>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 13, fontWeight: '900', color: C.navy }}>
                                Saving MYR {pausedSavings.toFixed(2)}/mo
                            </Text>
                            <Text style={{ fontSize: 11, fontWeight: '500', color: C.muted2,
                                marginTop: 3, lineHeight: 16 }}>
                                From {paused.length} paused subscription{paused.length !== 1 ? 's' : ''}.
                                That's MYR {(pausedSavings * 12).toFixed(2)} a year.
                            </Text>
                        </View>
                    </View>
                )}

                {/* ── Annual Projection Card ────────────────────────────── */}
                <View style={{ marginBottom: 8 }}>
                    <SectionLabel text="Annual Projection" />
                    <View style={{
                        backgroundColor: C.card,
                        borderRadius: 28, padding: 22,
                        borderWidth: 1, borderColor: C.border,
                        flexDirection: 'row', alignItems: 'center',
                    }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 11, fontWeight: '700', color: C.muted,
                                marginBottom: 6 }}>At current active spend</Text>
                            <Text style={{ fontSize: 32, fontWeight: '900', color: C.navy,
                                letterSpacing: -0.5 }}>
                                MYR {totalYearly.toFixed(2)}
                            </Text>
                            <Text style={{ fontSize: 11, fontWeight: '600', color: C.muted2,
                                marginTop: 4 }}>per year across {active.length} services</Text>
                        </View>
                        <View style={{
                            backgroundColor: C.coral + '15',
                            borderRadius: 20, padding: 14,
                        }}>
                            <Text style={{ fontSize: 28 }}>📅</Text>
                        </View>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

export default Insights;