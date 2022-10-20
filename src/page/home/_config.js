export const icon = {
    enterprise: <i className="fa-solid fa-industry" style={{ marginRight: 5 }} />,
    area: <i className="fa-solid fa-layer-group" style={{ marginRight: 5 }} />,
    line: <i className="fa-solid fa-sliders" style={{ marginRight: 5 }} />,
    machine: <i className="fa-solid fa-gears" style={{ marginRight: 5 }} />,
}



export const convertStt = (oee) => {
    if (oee > 75) return 'good';
    if (oee > 60) return 'medium';
    return 'bad';
}

// db.createUser({user: "rostek", pwd: "rostek@123", roles: [{role: "userAdminAnyDatabase", db: "admin"}], mechanisdb.createUser({user: "rostek", pwd: "rostek@123", roles: [{role: "userAdminAnyDatabase", db: "admin"}], mechanisms:[  
//     ...   "SCRAM-SHA-1"
//     ...  ]})
    