import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import 'flowbite';
import { toast, Slide } from 'react-toastify';

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
// import "./App.css"; // Assuming you have an App.css for your styles
import "./BillForm.css"; // Assuming you have a BillForm.css for your styles

const data = [
  { name: "11/11/24", uv: 400 },
  { name: "12/11/24", uv: 200 },
  { name: "13/11/24", uv: 300 },
  { name: "14/11/24", uv: 600 },
];

function Date2Epoch (date) {
  return Date.parse(date)
}

function epoch2Date(epoch){
  let date = new Date(epoch)
  return date.toLocaleString('en-IN')
}

function BillForm() {
  const [startDate, setStartDate] = useState(new Date((new Date(new Date())).setMonth((new Date()).getMonth() - 1)));
  const [endDate, setEndDate] = useState(new Date());
  const [meterId, setMeterId] = useState("1001");
  const [meterData, setMeterData ] = useState([]);
  const [responseData, setResponseData] = useState(null);

  const [graphData, setGraphData] = useState(null);

  //shows power if set to true or energy if set to false
  const [showPower, setShowPower] = useState(true);
  const [yComponent, setYComponent] = useState("power");
  const [renderGraph, setRenderGraph] = useState(false);
  const [powerEnergyButton, setPowerEnergyButton] = useState("Show Power")

  function GetFromAPI(path, authToken) {
    //authObject --> Set x-auth-token in  header as key and token as value
    fetch(path, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': authToken
      }
    }).then(async response => {
      if (response.ok) {
        console.log('Data fetched successfully');
        return response.json();
      } else {
        console.log('Failed to fetch data');
        const dataText = await response.text();
        let error = new Error(dataText || 'Failed to fetch data');
        error.response = response;
        throw error;
      }
    }).then(__data => {
      console.log(__data);
      /*Set data to a state here */
      setResponseData(__data);
    }).catch(error => {
      console.error('Error fetching data:', error);
      let errorMsg = error.message || 'Failed to fetch data';
      toast.error(errorMsg, {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        transition: Slide
      });
    })
  
  }

  const handleGetLogs = () => {
    console.log("Getting logs for meter ID:", meterId);
    console.log("Start Date:", Date2Epoch(startDate));
    console.log("End Date:", Date2Epoch(endDate));
    
    // Call the API to get the logs
    const apiUrl = `http://localhost:3030/admin/log-data/${meterId}/${Date2Epoch(startDate)}/${Date2Epoch(endDate)}`; // Change this to the actual API URL
    console.log(`API URL: ${apiUrl}`)

    GetFromAPI(apiUrl, localStorage.getItem('token'));    
  };

  useEffect(() => {
    if (responseData === null) {
      return;
      }
    else {
      console.log("Response is")
      
  
      if (responseData.data) {
        let labels = responseData.labels
        //sort by epoch with the latest date first
        //date index = 2
        let sorted = responseData.data.sort((a, b) => b[2] - a[2])
        //convert epoch to date
        sorted = sorted.map((row) => {
          row[2] = epoch2Date(row[2])
          return row})
        let labels_and_sorted = [labels, ...sorted]
        console.log(labels_and_sorted)
        setMeterData(labels_and_sorted)
        let graphBuffer = []
        sorted.forEach((row) => {
          if(showPower)
            graphBuffer.push({time: row[2], power: row[5]})
          else
            graphBuffer.push({time: row[2], energy: row[6]})
        })
        setGraphData(graphBuffer)

        if(responseData.data.length>0)
          setRenderGraph(true)
        else
          setRenderGraph(false)

      }
      else{
        toast.error('No data to display', {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          transition: Slide
        })
      }
    }
  },[responseData])

  useEffect(()=>{
    //set yComponent to energy if showPower is false
    if(showPower){
      setYComponent("power")
      setPowerEnergyButton("Show energy")
    }
    else{
      setYComponent("energy")
      setPowerEnergyButton("Show power")
    }
  }, [showPower])
 
  return (
    <>
      <h1 className="Title text-3xl text-center">SMART ENERGY METER - ADMIN CONSOLE</h1>
      <div className="flex flex-col">
        <div className="bill-form flex flex-col mt-12 md:flex-row md:mx-72 space-x-2">
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
              className="text-center rounded-xl"
              onChange={(date) => setEndDate(date)}
              dateFormat="dd/MM/yyyy"
            />
          </div>
        </div>

        {/* Button Container */}

        <div className="bill-form flex flex-col mt-3 md:flex-row md:mx-72 space-x-2">
          <div className="flex-auto">
              <button style={buttonStyle} onClick={handleGetLogs}>Get Logs</button>
          </div>
          <div className="flex-auto">
            <button style={buttonStyle} onClick={()=> setShowPower(!showPower)}>{powerEnergyButton} graph</button>
          </div>
        </div>      

        <div className="mt-12">
          <DataTable data={meterData} />
        </div>
        {renderGraph && 
        <div className="w-lg mt-12 mx-auto md:hidden">
          <LineChart
            width={400}
            height={300}
            data={graphData}
            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
          >
            <Line type="monotone" dataKey={yComponent} stroke="#8884d8" />
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
          </LineChart>
        </div>
        }
        {renderGraph &&
        <div className="w-lg mt-12 mx-auto hidden md:block">
          <LineChart
            width={800}
            height={300}
            data={graphData}
            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
          >
            <Line type="monotone" dataKey={yComponent} stroke="#8884d8" />
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
          </LineChart>
        </div>
        }
      </div>
    </>
  );
}

const PowerInfo = (props) => {
  const { date, energy } = props;

  return (
    <div className="flex flex-row text-center mt-4 space-x-0">
      <div className="flex-auto margin">{date}</div>
      <div className="flex-auto">{energy}</div>
    </div>
  );
}; 

function DataTable({ data }) {
  if (data.length === 0) {
    return null;
  }

  return (
      <table className="w-full max-w-4xl mx-auto rounded-lg overflow-hidden border border-gray-300 shadow-md md:w-3/4 lg:w-1/2">
          <thead className="bg-gray-100">
              <tr>
                  {data[0].map((cell, index) => (
                      <th key={index} className="p-4 border-b border-gray-300 text-left font-semibold text-gray-700">
                          {cell}
                      </th>
                  ))}
              </tr>
          </thead>
          <tbody>
              {data.slice(1).map((row, rowIndex) => (
                  <tr key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="p-4 border-b border-gray-300">
                              {cell}
                          </td>
                      ))}
                  </tr>
              ))}
          </tbody>
      </table>
  );
}

//What is this??
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
const buttonStyle = {
  padding: "10px",
  width: "100%",
  backgroundColor: "#3B71CA",
  
}

export default BillForm;
