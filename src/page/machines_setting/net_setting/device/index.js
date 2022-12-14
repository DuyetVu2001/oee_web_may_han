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
      {/* <h1>DEVICE</h1> */}
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
              Địa chỉ IP
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
              Địa chỉ MAC
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
              Trạng thái kết nối
            </th>
          </tr>
        </thead>
        <tbody>
          <tr style={{cursor:"pointer"}}>
            <td>{device.ip}</td>
            <td>{device.mac_address}</td>
            {/* <td>{device.isConnect.toString()}</td> */}
            <td>{device.isConnect.toString() === "true" ? "Đã kết nối" : "Mất kết nối"}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
export default Device;
