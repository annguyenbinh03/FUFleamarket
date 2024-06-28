import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import {
  PieChart,
  Pie,
  Legend,
  Tooltip,
  Cell,
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const pieData = [
  { name: "Gói Cơ bản", value: 5 },
  { name: "Gói Chuyên Nghiệp", value: 3 },
  { name: "Gói Pro", value: 2 },
];

const barData = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
  "#FF4D4D",
];

function AdminDoashboard() {
  return (
    <div className="admin_page">
      <nav className="navbar">
        <AdminHeader />
      </nav>
      <div className="admin_main container-fluid d-flex justify-content-center p-0 pt-3 mt-5">
        <nav className="w-13 p-0 bg-white">
          <div className="col-lg-12 ">
            <AdminSidebar />
          </div>
        </nav>
        <div className="main-content w-87 pt-3 row px-4 d-flex justify-content-between ">
          <div className="col-md-6 p-5 bg-white rounded-5">
            <BarChart
              width={500}
              height={250}
              data={barData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="pv"
                fill="#8884d8"
                activeBar={<Rectangle fill="pink" stroke="blue" />}
              />
              <Bar
                dataKey="uv"
                fill="#82ca9d"
                activeBar={<Rectangle fill="gold" stroke="purple" />}
              />
            </BarChart>
          </div>
          <div className="col-md-6  p-5 bg-white rounded-5">
            <PieChart width={500} height={250}>
              <Pie
                dataKey="value"
                isAnimationActive={false}
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              />
              <Tooltip />
            </PieChart>
          </div>
          <div className="col-md-6  p-5 bg-white rounded-5">
            <PieChart width={500} height={250}>
              <Pie
                dataKey="value"
                isAnimationActive={false}
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              />
              <Tooltip />
            </PieChart>
          </div>
          <div className="col-md-6  p-5 bg-white rounded-5">
            <PieChart width={500} height={250}>
              <Pie
                dataKey="value"
                isAnimationActive={false}
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              />
              <Tooltip />
            </PieChart>
          </div>
          <div className="col-md-6  p-5 bg-white rounded-5">
            <PieChart width={500} height={250}>
              <Pie
                dataKey="value"
                isAnimationActive={false}
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              />
              <Tooltip />
            </PieChart>
          </div>
          <div className="col-md-6  p-5 bg-white rounded-5">
            <PieChart width={500} height={250}>
              <Pie
                dataKey="value"
                isAnimationActive={false}
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              />
              <Tooltip />
            </PieChart>
          </div>
          <div className="col-md-6  p-5 bg-white rounded-5">
            <PieChart width={500} height={250}>
              <Pie
                dataKey="value"
                isAnimationActive={false}
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              />
              <Tooltip />
            </PieChart>
          </div>
          <div className="col-md-6  p-5 bg-white rounded-5">
            <PieChart width={500} height={250}>
              <Pie
                dataKey="value"
                isAnimationActive={false}
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              />
              <Tooltip />
            </PieChart>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDoashboard;
