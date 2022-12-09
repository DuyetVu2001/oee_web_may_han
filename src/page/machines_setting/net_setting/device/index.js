import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table } from "react-bootstrap";

const baseUrl = "http://192.168.1.44:3888/machines/net-setting";

function Device() {
  const [device, setDevice] = useState(null);
  useEffect(() => {
    axios.get(baseUrl).then((res) => {
      setDevice(res.data.data);
    });
  },[]);
  if (!device) return null;

  return (
    <div>
      <h1>DEVICE</h1>

      {/* <Table striped bordered hover>
        <thead>
          <tr class="table-primary">
            <th scope="col">Queue</th>
            <th scope="col">Connect</th>
          </tr>
        </thead>
        <tbody>
          <tr class="table-primary">
            <td>{device.mac_address}</td>
            <td>{device.isConnect.toString()}</td>
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
                      backgroundColor: "#d19e45",
                      color: "white"}}
            >
              Địa chỉ Ip
            </th>
            <th
              style={{  
                      border: "1px solid #ddd",   
                      padding: "8px",  
                      paddingTop: "12px",
                      paddingBottom: "12px",
                      textAlign: "left",
                      backgroundColor: "#d19e45",
                      color: "white"}}
            >
              Địa chỉ Mac
            </th>
            <th
              style={{  
                      border: "1px solid #ddd",   
                      padding: "8px",  
                      paddingTop: "12px",
                      paddingBottom: "12px",
                      textAlign: "left",
                      backgroundColor: "#d19e45",
                      color: "white"}}
            >
              Internet Connections
            </th>
          </tr>
        </thead>
        <tbody>
          <tr style={{cursor:"pointer"}}>
            <td>{device.ip}</td>
            <td>{device.mac_address}</td>
            <td>{device.isConnect.toString()}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
export default Device;
