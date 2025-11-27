import React, { memo, useMemo } from "react";
import {
  ResponsiveContainer,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Area,
  ComposedChart,
} from "recharts";
import { CustomTooltip } from "../custom-tooltip/CustomTooltip";
import { TPoint } from "../../types/interfaces";

interface IProps {
  data: TPoint[];
  variations: string[];
  visibleVariations: string[];
  lineStyle: "line" | "smooth" | "area";
  onHover?: (d?: TPoint) => void;
  zoomRange?: { startIndex: number; endIndex: number } | null;
  onZoomChange?: (r: { startIndex: number; endIndex: number } | null) => void;
  yDomain?: [number, number] | undefined;
}

export interface IChartDataPoint {
  x: string;
  dateISO: string;
  [variationName: string]: number | string | undefined;
}
const COLORS = ["#4142EF", "#FF8346", "#2ca02c", "#46464F", "#9467bd"];

export const Chart: React.FC<IProps> = memo(
  ({ data, variations, visibleVariations, lineStyle, yDomain }) => {
    // Create mapping from variation ID to name
    const variationIdToName = useMemo(() => {
      const mapping: Record<string, string> = {};

      if (variations.length > 0) {
        variations.forEach((variation, index) => {
          mapping[index.toString()] = variation;
        });

        mapping["0"] = variations[0] || "Original";
        mapping["10001"] = variations[1] || "Variation A";
        mapping["10002"] = variations[2] || "Variation B";
        mapping["10003"] = variations[3] || "Variation C";
      }

      return mapping;
    }, [variations]);

    // transform data: Recharts expects array of objects with keys for each variation
    const chartData = useMemo<IChartDataPoint[]>(() => {
      if (!data || data.length === 0) {
        console.log("No data to transform");
        return [];
      }

      // Group points by date
      const groupedByDate = new Map<string, IChartDataPoint>();

      data.forEach((point) => {
        if (!groupedByDate.has(point.x)) {
          groupedByDate.set(point.x, {
            x: point.x,
            dateISO: point.dateISO,
          });
        }
        const row = groupedByDate.get(point.x);

        // Use variation as key
        const variationKey = point.variation;
        const variationName = variationIdToName[variationKey] || variationKey;

        if (row) {
          // Save conversion rate
          row[variationName] = +point.conversionRate.toFixed(2);

          // Save visits and conversions
          row[`${variationName}_visits`] = point.visits;
          row[`${variationName}_conversions`] = point.conversions;
        }
      });

      const result = Array.from(groupedByDate.values()).sort((a, b) =>
        a.x.localeCompare(b.x)
      );

      return result;
    }, [data, variationIdToName]);

    if (!data || data.length === 0) {
      return (
        <div>
          <div
            className="no-data"
            style={{
              height: 420,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px dashed #ccc",
            }}
          >
            <p>No data.</p>
          </div>
        </div>
      );
    }

    return (
      <div id="chart-root">
        <ResponsiveContainer width="100%" height={420}>
          <ComposedChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" tick={{ fontSize: 12 }} />
            <YAxis
              domain={yDomain ?? [0, "auto"]}
              tickFormatter={(v) => `${(+v).toFixed(2)}%`}
              width={90}
            />
            <Tooltip content={<CustomTooltip chartData={chartData} />} />
            <Legend />

            {visibleVariations.map((variationName, i) => {
              const stroke = COLORS[i % COLORS.length];
              const type = lineStyle === "smooth" ? "monotone" : "linear";

              if (lineStyle === "area") {
                return (
                  <Area
                    key={variationName}
                    type={"monotone"}
                    dataKey={variationName}
                    name={variationName}
                    stroke={stroke}
                    fill={stroke}
                    fillOpacity={0.3}
                    isAnimationActive={false}
                    strokeWidth={2}
                    connectNulls
                  />
                );
              }

              return (
                <Line
                  key={variationName}
                  type={type}
                  dataKey={variationName}
                  name={variationName}
                  stroke={stroke}
                  dot={false}
                  strokeWidth={2}
                  isAnimationActive={false}
                  connectNulls
                />
              );
            })}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    );
  }
);
