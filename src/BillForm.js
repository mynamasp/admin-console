import React, { useState } from "react";
import DatePicker from "react-datepicker";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import "./App.css"; // Assuming you have an App.css for your styles

const data = [
  { name: "11/11/24", uv: 400 },
  { name: "12/11/24", uv: 200 },
  { name: "13/11/24", uv: 300 },
  { name: "14/11/24", uv: 600 },
];

function BillForm() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [meterId, setMeterId] = useState("");
  const [consumption, setConsumption] = useState(0);

  const handleCalculate = () => {};

  return (
    <div className="flex flex-col">
      <div className="bill-form flex flex-col mt-12 md:flex-row md:mx-72">
        <div className="flex-auto">
          <input
            type="text"
            placeholder="Meter ID"
            className="rounded-xl"
            value={meterId}
            onChange={(e) => setMeterId(e.target.value)}
          />
        </div>
        <div className="flex-auto">
          <DatePicker
            selected={startDate}
            className="text-center rounded-xl"
            onChange={(date) => setStartDate(date)}
            dateFormat="dd/MM/yyyy"
          />
        </div>
        <div className="flex-auto">
          <DatePicker
            selected={endDate}
            className="text-center rounded-xl       "
            onChange={(date) => setEndDate(date)}
            dateFormat="dd/MM/yyyy"
          />
        </div>
        <div className="flex-auto">
          <button onClick={handleCalculate}>Calculate</button>
        </div>
      </div>
      <div className="mt-12">
        <PowerInfo date="Nov 11,2024" energy="400Wh" />
        <PowerInfo date="Nov 12,2024" energy="200Wh" />
        <PowerInfo date="Nov 13,2024" energy="300Wh" />
        <PowerInfo date="Nov 14,2024" energy="600Wh" />
      </div>
      <div className="w-lg mt-12 mx-auto md:hidden">
        <LineChart
          width={400}
          height={300}
          data={data}
          margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
        >
          <Line type="monotone" dataKey="uv" stroke="#8884d8" />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
        </LineChart>
      </div>
      <div className="w-lg mt-12 mx-auto hidden md:block">
        <LineChart
          width={800}
          height={300}
          data={data}
          margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
        >
          <Line type="monotone" dataKey="uv" stroke="#8884d8" />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
        </LineChart>
      </div>
    </div>
  );
}

const PowerInfo = (props) => {
  const { date, energy } = props;

  return (
    <div className="flex flex-row text-center mt-4">
      <div className="flex-auto">{date}</div>
      <div className="flex-auto">{energy}</div>
    </div>
  );
};

const renderLineChart = (
  <LineChart
    width={600}
    height={300}
    data={data}
    margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
  >
    <Line type="monotone" dataKey="uv" stroke="#8884d8" />
    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
  </LineChart>
);

export default BillForm;
