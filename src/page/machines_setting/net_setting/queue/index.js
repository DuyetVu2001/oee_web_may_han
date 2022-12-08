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
  });
  if (!queue) return null;

  return (
    <div>
      <h1>QUEUE</h1>

      {/* <Table striped bordered hover>
        <thead>
          <tr class="table-primary">
            <th scope="col">Queue</th>
            <th scope="col">Connect</th>
          </tr>
        </thead>
        <tbody>
          <tr class="table-primary">
            <td>{queue.mac_address}</td>
            <td>{queue.isConnect.toString()}</td>
          </tr>
        </tbody>
      </Table> */}
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
                      backgroundColor: "#04AA6D",
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
                      backgroundColor: "#04AA6D",
                      color: "white"}}
            >
              Connect
            </th>
          </tr>
        </thead>
        <tbody>
          <tr style={{cursor:"pointer"}}>
            <td>{queue.queueLength}</td>
            <td>{queue.isConnect.toString()}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
export default Queue;
