import React, { useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	ScrollView,
	Alert,
	ActivityIndicator,
	Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/context/AuthContext";
import { useHistory } from "@/hooks/useHistory";

export default function ProfileScreen() {
	const { colors, isDark } = useTheme();
	const { profile, user, signOut, updateProfile } = useAuth();
	const { history } = useHistory();
	const [editing, setEditing] = useState(false);
	const [name, setName] = useState(profile?.name ?? "");
	const [saving, setSaving] = useState(false);
	const styles = makeStyles(colors, isDark);

	const isLoggedIn = !!user;

	async function handleSave() {
		setSaving(true);
		try {
			await updateProfile({ name });
			setEditing(false);
		} catch (e: any) {
			Alert.alert("ত্রুটি", e.message);
		} finally {
			setSaving(false);
		}
	}

	function handleSignOut() {
		Alert.alert("সাইন আউট", "আপনি কি সাইন আউট করতে চান?", [
			{ text: "বাতিল", style: "cancel" },
			{ text: "সাইন আউট", style: "destructive", onPress: signOut },
		]);
	}

	const initial = profile?.name
		? profile.name[0]
		: (profile?.mobile?.[2] ?? "?");

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.headerTitle}>প্রোফাইল</Text>
			</View>

			<ScrollView showsVerticalScrollIndicator={false}>
				{/* Avatar */}
				<View style={styles.avatarSection}>
					<View
						style={[
							styles.avatar,
							!isLoggedIn && { backgroundColor: colors.surfaceSecondary },
						]}>
						<Text
							style={[
								styles.avatarText,
								!isLoggedIn && { color: colors.textTertiary },
							]}>
							{isLoggedIn ? initial.toUpperCase() : "?"}
						</Text>
					</View>
					{isLoggedIn ? (
						<>
							<Text style={styles.mobileText}>+৮৮{profile?.mobile}</Text>
							<Text style={styles.memberText}>BDApps সদস্য</Text>
						</>
					) : (
						<>
							<Text style={styles.guestTitle}>অতিথি ব্যবহারকারী</Text>
							<Text style={styles.memberText}>
								লগইন করলে ইতিহাস সংরক্ষণ হবে
							</Text>
						</>
					)}
				</View>

				{/* Login CTA */}
				{!isLoggedIn && (
					<TouchableOpacity
						style={styles.loginBtn}
						onPress={() => router.push("/(auth)/login")}
						activeOpacity={0.85}>
						<Feather name="log-in" size={18} color="#fff" />
						<Text style={styles.loginBtnText}>লগইন / রেজিস্ট্রেশন করুন</Text>
					</TouchableOpacity>
				)}

				{/* Stats */}
				<View style={styles.statsRow}>
					<View style={styles.statCard}>
						<Text style={styles.statValue}>{history.length}</Text>
						<Text style={styles.statLabel}>মোট রূপান্তর</Text>
					</View>
					<View style={styles.statCard}>
						<Text style={styles.statValue}>
							{new Set(history.map((h: any) => h.category_id)).size}
						</Text>
						<Text style={styles.statLabel}>ব্যবহৃত একক</Text>
					</View>
				</View>

				{/* Profile fields — only when logged in */}
				{isLoggedIn && (
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>ব্যক্তিগত তথ্য</Text>
						<View style={styles.fieldCard}>
							<Text style={styles.fieldLabel}>নাম</Text>
							{editing ? (
								<TextInput
									style={styles.fieldInput}
									value={name}
									onChangeText={setName}
									placeholder="আপনার নাম লিখুন"
									placeholderTextColor={colors.textTertiary}
									autoFocus
								/>
							) : (
								<View style={styles.fieldValue}>
									<Text style={styles.fieldValueText}>
										{profile?.name || "নাম যোগ করুন"}
									</Text>
									<TouchableOpacity
										onPress={() => {
											setName(profile?.name ?? "");
											setEditing(true);
										}}>
										<Feather name="edit-2" size={16} color={colors.primary} />
									</TouchableOpacity>
								</View>
							)}
						</View>

						{editing && (
							<View style={styles.editActions}>
								<TouchableOpacity
									style={styles.cancelBtn}
									onPress={() => setEditing(false)}>
									<Text style={styles.cancelBtnText}>বাতিল</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={styles.saveBtn}
									onPress={handleSave}
									disabled={saving}>
									{saving ? (
										<ActivityIndicator size="small" color="#fff" />
									) : (
										<Text style={styles.saveBtnText}>সংরক্ষণ</Text>
									)}
								</TouchableOpacity>
							</View>
						)}
					</View>
				)}

				{/* Sign out — only when logged in */}
				{isLoggedIn && (
					<TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
						<Feather name="log-out" size={18} color={colors.error} />
						<Text style={styles.signOutText}>সাইন আউট</Text>
					</TouchableOpacity>
				)}

				<View style={{ height: 40 }} />
			</ScrollView>
		</View>
	);
}

const makeStyles = (colors: any, isDark: boolean) =>
	StyleSheet.create({
		container: { flex: 1, backgroundColor: colors.background },
		header: {
			paddingHorizontal: 20,
			paddingTop: Platform.OS === "ios" ? 60 : 40,
			paddingBottom: 16,
			backgroundColor: colors.surface,
			borderBottomWidth: 1,
			borderBottomColor: colors.border,
		},
		headerTitle: {
			fontFamily: "Hind-Siliguri-Bold",
			fontSize: 20,
			color: colors.text,
		},
		avatarSection: { alignItems: "center", paddingVertical: 32 },
		avatar: {
			width: 88,
			height: 88,
			borderRadius: 44,
			backgroundColor: colors.primary,
			justifyContent: "center",
			alignItems: "center",
			marginBottom: 12,
			shadowColor: colors.primary,
			shadowOffset: { width: 0, height: 6 },
			shadowOpacity: 0.35,
			shadowRadius: 12,
			elevation: 6,
		},
		avatarText: {
			fontFamily: "Hind-Siliguri-Bold",
			fontSize: 32,
			color: "#fff",
		},
		mobileText: {
			fontFamily: "Hind-Siliguri-SemiBold",
			fontSize: 18,
			color: colors.text,
			marginBottom: 4,
		},
		guestTitle: {
			fontFamily: "Hind-Siliguri-SemiBold",
			fontSize: 18,
			color: colors.text,
			marginBottom: 4,
		},
		memberText: {
			fontFamily: "Hind-Siliguri-Regular",
			fontSize: 13,
			color: colors.textSecondary,
		},
		loginBtn: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "center",
			gap: 10,
			marginHorizontal: 16,
			marginBottom: 20,
			backgroundColor: colors.primary,
			borderRadius: 14,
			paddingVertical: 15,
			shadowColor: colors.primary,
			shadowOffset: { width: 0, height: 4 },
			shadowOpacity: 0.3,
			shadowRadius: 8,
			elevation: 4,
		},
		loginBtnText: {
			fontFamily: "Hind-Siliguri-Bold",
			fontSize: 16,
			color: "#fff",
		},
		statsRow: {
			flexDirection: "row",
			gap: 12,
			marginHorizontal: 16,
			marginBottom: 20,
		},
		statCard: {
			flex: 1,
			backgroundColor: colors.surface,
			borderRadius: 14,
			padding: 16,
			alignItems: "center",
			shadowColor: colors.shadow,
			shadowOffset: { width: 0, height: 2 },
			shadowOpacity: 1,
			shadowRadius: 8,
			elevation: 2,
		},
		statValue: {
			fontFamily: "Hind-Siliguri-Bold",
			fontSize: 28,
			color: colors.primary,
		},
		statLabel: {
			fontFamily: "Hind-Siliguri-Regular",
			fontSize: 13,
			color: colors.textSecondary,
			marginTop: 4,
		},
		section: { marginHorizontal: 16, marginBottom: 16 },
		sectionTitle: {
			fontFamily: "Hind-Siliguri-SemiBold",
			fontSize: 14,
			color: colors.textSecondary,
			marginBottom: 10,
		},
		fieldCard: {
			backgroundColor: colors.surface,
			borderRadius: 14,
			padding: 16,
			gap: 8,
			borderWidth: 1,
			borderColor: colors.border,
		},
		fieldLabel: {
			fontFamily: "Hind-Siliguri-Regular",
			fontSize: 12,
			color: colors.textTertiary,
		},
		fieldValue: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
		},
		fieldValueText: {
			fontFamily: "Hind-Siliguri-Medium",
			fontSize: 16,
			color: colors.text,
		},
		fieldInput: {
			fontFamily: "Hind-Siliguri-Regular",
			fontSize: 16,
			color: colors.text,
			borderBottomWidth: 1.5,
			borderBottomColor: colors.primary,
			paddingVertical: 4,
		},
		editActions: { flexDirection: "row", gap: 10, marginTop: 10 },
		cancelBtn: {
			flex: 1,
			paddingVertical: 12,
			borderRadius: 10,
			borderWidth: 1.5,
			borderColor: colors.border,
			alignItems: "center",
		},
		cancelBtnText: {
			fontFamily: "Hind-Siliguri-Medium",
			fontSize: 15,
			color: colors.textSecondary,
		},
		saveBtn: {
			flex: 1,
			paddingVertical: 12,
			borderRadius: 10,
			backgroundColor: colors.primary,
			alignItems: "center",
		},
		saveBtnText: {
			fontFamily: "Hind-Siliguri-Bold",
			fontSize: 15,
			color: "#fff",
		},
		signOutBtn: {
			flexDirection: "row",
			alignItems: "center",
			gap: 10,
			marginHorizontal: 16,
			padding: 16,
			backgroundColor: colors.errorLight,
			borderRadius: 14,
		},
		signOutText: {
			fontFamily: "Hind-Siliguri-SemiBold",
			fontSize: 15,
			color: colors.error,
		},
	});
