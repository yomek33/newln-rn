/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import { format, isValid, parse, parseISO } from "date-fns";

import { type Material } from "../hooks/material_api";

interface MaterialPreviewCardProps {
  material: Material;
}

const MaterialPreviewCard: React.FC<MaterialPreviewCardProps> = ({
  material,
}) => {
  const router = useRouter();

  // Truncate content to 200 characters
  const truncateContent = (text: string | null | undefined, limit: number) => {
    if (!text) return "No content available";
    const cleanedText = text.replace(/^\s*[\r\n]/gm, "");
    return cleanedText.length > limit
      ? cleanedText.substring(0, limit) + "..."
      : cleanedText;
  };
  const getFormattedDate = (dateValue: string): string => {
    let date: Date | null = null;

    try {
      // ISO 8601 (例: "2025-02-07T15:38:18.627254Z") の場合
      if (dateValue.includes("T") && dateValue.includes("Z")) {
        date = parseISO(dateValue);
      }
      // スペース区切り形式 (例: "2025-02-07 09:43:28.15704+00") の場合
      else if (
        /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d+[+-]\d{2}$/.test(dateValue)
      ) {
        date = parse(dateValue, "yyyy-MM-dd HH:mm:ss.SSSSSSXXX", new Date());
      }

      // 無効な日付を弾く
      if (!date || !isValid(date)) {
        console.error("Invalid date format:", dateValue);
        return "N/A";
      }

      // フォーマットして返す
      return format(date, "yyyy/MM/dd");
    } catch (error) {
      console.error("Failed to parse date:", dateValue, error);
      return "N/A";
    }
  };

  // `CreatedAt` を型安全にフォーマット
  const formattedDate: string = getFormattedDate(material.CreatedAt);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/(authorized)/material/${material.ULID}`)}
    >
      <Text style={styles.title}>{truncateContent(material.Title, 26)}</Text>
      <Text style={styles.content}>
        {truncateContent(material.Content, 160)}
      </Text>

      {/* カレンダーアイコンと日付を横並びにする */}
      <View style={styles.dateContainer}>
        <FontAwesome5 name="calendar-day" size={15} color="gray" />
        <Text style={styles.dateText}>{formattedDate}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    padding: 10,
    marginVertical: 4,
    borderRadius: 8,
    shadowColor: "#000",
    shadowRadius: 5,
    elevation: 3,
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  content: {
    fontSize: 12,
    marginVertical: 4,
  },
  dateContainer: {
    flexDirection: "row", // 横並びにする
    alignItems: "center",
    marginTop: 5,
  },
  dateText: {
    fontSize: 14,
    color: "gray",
    marginLeft: 5, // アイコンとの間隔
  },
});

export default MaterialPreviewCard;
