import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Label,
  Legend,
} from "recharts";

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [counts, setCounts] = useState({
    Aman: 0,
    Menipis: 0,
    Kritis: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [rekapPR, setRekapPR] = useState([]);
  const [rekapPO, setRekapPO] = useState([]);

  // ✅ Ambil inventory (status stok)
  useEffect(() => {
    fetch("http://localhost/inventory-api/get_inventory.php")
      .then((res) => res.json())
      .then((result) => {
        setData(result);

        const aman = result.filter(
          (item) => item.indikator_status === "Hijau"
        ).length;
        const menipis = result.filter(
          (item) => item.indikator_status === "Kuning"
        ).length;
        const kritis = result.filter(
          (item) => item.indikator_status === "Merah"
        ).length;

        setCounts({ Aman: aman, Menipis: menipis, Kritis: kritis });

        const yearCounts = {};
        result.forEach((item) => {
          if (item.tanggal_stok_habis) {
            const year = new Date(item.tanggal_stok_habis).getFullYear();
            yearCounts[year] = (yearCounts[year] || 0) + 1;
          }
        });

        const chartArr = Object.entries(yearCounts).map(([year, total]) => ({
          year,
          total,
        }));
        setChartData(chartArr);
      })
      .catch((err) => console.error(err));
  }, []);

  // ✅ Ambil rekap PR & PO
  useEffect(() => {
    fetch("http://localhost/inventory-api/rekap_pr_po.php")
      .then((res) => res.json())
      .then((result) => {
        setRekapPR([
          { name: "Sudah PR", value: result.with_pr },
          { name: "Belum PR", value: result.without_both + result.with_po },
        ]);

        setRekapPO([
          { name: "Sudah PO", value: result.with_po },
          { name: "Belum PO", value: result.without_both + result.with_pr },
        ]);
      })
      .catch((err) => console.error(err));
  }, []);

  const cards = [
    {
      label: "Stok Aman",
      value: counts.Aman,
      color: "bg-green-500",
      status: "Aman",
    },
    {
      label: "Stok Menipis",
      value: counts.Menipis,
      color: "bg-yellow-400",
      status: "Menipis",
    },
    {
      label: "Stok Kritis",
      value: counts.Kritis,
      color: "bg-red-500",
      status: "Kritis",
    },
  ];

  const COLORS = ["#8884d8", "#ffc658"];

  const totalPR = rekapPR.reduce((sum, item) => sum + item.value, 0);
  const totalPO = rekapPO.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="p-6 space-y-8">
      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div
            key={card.label}
            onClick={() => navigate(`/laporan/${card.status}`)}
            className={`${card.color} text-white p-6 rounded-xl shadow-lg cursor-pointer transform transition hover:scale-105`}
          >
            <h3 className="text-lg font-semibold">{card.label}</h3>
            <p className="text-3xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Grafik Barang Habis per Tahun */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Barang Habis per Tahun</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#8884d8" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Grafik Donat PR & PO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Donut PR */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Rekap PR</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={rekapPR}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {rekapPR.map((entry, index) => (
                  <Cell
                    key={`cell-pr-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
                <Label
                  value={`${totalPR} Total`}
                  position="center"
                  className="text-xl font-bold"
                />
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Donut PO */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Rekap PO</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={rekapPO}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {rekapPO.map((entry, index) => (
                  <Cell
                    key={`cell-po-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
                <Label
                  value={`${totalPO} Total`}
                  position="center"
                  className="text-xl font-bold"
                />
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
