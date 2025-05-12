import { IconSymbol } from "@/components/ui/IconSymbol";
import * as Sharing from "expo-sharing";
import { useRef } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { captureRef } from "react-native-view-shot";

import { Column, Table } from "@/components/Table";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useBottomTabOverflow } from "@/components/ui/TabBarBackground";
import { merchandise, cities as unsortedCities } from "@/data/merchandise";
import { abbreviateCityName } from "@/utils/abbreviateCityName";

// Sort cities by date ascending
const cities = [...unsortedCities].sort((a, b) => a.date.localeCompare(b.date));

export default function TestScreen() {
  const tableRef = useRef<View>(null);
  const bottomTabHeight = useBottomTabOverflow();

  // Table columns: first column is 'Item', second is 'Stock', then one for each city (sorted)
  const columns: Column[] = [
    {
      key: "item",
      title: "Item",
      width: 180,
      renderHeader: () => <ThemedText type="defaultSemiBold">Item</ThemedText>,
    },
    {
      key: "stock",
      title: "Stock",
      width: 80,
      renderHeader: () => <ThemedText type="defaultSemiBold">Stock</ThemedText>,
    },
    ...cities.map((city) => ({
      key: city.name,
      title: city.name,
      width: 120,
      renderHeader: () => (
        <ThemedText style={{ textAlign: "center" }}>
          <ThemedText type="defaultSemiBold">
            {abbreviateCityName(city.name)}
          </ThemedText>
          {"\n"}
          <ThemedText style={{ fontSize: 12, color: "#888" }}>
            {city.date}
          </ThemedText>
          {"\n"}
          <ThemedText style={{ fontSize: 12, color: "#888" }}>
            Cap: {city.capacity}
          </ThemedText>
        </ThemedText>
      ),
    })),
  ];

  // Table data: one row per merchandise item
  const data = merchandise.map((item) => {
    const row: Record<string, any> = { item: item.name, stock: item.stock };
    cities.forEach((city) => {
      row[city.name] = city.sales ? city.sales[item.name] ?? 0 : 0;
    });
    return row;
  });

  const handleShare = async () => {
    try {
      if (tableRef.current) {
        const uri = await captureRef(tableRef, {
          format: "png",
          quality: 1,
        });
        await Sharing.shareAsync(uri);
      }
    } catch (error) {
      console.error("Error sharing table image:", error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: bottomTabHeight + 4 },
        ]}
      >
        <ThemedView style={styles.container}>
          <ThemedText type="title">Per-City Merchandise Sales</ThemedText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ alignItems: "flex-start" }}
          >
            <View
              ref={tableRef}
              collapsable={false}
              style={{ alignSelf: "flex-start", width: "auto" }}
            >
              <Table columns={columns} data={data} />
            </View>
          </ScrollView>
          <View style={styles.shareIconRow}>
            <Pressable onPress={handleShare} accessibilityLabel="Share table">
              <IconSymbol
                name="square.and.arrow.up"
                size={32}
                color="#0a7ea4"
              />
            </Pressable>
          </View>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  shareIconContainer: {
    alignItems: "center",
    marginTop: 16,
  },
  shareIconRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
});
