'use client';

import { ArrowUpRight } from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

const revenue = [
  { date: 'Jun 9', value: 12780 },
  { date: 'Jun 16', value: 13420 },
  { date: 'Jun 23', value: 13260 },
  { date: 'Jun 30', value: 14340 },
  { date: 'Jul 7', value: 14160 },
  { date: 'Jul 14', value: 15310 },
  { date: 'Jul 21', value: 15140 },
  { date: 'Jul 28', value: 16520 },
  { date: 'Aug 4', value: 16280 },
  { date: 'Aug 11', value: 17410 },
  { date: 'Aug 18', value: 16388 },
  { date: 'Aug 25', value: 18420 },
];
const movements = [
  { kind: 'New', value: 3480 },
  { kind: 'Upgrades', value: 2110 },
  { kind: 'Renewals', value: 4210 },
  { kind: 'Churn', value: -2970 },
];
const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});
const revenueConfig = {
  value: { label: 'Revenue', color: 'var(--color-chart-1)' },
} satisfies ChartConfig;
const movementConfig = {
  value: { label: 'Movement', color: 'var(--color-chart-2)' },
} satisfies ChartConfig;
const currentRevenue = revenue[revenue.length - 1].value;
const change = (
  (currentRevenue / revenue[revenue.length - 2].value - 1) *
  100
).toFixed(1);
const netMovement = movements.reduce((total, item) => total + item.value, 0);

export function DashboardAnalytics() {
  return (
    <section
      id="analytics"
      aria-labelledby="analytics-title"
      className="flex scroll-mt-6 flex-col gap-4"
    >
      <div className="flex flex-col items-start gap-2">
        <Badge variant="outline">Sample data</Badge>
        <h2
          id="analytics-title"
          className="text-xl font-semibold tracking-tight"
        >
          Analytics components
        </h2>
        <p className="text-sm text-muted-foreground">
          Example revenue data. Connect your own metrics when your product needs
          them.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardDescription>Recurring revenue</CardDescription>
              <Badge variant="outline">Last 12 weeks</Badge>
            </div>
            <div className="flex flex-wrap items-baseline gap-3">
              <p className="text-3xl font-semibold tracking-tight tabular-nums">
                {money.format(currentRevenue)}
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-medium">
                <ArrowUpRight className="size-4" aria-hidden="true" />+{change}%
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={revenueConfig}
              className="h-64 w-full"
              aria-label="Sample recurring revenue over 12 weeks"
            >
              <AreaChart
                accessibilityLayer
                data={revenue}
                margin={{ top: 8, right: 0, left: 0, bottom: 0 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={12}
                  minTickGap={28}
                />
                <YAxis
                  orientation="right"
                  tickLine={false}
                  axisLine={false}
                  width={36}
                  domain={[12000, 19000]}
                  tickFormatter={(value) => `${Number(value) / 1000}k`}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value) => money.format(Number(value))}
                    />
                  }
                />
                <Area
                  dataKey="value"
                  type="linear"
                  fill="var(--color-value)"
                  fillOpacity={0.08}
                  stroke="var(--color-value)"
                  strokeWidth={2}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Revenue movements</CardDescription>
            <p className="text-3xl font-semibold tracking-tight tabular-nums">
              +{money.format(netMovement)}
            </p>
            <CardDescription>
              Illustrative net movement this month.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={movementConfig}
              className="h-64 w-full"
              aria-label="Sample revenue from new subscriptions, upgrades, renewals, and churn"
            >
              <BarChart
                accessibilityLayer
                data={movements}
                margin={{ top: 8, right: 0, left: 0, bottom: 0 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="kind"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={12}
                  interval={0}
                />
                <YAxis hide />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value) => money.format(Number(value))}
                    />
                  }
                />
                <Bar
                  dataKey="value"
                  fill="var(--color-value)"
                  radius={4}
                  isAnimationActive={false}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
