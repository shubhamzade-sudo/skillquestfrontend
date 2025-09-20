import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

const TitleDistributionChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartInstance = echarts.init(chartRef.current);

    // brand colors
    const rootStyles = getComputedStyle(document.documentElement);
    const blue = rootStyles.getPropertyValue("--dentsu-link-blue").trim() || "#007eff";
    const darkGrey = rootStyles.getPropertyValue("--dentsu-darkgrey").trim() || "#60607d";
    const blueblack = rootStyles.getPropertyValue("--dentsu-blueblack").trim() || "#05051e";

    const option = {
      title: {
        text: "Title Distribution",
        left: 0, // ✅ align to left
        textStyle: {
          color: blueblack, // ✅ same as "Employee Snapshot"
          fontSize: 18,
          fontWeight: "bold",
        },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
      },
      xAxis: {
        type: "value",
        boundaryGap: [0, 0.01],
        axisLabel: { color: darkGrey },
        splitLine: {
          show: true,
          lineStyle: { color: "rgba(96,96,125,0.1)" },
        },
      },
      yAxis: {
        type: "category",
        data: [
          "Senior Analyst",
          "Analyst",
          "Senior Software Engineer",
          "Technical Lead",
          "Software Engineer",
          "Lead Analyst",
          "Manager",
          "Account Manager",
          "Associate Analyst",
        ],
        axisLabel: { color: darkGrey },
      },
      series: [
        {
          name: "Employees",
          type: "bar",
          data: [120, 100, 80, 70, 65, 60, 55, 40, 30],
          itemStyle: {
            color: blue, // ✅ Dentsu blue
          },
        },
      ],
    };

    chartInstance.setOption(option);

    const handleResize = () => chartInstance.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      chartInstance.dispose();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <div ref={chartRef} style={{ width: "100%", height: "450px" }} />;
};

export default TitleDistributionChart;
