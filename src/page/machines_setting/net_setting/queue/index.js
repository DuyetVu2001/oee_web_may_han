import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table } from "react-bootstrap";

const baseUrl = "http://192.168.1.44:3888/machines/queue-info";

function Queue() {
  const [queue, setQueue] = useState(null);
  useEffect(() => {
    axios.get(baseUrl).then((res) => {
      setQueue(res.data.data);
    });
  },[]);
  if (!queue) return null;

  return (
    <div>
      <h1>QUEUE</h1>
      <table
        style={{
          fontFamily: "Arial, Helvetica, sans-serif",
          borderCollapse: "collapse",
          width: "100%",
        }}
      >
        <thead>
          <tr style={{backgroundColor: "#ddd",  }} >
            <th
              style={{  
                      border: "1px solid #ddd",   
                      padding: "8px",  
                      paddingTop: "12px",
                      paddingBottom: "12px",
                      textAlign: "left",
                      backgroundColor: "#9098d1",
                      color: "white"}}
            >
              Queue
            </th>
            <th
              style={{  
                      border: "1px solid #ddd",   
                      padding: "8px",  
                      paddingTop: "12px",
                      paddingBottom: "12px",
                      textAlign: "left",
                      backgroundColor: "#9098d1",
                      color: "white"}}
            >
              Members
            </th>
          </tr>
        </thead>
        <tbody>
          <tr style={{cursor:"pointer"}}>
            <td>{queue.queueLength}</td>
            <td>{queue.queueMembers}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
export default Queue;
