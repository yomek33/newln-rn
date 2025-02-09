import React, { useRef } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type LayoutChangeEvent,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
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
  const [titleWidth, setTitleWidth] = React.useState<number>(0);
  const titleRef = useRef<Text>(null);
  console.log(material);
  // タイトルの幅を取得
  const handleTextLayout = (event: LayoutChangeEvent) => {
    setTitleWidth(event.nativeEvent.layout.width);
  };

  // 日付のフォーマット
  const getFormattedDate = (dateValue: string): string => {
    let date: Date | null = null;

    try {
      if (dateValue.includes("T") && dateValue.includes("Z")) {
        date = parseISO(dateValue);
      } else if (
        /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d+[+-]\d{2}$/.test(dateValue)
      ) {
        date = parse(dateValue, "yyyy-MM-dd HH:mm:ss.SSSSSSXXX", new Date());
      }

      if (!date || !isValid(date)) {
        console.error("Invalid date format:", dateValue);
        return "N/A";
      }

      return format(date, "yyyy/MM/dd");
    } catch (error) {
      console.error("Failed to parse date:", dateValue, error);
      return "N/A";
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.push(`/(authorized)/material/${material.ULID}`)}
    >
      {/* Title with Gradient */}
      <View style={styles.titleContainer}>
        <LinearGradient
          colors={["#00FFD1", "#00FFD1"]}
          style={[styles.gradientBackground, { width: titleWidth }]}
        />
        <Text
          ref={titleRef}
          style={styles.title}
          numberOfLines={1}
          ellipsizeMode="tail"
          onLayout={handleTextLayout}
        >
          {material.Title}
        </Text>
      </View>

      {/* Content */}
      <Text style={styles.content} numberOfLines={2} ellipsizeMode="tail">
        {material.Content ?? "No content available"}
      </Text>

      {/* Date & Word Count */}
      <View style={styles.footer}>
        <FontAwesome5 name="calendar-day" size={15} color="gray" />
        <Text style={styles.dateText}>
          {getFormattedDate(material.CreatedAt)}
        </Text>

        <View style={{ flex: 1 }} />

        <Text style={styles.countText}>
          {material.WordsCount} {material.WordsCount === 1 ? "word" : "words"}
        </Text>
        <Text style={styles.countText}>
          {material.PhrasesCount}{" "}
          {material.PhrasesCount === 1 ? "phrase" : "phrases"}
        </Text>
      </View>

      {/* Divider Line */}
      <View style={styles.divider} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  titleContainer: {
    position: "relative",
    alignSelf: "flex-start",
    paddingBottom: 4,
  },
  gradientBackground: {
    position: "absolute",
    height: 13,
    top: "40%",
    left: 0,
    opacity: 0.6,
    transform: [{ skewX: "-1deg" }],
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    zIndex: 1,
  },
  content: {
    fontSize: 14,
    marginVertical: 4,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  dateText: {
    fontSize: 14,
    color: "gray",
    marginLeft: 5,
  },
  countText: {
    fontSize: 14,
    color: "gray",
    marginLeft: 10,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginTop: 10,
  },
});

export default MaterialPreviewCard;
