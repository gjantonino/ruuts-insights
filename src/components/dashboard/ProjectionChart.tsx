
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Projection } from "@/types/farm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { useTranslation } from "react-i18next";

interface ProjectionChartProps {
  twoYearData: Projection[];
  fiveYearData: Projection[];
  tenYearData: Projection[];
  metricKey: keyof Projection;
  title: string;
  yAxisLabel: string;
}

interface ChartDataPoint {
  year: number;
  current: number;
  regenerative: number;
}

export function ProjectionChart({ twoYearData, fiveYearData, tenYearData, metricKey, title, yAxisLabel }: ProjectionChartProps) {
  const { t } = useTranslation();

  // Transform data for visualization
  const transformData = (projections: Projection[], key: keyof Projection) => {
    const current = projections.find((p) => p.type === "current");
    const regenerative = projections.find((p) => p.type === "regenerative");

    if (!current || !regenerative) return [];

    // Create yearly data points
    const data: ChartDataPoint[] = [];
    const years = current.year;

    // Always include year 0 (current state)
    data.push({
      year: 0,
      current: 0,
      regenerative: 0,
    });

    // Calculate yearly increments
    const currentIncrement = (current[key] as number) / years;
    const regenerativeIncrement = (regenerative[key] as number) / years;

    // Generate data for each year
    for (let i = 1; i <= years; i++) {
      data.push({
        year: i,
        current: Number((currentIncrement * i).toFixed(2)),
        regenerative: Number((regenerativeIncrement * i).toFixed(2)),
      });
    }

    return data;
  };

  const twoYearChartData = transformData(twoYearData, metricKey);
  const fiveYearChartData = transformData(fiveYearData, metricKey);
  const tenYearChartData = transformData(tenYearData, metricKey);

  const chartConfig = {
    current: {
      label: t("dashboard.currentPractices"),
      theme: {
        light: "#D9785F", // Cambiado a un color más brillante
        dark: "#FF9E80",
      },
    },
    regenerative: {
      label: t("dashboard.regenerativePractices"),
      theme: {
        light: "#9AC168", // Cambiado a un color más brillante
        dark: "#AED581",
      },
    },
  };

  const renderChart = (data: ChartDataPoint[]) => (
    <ChartContainer
      config={chartConfig}
      className="h-[250px] md:h-[300px] w-full"
    >
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <LineChart
          data={data}
          margin={{
            top: 20,
            right: 20,
            left: 0,
            bottom: 5,
          }}
        >
          <XAxis
            dataKey="year"
            label={{ value: t("dashboard.years"), position: "insideBottomRight", offset: -5 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            label={{
              value: yAxisLabel,
              angle: -90,
              position: "insideLeft",
              offset: 10,
              style: { fontSize: "12px", textAnchor: "middle" },
            }}
            axisLine={false}
            tickLine={false}
            fontSize={12}
          />
          <Tooltip content={<ChartTooltipContent />} />
          <Legend wrapperStyle={{ fontSize: "12px" }} />
          <Line
            type="monotone"
            dataKey="current"
            name={t("dashboard.currentPractices")}
            stroke="var(--color-current)"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="regenerative"
            name={t("dashboard.regenerativePractices")}
            stroke="var(--color-regenerative)"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );

  return (
    <Card className="dashboard-card card-gradient-green">
      <CardHeader>
        <CardTitle className="text-xl">{title} {t("dashboard.projection")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="five"
          className="w-full"
        >
          <TabsList className="mb-4 w-full justify-start space-x-2 neumorph-inset dark:neumorph-dark-inset bg-transparent">
            <TabsTrigger
              value="two"
              className="flex-1 md:flex-none data-[state=active]:neumorph dark:data-[state=active]:neumorph-dark data-[state=active]:shadow-none"
            >
              {t("dashboard.twoYear")}
            </TabsTrigger>
            <TabsTrigger
              value="five"
              className="flex-1 md:flex-none data-[state=active]:neumorph dark:data-[state=active]:neumorph-dark data-[state=active]:shadow-none"
            >
              {t("dashboard.fiveYear")}
            </TabsTrigger>
            <TabsTrigger
              value="ten"
              className="flex-1 md:flex-none data-[state=active]:neumorph dark:data-[state=active]:neumorph-dark data-[state=active]:shadow-none"
            >
              {t("dashboard.tenYear")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="two">{renderChart(twoYearChartData)}</TabsContent>

          <TabsContent value="five">{renderChart(fiveYearChartData)}</TabsContent>

          <TabsContent value="ten">{renderChart(tenYearChartData)}</TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
