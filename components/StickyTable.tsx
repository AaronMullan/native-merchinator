import { Column } from "@/components/Table";
import { ThemedText } from "@/components/ThemedText";
import { useColorScheme } from "@/hooks/useColorScheme";
import React, { useRef, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

interface StickyTableProps {
  columns: Column[];
  data: Record<string, any>[];
}

export function StickyTable({ columns, data }: StickyTableProps) {
  const colorScheme = useColorScheme() ?? "light";
  const rowBg =
    colorScheme === "light" ? ["#fff", "#F3F4F6"] : ["#23272A", "#151718"];

  // For synchronizing vertical scroll
  const stickyScrollRef = useRef<ScrollView>(null);
  const scrollableScrollRef = useRef<ScrollView>(null);
  const [rowHeights, setRowHeights] = useState<number[]>([]);

  // Synchronize vertical scroll
  const onScrollSticky = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollableScrollRef.current?.scrollTo({
      y: e.nativeEvent.contentOffset.y,
      animated: false,
    });
  };
  const onScrollScrollable = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    stickyScrollRef.current?.scrollTo({
      y: e.nativeEvent.contentOffset.y,
      animated: false,
    });
  };

  // Measure row heights for alignment
  const onRowLayout = (index: number, height: number) => {
    setRowHeights((prev) => {
      const next = [...prev];
      next[index] = height;
      return next;
    });
  };

  // Split columns
  const [stickyCol, ...scrollCols] = columns;

  return (
    <View style={styles.tableContainer}>
      {/* Header Row: sticky column + city columns */}
      <View style={styles.headerRow}>
        {/* Sticky column header cell */}
        <View
          style={[
            styles.headerCell,
            styles.headerCellFixed,
            { width: stickyCol.width || 100 },
          ]}
        >
          <ThemedText type="defaultSemiBold" style={styles.headerCellText}>
            {stickyCol.renderHeader
              ? stickyCol.renderHeader()
              : stickyCol.title}
          </ThemedText>
        </View>
        {/* City column header cells */}
        {scrollCols.map((col) => (
          <View
            key={col.key}
            style={[styles.headerCell, { width: col.width || 100 }]}
          >
            {col.renderHeader ? (
              col.renderHeader()
            ) : (
              <ThemedText type="defaultSemiBold" style={styles.headerCellText}>
                {col.title}
              </ThemedText>
            )}
          </View>
        ))}
      </View>
      {/* Table Body: sticky column + scrollable columns */}
      <View style={{ flexDirection: "row", maxHeight: 400 }}>
        {/* Sticky column */}
        <ScrollView
          ref={stickyScrollRef}
          onScroll={onScrollSticky}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          style={{ flexGrow: 0 }}
        >
          {data.map((row, rowIndex) => (
            <View
              key={rowIndex}
              style={{
                width: stickyCol.width || 100,
                backgroundColor: rowBg[rowIndex % 2],
                height: rowHeights[rowIndex] || undefined,
                justifyContent: "center",
              }}
              onLayout={(e) =>
                onRowLayout(rowIndex, e.nativeEvent.layout.height)
              }
            >
              <ThemedText>{row[stickyCol.key]}</ThemedText>
            </View>
          ))}
        </ScrollView>
        {/* Scrollable columns */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={true}
          style={[styles.scrollableColsScroll, { flex: 1 }]}
        >
          <ScrollView
            ref={scrollableScrollRef}
            onScroll={onScrollScrollable}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
          >
            {data.map((row, rowIndex) => (
              <View
                key={rowIndex}
                style={{
                  flexDirection: "row",
                  height: rowHeights[rowIndex] || undefined,
                }}
              >
                {scrollCols.map((col) => (
                  <View
                    key={col.key}
                    style={{
                      width: col.width || 100,
                      backgroundColor: rowBg[rowIndex % 2],
                      justifyContent: "center",
                    }}
                  >
                    <ThemedText>{row[col.key]}</ThemedText>
                  </View>
                ))}
              </View>
            ))}
          </ScrollView>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tableContainer: {
    flexDirection: "row",
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  stickyColContainer: {
    zIndex: 2,
    backgroundColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  headerRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    alignItems: "center",
    height: 64, // fixed height for all header cells
  },
  headerCell: {
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    backgroundColor: "transparent",
  },
  headerCellFixed: {
    // for sticky column header cell
  },
  headerCellText: {
    textAlign: "center",
  },
  scrollableColsScroll: {
    flex: 1,
  },
  headerSpacer: {
    height: 48,
  },
  headerDateCap: {
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
});
