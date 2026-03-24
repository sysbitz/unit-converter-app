import React, { useState, useCallback } from "react";
import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	StyleSheet,
	TextInput,
	FlatList,
	Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import {
	UNIT_CATEGORIES,
	UnitCategory,
	Unit,
	convert,
	formatResult,
	toBengaliDigits,
} from "@/constants/units";
import { useHistory } from "@/hooks/useHistory";
import { useAuth } from "@/context/AuthContext";

export default function ConverterScreen() {
	const { colors, isDark } = useTheme();
	const { user } = useAuth();
	const { saveConversion } = useHistory();
	const [selectedCategory, setSelectedCategory] = useState<UnitCategory>(
		UNIT_CATEGORIES[0],
	);
	const [fromUnit, setFromUnit] = useState<Unit>(UNIT_CATEGORIES[0].units[0]);
	const [toUnit, setToUnit] = useState<Unit>(UNIT_CATEGORIES[0].units[1]);
	const [inputValue, setInputValue] = useState("");
	const [selectingFor, setSelectingFor] = useState<"from" | "to" | null>(null);

	const styles = makeStyles(colors, isDark);

	const result = inputValue
		? convert(parseFloat(inputValue), fromUnit, toUnit)
		: null;

	function selectCategory(cat: UnitCategory) {
		setSelectedCategory(cat);
		setFromUnit(cat.units[0]);
		setToUnit(cat.units[1]);
		setInputValue("");
		setSelectingFor(null);
	}

	function handleSwap() {
		const tmp = fromUnit;
		setFromUnit(toUnit);
		setToUnit(tmp);
	}

	function handleSelectUnit(unit: Unit) {
		if (selectingFor === "from") setFromUnit(unit);
		else setToUnit(unit);
		setSelectingFor(null);
	}

	const handleConvert = useCallback(() => {
		if (!inputValue || result === null || !user) return;
		saveConversion({
			category_id: selectedCategory.id,
			category_name: selectedCategory.namebn,
			from_unit: fromUnit.id,
			from_unit_name: fromUnit.namebn,
			to_unit: toUnit.id,
			to_unit_name: toUnit.namebn,
			input_value: parseFloat(inputValue),
			output_value: result,
		});
	}, [inputValue, result, selectedCategory, fromUnit, toUnit, user]);

	if (selectingFor) {
		return (
			<View style={styles.container}>
				<View style={styles.header}>
					<TouchableOpacity
						onPress={() => setSelectingFor(null)}
						style={styles.backBtn}>
						<Feather name="arrow-left" size={22} color={colors.text} />
					</TouchableOpacity>
					<Text style={styles.headerTitle}>
						{selectingFor === "from"
							? "থেকে একক বেছে নিন"
							: "যে এককে রূপান্তর করবেন"}
					</Text>
				</View>
				<FlatList
					data={selectedCategory.units}
					keyExtractor={(u) => u.id}
					contentContainerStyle={{ padding: 16 }}
					renderItem={({ item }) => (
						<TouchableOpacity
							style={[
								styles.unitOption,
								(selectingFor === "from" ? fromUnit : toUnit).id === item.id &&
									styles.unitOptionSelected,
							]}
							onPress={() => handleSelectUnit(item)}>
							<Text style={styles.unitOptionSymbol}>{item.symbol}</Text>
							<Text style={styles.unitOptionName}>{item.namebn}</Text>
							{(selectingFor === "from" ? fromUnit : toUnit).id === item.id && (
								<Feather
									name="check"
									size={18}
									color={colors.primary}
									style={{ marginLeft: "auto" }}
								/>
							)}
						</TouchableOpacity>
					)}
				/>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			{/* Category badge shown below header */}
			<View style={styles.categoryBadgeRow}>
				<View
					style={[
						styles.categoryBadge,
						{ backgroundColor: selectedCategory.color + "20" },
					]}>
					<Text
						style={[
							styles.categoryBadgeText,
							{ color: selectedCategory.color },
						]}>
						{selectedCategory.namebn} ({selectedCategory.nameen})
					</Text>
				</View>
			</View>

			<ScrollView showsVerticalScrollIndicator={false}>
				{/* Category Selector */}
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={styles.categoryRow}>
					{UNIT_CATEGORIES.map((cat) => (
						<TouchableOpacity
							key={cat.id}
							style={[
								styles.categoryChip,
								selectedCategory.id === cat.id && {
									backgroundColor: cat.color,
									borderColor: cat.color,
								},
							]}
							onPress={() => selectCategory(cat)}>
							<Text
								style={[
									styles.categoryChipText,
									selectedCategory.id === cat.id && { color: "#fff" },
								]}>
								{cat.namebn} ({cat.nameen})
							</Text>
						</TouchableOpacity>
					))}
				</ScrollView>

				{/* Converter Card */}
				<View style={styles.card}>
					{/* From unit */}
					<View style={styles.unitBlock}>
						<TouchableOpacity
							style={styles.unitSelector}
							onPress={() => setSelectingFor("from")}>
							<View>
								<Text style={styles.unitSelectorLabel}>থেকে</Text>
								<Text style={styles.unitSelectorValue}>{fromUnit.namebn}</Text>
							</View>
							<View style={styles.symbolBadge}>
								<Text style={styles.symbolText}>{fromUnit.symbol}</Text>
							</View>
							<Feather
								name="chevron-down"
								size={16}
								color={colors.textSecondary}
							/>
						</TouchableOpacity>

						<TextInput
							style={styles.valueInput}
							value={inputValue}
							onChangeText={(t) => {
								setInputValue(t);
							}}
							onEndEditing={handleConvert}
							placeholder="মান লিখুন..."
							placeholderTextColor={colors.textTertiary}
							keyboardType="numeric"
						/>
					</View>

					{/* Swap Button */}
					<View style={styles.swapRow}>
						<View style={styles.divider} />
						<TouchableOpacity
							style={[
								styles.swapBtn,
								{ backgroundColor: selectedCategory.color },
							]}
							onPress={handleSwap}>
							<Feather name="repeat" size={18} color="#fff" />
						</TouchableOpacity>
						<View style={styles.divider} />
					</View>

					{/* To unit */}
					<View style={styles.unitBlock}>
						<TouchableOpacity
							style={styles.unitSelector}
							onPress={() => setSelectingFor("to")}>
							<View>
								<Text style={styles.unitSelectorLabel}>যেটিতে</Text>
								<Text style={styles.unitSelectorValue}>{toUnit.namebn}</Text>
							</View>
							<View
								style={[
									styles.symbolBadge,
									{ backgroundColor: selectedCategory.color + "20" },
								]}>
								<Text
									style={[
										styles.symbolText,
										{ color: selectedCategory.color },
									]}>
									{toUnit.symbol}
								</Text>
							</View>
							<Feather
								name="chevron-down"
								size={16}
								color={colors.textSecondary}
							/>
						</TouchableOpacity>

						<View style={styles.resultBox}>
							<Text
								style={[styles.resultText, { color: selectedCategory.color }]}>
								{result !== null ? toBengaliDigits(formatResult(result)) : "—"}
							</Text>
						</View>
					</View>
				</View>

				{/* Formula hint */}
				{result !== null && inputValue && (
					<View style={styles.formulaCard}>
						<Feather name="info" size={14} color={colors.textSecondary} />
						<Text style={styles.formulaText}>
							{toBengaliDigits(inputValue)} {fromUnit.symbol} ={" "}
							{toBengaliDigits(formatResult(result))} {toUnit.symbol}
						</Text>
					</View>
				)}

				{/* All units preview */}
				<Text style={styles.sectionTitle}>সকল রূপান্তর</Text>
				{inputValue ? (
					<View style={styles.allUnitsCard}>
						{selectedCategory.units.map((unit) => (
							<View key={unit.id} style={styles.allUnitRow}>
								<Text style={styles.allUnitName}>{unit.namebn}</Text>
								<Text
									style={[
										styles.allUnitValue,
										{ color: selectedCategory.color },
									]}>
									{toBengaliDigits(
										formatResult(
											convert(parseFloat(inputValue), fromUnit, unit),
										),
									)}{" "}
									{unit.symbol}
								</Text>
							</View>
						))}
					</View>
				) : (
					<View style={styles.emptyHint}>
						<Text style={styles.emptyHintText}>
							উপরে একটি মান লিখুন সকল রূপান্তর দেখতে
						</Text>
					</View>
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
			flexDirection: "row",
			alignItems: "center",
			paddingHorizontal: 20,
			paddingTop: 12,
			paddingBottom: 12,
			backgroundColor: colors.surface,
			borderBottomWidth: 1,
			borderBottomColor: colors.border,
		},
		categoryBadgeRow: {
			flexDirection: "row",
			paddingHorizontal: 16,
			paddingTop: 12,
			paddingBottom: 4,
		},
		selectorHeader: {
			flexDirection: "row",
			alignItems: "center",
			paddingHorizontal: 16,
			paddingVertical: 14,
			backgroundColor: colors.surface,
			borderBottomWidth: 1,
			borderBottomColor: colors.border,
		},
		backBtn: { padding: 4, marginRight: 12 },
		headerTitle: {
			fontFamily: "Hind-Siliguri-Bold",
			fontSize: 20,
			color: colors.text,
			flex: 1,
		},
		categoryBadge: {
			paddingHorizontal: 10,
			paddingVertical: 4,
			borderRadius: 20,
		},
		categoryBadgeText: { fontFamily: "Hind-Siliguri-SemiBold", fontSize: 13 },
		categoryRow: { paddingHorizontal: 16, paddingVertical: 14, gap: 8 },
		categoryChip: {
			paddingHorizontal: 14,
			paddingVertical: 8,
			borderRadius: 20,
			borderWidth: 1.5,
			borderColor: colors.border,
			backgroundColor: colors.surface,
		},
		categoryChipText: {
			fontFamily: "Hind-Siliguri-Medium",
			fontSize: 13,
			color: colors.textSecondary,
		},
		card: {
			marginHorizontal: 16,
			backgroundColor: colors.surface,
			borderRadius: 20,
			padding: 16,
			shadowColor: colors.shadow,
			shadowOffset: { width: 0, height: 4 },
			shadowOpacity: 1,
			shadowRadius: 12,
			elevation: 4,
		},
		unitBlock: { gap: 8 },
		unitSelector: {
			flexDirection: "row",
			alignItems: "center",
			gap: 10,
			paddingBottom: 8,
		},
		unitSelectorLabel: {
			fontFamily: "Hind-Siliguri-Regular",
			fontSize: 12,
			color: colors.textTertiary,
		},
		unitSelectorValue: {
			fontFamily: "Hind-Siliguri-SemiBold",
			fontSize: 16,
			color: colors.text,
		},
		symbolBadge: {
			paddingHorizontal: 10,
			paddingVertical: 4,
			borderRadius: 8,
			backgroundColor: colors.primaryLight,
			marginLeft: "auto",
		},
		symbolText: {
			fontFamily: "Hind-Siliguri-Medium",
			fontSize: 13,
			color: colors.primary,
		},
		valueInput: {
			backgroundColor: colors.surfaceSecondary,
			borderRadius: 12,
			paddingHorizontal: 16,
			paddingVertical: 14,
			fontFamily: "Hind-Siliguri-Regular",
			fontSize: 24,
			color: colors.text,
			borderWidth: 1.5,
			borderColor: colors.border,
		},
		swapRow: {
			flexDirection: "row",
			alignItems: "center",
			paddingVertical: 12,
			gap: 12,
		},
		divider: { flex: 1, height: 1, backgroundColor: colors.border },
		swapBtn: {
			width: 40,
			height: 40,
			borderRadius: 20,
			justifyContent: "center",
			alignItems: "center",
			shadowColor: "#000",
			shadowOffset: { width: 0, height: 2 },
			shadowOpacity: 0.2,
			shadowRadius: 4,
			elevation: 3,
		},
		resultBox: {
			backgroundColor: colors.surfaceSecondary,
			borderRadius: 12,
			paddingHorizontal: 16,
			paddingVertical: 14,
			borderWidth: 1.5,
			borderColor: colors.border,
			minHeight: 56,
			justifyContent: "center",
		},
		resultText: { fontFamily: "Hind-Siliguri-Bold", fontSize: 24 },
		formulaCard: {
			flexDirection: "row",
			alignItems: "center",
			gap: 8,
			marginHorizontal: 16,
			marginTop: 12,
			backgroundColor: colors.surface,
			borderRadius: 12,
			padding: 12,
		},
		formulaText: {
			fontFamily: "Hind-Siliguri-Regular",
			fontSize: 14,
			color: colors.textSecondary,
		},
		sectionTitle: {
			fontFamily: "Hind-Siliguri-SemiBold",
			fontSize: 16,
			color: colors.text,
			marginHorizontal: 16,
			marginTop: 20,
			marginBottom: 10,
		},
		allUnitsCard: {
			marginHorizontal: 16,
			backgroundColor: colors.surface,
			borderRadius: 16,
			overflow: "hidden",
		},
		allUnitRow: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			paddingHorizontal: 16,
			paddingVertical: 14,
			borderBottomWidth: 1,
			borderBottomColor: colors.border,
		},
		allUnitName: {
			fontFamily: "Hind-Siliguri-Regular",
			fontSize: 14,
			color: colors.textSecondary,
		},
		allUnitValue: { fontFamily: "Hind-Siliguri-SemiBold", fontSize: 14 },
		emptyHint: {
			marginHorizontal: 16,
			backgroundColor: colors.surface,
			borderRadius: 16,
			padding: 24,
			alignItems: "center",
		},
		emptyHintText: {
			fontFamily: "Hind-Siliguri-Regular",
			fontSize: 14,
			color: colors.textTertiary,
		},
		unitOption: {
			flexDirection: "row",
			alignItems: "center",
			gap: 12,
			backgroundColor: colors.surface,
			borderRadius: 12,
			padding: 16,
			marginBottom: 8,
			borderWidth: 1.5,
			borderColor: colors.border,
		},
		unitOptionSelected: {
			borderColor: colors.primary,
			backgroundColor: colors.primaryLight,
		},
		unitOptionSymbol: {
			fontFamily: "Hind-Siliguri-Bold",
			fontSize: 16,
			color: colors.primary,
			width: 48,
		},
		unitOptionName: {
			fontFamily: "Hind-Siliguri-Medium",
			fontSize: 15,
			color: colors.text,
			flex: 1,
		},
	});
