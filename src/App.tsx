import React, { useCallback, useState } from "react";
import styles from "./App.module.css";
import { Chart } from "./UI/chart/Chart";
import { Controls } from "./UI/controls/Controls";
import { EAggregation, ELineStyle } from "./types/enums";
import * as htmlToImage from "html-to-image";

import { useChartData } from "./hooks/useChartData";
import { useZoom } from "./hooks/useZoom";
import { useTheme } from "./hooks/useTheme";

const App: React.FC = () => {
  const [aggregation, setAggregation] = useState<EAggregation>(
    EAggregation.Day
  );
  const [lineStyle, setLineStyle] = useState<ELineStyle>(ELineStyle.Line);
  const { toggleTheme, dark } = useTheme();

  const { allVars, visibleVars, onToggleVariation, points, yDomain } =
    useChartData(aggregation);

  const {
    zoomRange,
    chartData,
    canZoomIn,
    canZoomOut,
    zoomIn,
    zoomOut,
    resetZoom,
    setZoomRange,
  } = useZoom(points);

  const exportPNG = useCallback(() => {
    const node = document.getElementById("chart-root");
    if (!node) return;

    htmlToImage.toPng(node).then((dataUrl) => {
      const link = document.createElement("a");
      link.download = "chart.png";
      link.href = dataUrl;
      link.click();
    });
  }, []);

  return (
    <div className={styles.app}>
      <main className={styles.main}>
        <Controls
          variations={allVars}
          selected={visibleVars}
          onToggleVariation={onToggleVariation}
          aggregation={aggregation}
          onAggregationChange={setAggregation}
          lineStyle={lineStyle}
          onLineStyleChange={setLineStyle}
          dark={dark}
          onToggleTheme={toggleTheme}
          onExportPNG={exportPNG}
          onResetZoom={resetZoom}
          zoomIn={zoomIn}
          zoomOut={zoomOut}
          canZoomIn={canZoomIn}
          canZoomOut={canZoomOut}
        />
        <div id="chart-root">
          <Chart
            data={chartData}
            variations={allVars}
            visibleVariations={visibleVars}
            lineStyle={lineStyle}
            zoomRange={zoomRange}
            onZoomChange={setZoomRange}
            yDomain={yDomain}
          />
        </div>
      </main>
    </div>
  );
};

export default App;
