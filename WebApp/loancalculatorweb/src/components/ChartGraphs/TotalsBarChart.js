import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';



export default function  TotalsBarChart({data,axisdata}) {
  // static demoUrl = 'https://codesandbox.io/s/simple-bar-chart-tpz8r';
  // console.log(axisdata)

  const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', 'red', 'pink'];


    return (
      // <ResponsiveContainer width="100%" height="100%">
      <>
        <BarChart
          width={500}
          height={300}
          data={data}
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
          {axisdata.map((ad,index)=>{
          return(<Bar dataKey={`${ad}`} fill={colors[index+1]} key={index} />)
          })}
          {/* <Bar dataKey="pv" fill="#8884d8" />
          <Bar dataKey="uv" fill="#82ca9d" /> */}
        </BarChart>
        </>
      // {/* </ResponsiveContainer> */}
    );
 }
