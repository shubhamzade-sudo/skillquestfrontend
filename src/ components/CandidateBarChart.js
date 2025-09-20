// CandidateBarChart.jsx
import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

/**
 * CandidateBarChart
 * - reads brand colors from CSS :root variables (index.css) and applies them to the chart
 * - responsive, disposes on unmount
 * - tooltips and axis styling match brand palette
 */
const CandidateBarChart = ({ topK, candidates = [] }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const getId = (d) => d?.id ?? d?.candidate_id ?? d?.workday_id ?? d?.name ?? "";
  const getScore = (d) => {
    const s = d?.score ?? d?.final_score ?? d?.similarity ?? d?.finalScore ?? 0;
    return typeof s === "number" ? s : parseFloat(s) || 0;
  };

  // read CSS variables from :root with fallbacks
  const readBrandColors = () => {
    const root = getComputedStyle(document.documentElement);
    const brand = {
      blueBlack: root.getPropertyValue("--dentsu-blueblack")?.trim() || "#05051e",
      darkGrey: root.getPropertyValue("--dentsu-darkgrey")?.trim() || "#60607d",
      midGrey: root.getPropertyValue("--dentsu-midgrey")?.trim() || "#aeaebc",
      lightGrey: root.getPropertyValue("--dentsu-lightgrey")?.trim() || "#e5e5e9",
      linkBlue: root.getPropertyValue("--dentsu-link-blue")?.trim() || "#2563eb",
      white: root.getPropertyValue("--dentsu-white")?.trim() || "#ffffff",
    };
    return brand;
  };

  useEffect(() => {
    if (!chartRef.current) return;

    // init or reuse
    let chart = chartInstanceRef.current;
    if (!chart) {
      chart = echarts.init(chartRef.current, null, { renderer: "svg" }); // svg renderer often gives crisper text/prints
      chartInstanceRef.current = chart;
    }

    // gather data
    const ids = (candidates || []).map((d) => getId(d));
    const scores = (candidates || []).map((d) => getScore(d));

    // brand colors
    const brand = readBrandColors();

    // Helper to shorten labels for axis display
    const shortLabel = (val) => {
      const s = String(val);
      if (s.length > 14) return s.slice(0, 12) + "...";
      return s;
    };

    const option = {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        padding: 10,
        textStyle: { color: brand.blueBlack },
        formatter: function (params) {
          if (!params || !params.length) return "";
          const p = params[0];
          const id = p.axisValue;
          const score = p.data;
          return [
            `<div style="min-width:140px; color:${brand.blueBlack}; font-family: inherit">`,
            `<div style="font-weight:700; margin-bottom:6px">Workday ID: ${id}</div>`,
            `<div>Score: ${score}</div>`,
            `</div>`,
          ].join("");
        },
        backgroundColor: brand.white,
        borderColor: brand.lightGrey,
        borderWidth: 1,
      },
      grid: {
        left: "7%",
        right: "4%",
        bottom: "26%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        name: "Workday ID",
        nameLocation: "middle",
        nameGap: 36,
        nameTextStyle: { fontSize: 12, color: brand.darkGrey },
        data: ids,
        axisTick: { alignWithLabel: true, show: false },
        axisLine: { show: false },
        axisLabel: {
          rotate: -45,
          interval: 0,
          formatter: (val) => shortLabel(val),
          fontSize: 11,
          color: brand.darkGrey,
          margin: 8,
        },
      },
      yAxis: {
        type: "value",
        name: "Final Score",
        nameLocation: "middle",
        nameGap: 44,
        nameTextStyle: { fontSize: 12, color: brand.darkGrey },
        splitLine: {
          show: true,
          lineStyle: { color: brand.lightGrey, type: "solid" },
        },
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: brand.darkGrey, fontSize: 12 },
      },
      series: [
        {
          data: scores,
          type: "bar",
          barWidth: "50%",
          itemStyle: {
            borderRadius: [6, 6, 0, 0],
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: brand.linkBlue },         // top color (link blue)
              { offset: 1, color: "#8fb7ff" },             // lighter gradient stop
            ]),
            // add subtle stroke using midGrey
            borderColor: brand.midGrey,
            borderWidth: 0,
          },
          emphasis: {
            itemStyle: {
              blur: 0,
              shadowBlur: 8,
              shadowColor: "rgba(0,0,0,0.12)",
            },
          },
          label: {
            show: false,
            position: "top",
            color: brand.blueBlack,
            fontSize: 12,
            fontWeight: 700,
          },
        },
      ],
      // small theme-like text colors
      textStyle: { fontFamily: "Verdana, sans-serif", color: brand.blueBlack },
    };

    chart.setOption(option, { notMerge: true });

    // responsive
    const onResize = () => chart.resize();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      // do NOT dispose here — dispose handled in unmount effect
    };
  }, [candidates]); // re-run when candidates change

  // dispose instance on unmount
  useEffect(() => {
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.dispose();
        chartInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={chartRef}
      style={{
        width: "100%",
        height: "420px",
        padding: "8px 12px",
        boxSizing: "border-box",
      }}
    />
  );
};

export default CandidateBarChart;
