import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useColorScheme } from "@/hooks/useColorScheme";
import { DimensionValue, StyleSheet, View } from "react-native";

export type Column = {
  key: string;
  title: string;
  width?: DimensionValue;
  renderHeader?: () => React.ReactNode;
};

type TableProps = {
  columns: Column[];
  data: Record<string, any>[];
};

export function Table({ columns, data }: TableProps) {
  const colorScheme = useColorScheme() ?? "light";
  // Accessible alternating row backgrounds
  const rowBg =
    colorScheme === "light"
      ? ["#fff", "#F3F4F6"] // white and accessible light gray
      : ["#23272A", "#151718"]; // two dark grays with good contrast

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <ThemedView style={styles.header}>
        {columns.map((column) => (
          <ThemedView
            key={column.key}
            style={[styles.headerCell, { width: column.width || 100 }]}
          >
            {column.renderHeader ? (
              column.renderHeader()
            ) : (
              <ThemedText type="defaultSemiBold">{column.title}</ThemedText>
            )}
          </ThemedView>
        ))}
      </ThemedView>

      {/* Rows */}
      {data.map((row, rowIndex) => (
        <View
          key={rowIndex}
          style={[styles.row, rowIndex !== data.length - 1 && styles.rowBorder]}
        >
          {columns.map((column) => (
            <View
              key={column.key}
              style={[
                styles.cell,
                {
                  width: column.width || 100,
                  backgroundColor: rowBg[rowIndex % 2],
                },
              ]}
            >
              <ThemedText>{row[column.key]}</ThemedText>
            </View>
          ))}
        </View>
      ))}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  header: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  headerCell: {
    padding: 12,
    alignItems: "flex-start",
  },
  row: {
    flexDirection: "row",
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  evenRow: {},
  oddRow: {},
  cell: {
    padding: 12,
    alignItems: "flex-start",
  },
});
