import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Building2, CheckCircle, Users, Star } from "lucide-react";
import { getDashboardStatistics, getDashboardTrends, getTopReviewsCompanies } from "../../../api/dashboardApi";

const STAT_CARD_CONFIG = [
  {
    label: "Total Companies",
    key: "totalCompanies",
    icon: Building2,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
  },
  {
    label: "Pending Verifications",
    key: "pendingVerifications",
    icon: CheckCircle,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-400",
  },
  {
    label: "Total Users",
    key: "totalUsers",
    icon: Users,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-500",
  },
  {
    label: "Total Reviews",
    key: "totalReviews",
    icon: Star,
    iconBg: "bg-yellow-50",
    iconColor: "text-yellow-500",
  },
];



function formatTrendMonth(yearMonth) {
  const [year, month] = yearMonth.split("-");
  const label = new Date(Number(year), Number(month) - 1).toLocaleString("en", { month: "short" });
  return `${label} '${year.slice(2)}`;
}

function StatCard({ label, value, icon: Icon, iconBg, iconColor, loading }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className={`mb-4 inline-flex rounded-lg p-2.5 ${iconBg}`}>
        <Icon size={22} className={iconColor} />
      </div>
      {loading ? (
        <div className="h-8 w-16 animate-pulse rounded bg-gray-100" />
      ) : (
        <p className="text-2xl font-bold text-gray-900">{value ?? "-"}</p>
      )}
      <p className="mt-1 text-sm text-gray-500">{label}</p>
    </div>
  );
}

function CustomYAxisTick({ x, y, payload }) {
  const lines = payload.value.split("\n");
  return (
    <g transform={`translate(${x},${y})`}>
      {lines.map((line, i) => (
        <text
          key={i}
          x={0}
          y={0}
          dy={i * 14 - (lines.length - 1) * 7}
          textAnchor="end"
          fill="#6b7280"
          fontSize={12}
        >
          {line}
        </text>
      ))}
    </g>
  );
}

export function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [topCompanies, setTopCompanies] = useState([]);
  const [trendData, setTrendData] = useState([]);

  useEffect(() => {
    let cancelled = false;

    getDashboardStatistics()
      .then((data) => {
        if (!cancelled) setStats(data.result);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    getTopReviewsCompanies().then((data) => {
      if (!cancelled) {
        setTopCompanies(
          (data.result ?? []).map((item) => ({
            name: item.companyName,
            reviews: item.totalReviews,
          }))
        );
      }
    });

    getDashboardTrends().then((data) => {
      if (!cancelled) {
        setTrendData(
          (data.result ?? []).map((item) => ({
            month: formatTrendMonth(item.month),
            reviews: item.reviewCount,
            companies: item.newCompanyCount,
          }))
        );
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of platform statistics and trends
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STAT_CARD_CONFIG.map((card) => (
          <StatCard
            key={card.label}
            label={card.label}
            value={stats?.[card.key]}
            icon={card.icon}
            iconBg={card.iconBg}
            iconColor={card.iconColor}
            loading={loading}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-gray-800">
            Top Reviewed Companies
          </h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={topCompanies}
              layout="vertical"
              margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12, fill: "#6b7280" }} />
              <YAxis
                type="category"
                dataKey="name"
                tick={<CustomYAxisTick />}
                width={110}
              />
              <Tooltip
                cursor={{ fill: "#f3f4f6" }}
                contentStyle={{ fontSize: 12, borderRadius: 8 }}
              />
              <Bar dataKey="reviews" fill="#f97316" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-gray-800">
            Monthly Activity Trends
          </h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart
              data={trendData}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#6b7280" }} />
              <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8 }}
              />
              <Legend
                wrapperStyle={{ fontSize: 12 }}
                formatter={(value) =>
                  value === "reviews" ? "Reviews" : "New Companies"
                }
              />
              <Line
                type="monotone"
                dataKey="reviews"
                stroke="#f97316"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="companies"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
