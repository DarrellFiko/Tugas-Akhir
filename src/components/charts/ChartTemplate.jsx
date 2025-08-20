import React from "react";
import { Box } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";

export default function ChartTemplate({
  type = "line",              // "line" | "bar" | "donut"
  area = false,
  series = [],                // Array of data series
  xAxis = [],                 // X-axis config (Line/Bar)
  yAxis = [],                 // Y-axis config (Line/Bar)
  dataset,                    // Dataset array (optional if series has data)
  height = 300,            // Chart height (can be px or %)
  width = undefined,             // Chart width (can be px or %)
  margin = undefined,             // Chart width (can be px or %)
  grid,                       // Show grid lines (Line/Bar)
  layout,                     // "vertical" | "horizontal" (Bar only)
  stackOffset,                // Stacking mode (Bar only)
  stackOrder,                 // Stacking order (Bar only)
  borderRadius,               // Rounded corners (Bar only)
  barLabel,                   // Show label on bars (Bar only)
  disableAxisListener,        // Disable axis event listeners
  loading = false,            // Show loading overlay
  hideLegend = false,         // Hide legend completely
  onAxisClick,                // Callback when axis is clicked
  onHighlightChange,          // Callback when hover/selection changes
  highlightedAxis,            // Which axis is highlighted
  highlightedItem,            // Which item is highlighted
  localeText,                 // Localization texts
  colors,                     // Custom color palette
  slotProps,                  // Slot overrides (e.g., legend, tooltip)
  sx,                         // Custom MUI sx styles
}) {
  const renderChart = () => {
    switch (type) {
      case "line":
        return (
          <LineChart
            series={series.map((s) => ({
              ...s,
              area: area
            }))}
            xAxis={xAxis}
            yAxis={yAxis}
            dataset={dataset}
            height={height}
            width={width}
            margin={margin}
            grid={grid}
            slotProps={slotProps}
            disableAxisListener={disableAxisListener}
            hideLegend={hideLegend}
            onAxisClick={onAxisClick}
            onHighlightChange={onHighlightChange}
            highlightedAxis={highlightedAxis}
            highlightedItem={highlightedItem}
            localeText={localeText}
            colors={colors}
            sx={{ ml: -4 }}
          />
        );

      case "bar":
        return (
          <BarChart
            series={series}
            xAxis={xAxis}
            yAxis={yAxis}
            dataset={dataset}
            height={height}
            width={width}
            margin={margin}
            grid={grid}
            layout={layout}
            stackOffset={stackOffset}
            stackOrder={stackOrder}
            borderRadius={borderRadius}
            barLabel={barLabel}
            slotProps={slotProps}
            disableAxisListener={disableAxisListener}
            hideLegend={hideLegend}
            onAxisClick={onAxisClick}
            onHighlightChange={onHighlightChange}
            highlightedAxis={highlightedAxis}
            highlightedItem={highlightedItem}
            localeText={localeText}
            colors={colors}
            sx={{ ml: -4, px: 1 }}
          />
        );

      case "donut":
        return (
          <PieChart
            series={series.map((s) => ({
              ...s,
              innerRadius: 60, // makes donut
              outerRadius: 100,
              paddingAngle: 2,
              cornerRadius: 4,
              arcLabel: (item) => `${item.value}`, // show number inside
            }))}
            width={width}
            margin={margin}
            height={height}
            colors={colors}
            hideLegend={hideLegend}
            slotProps={{
              ...slotProps,
              legend: {
                anchor: "top",
                direction: "row",
              },
            }}
            localeText={localeText}
          />
        );
    }
  };

  return (
    <Box
      position="relative"
      sx={{
        width,
        height,
        ...sx, // user overrides
      }}
    >
      {loading ? (
        <Box
          position="absolute"
          inset={0}
          bgcolor="rgba(255,255,255,0.6)"
          zIndex={2}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          Loading...
        </Box>
      ) : (
        renderChart()
      )}
    </Box>
  );
}
