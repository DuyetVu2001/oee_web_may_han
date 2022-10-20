import moment from 'moment';

export const convertDataToRequest = (jsonFormat, dataInput) => {
    const dataConvert = {};
    jsonFormat.map(j => {
        if (j.type === 'date' && dataInput[j.name]) {
            dataConvert[j.name] = moment(dataInput[j.name]).format("DD-MM-YYYY")
        } else {
            dataConvert[j.name] = dataInput[j.name]
        }
    });
    return dataConvert;

}

export const convertTimestamp = (jsonFormat , dataInput) => {
    const dataConvert = {};
    jsonFormat.map(j => {
        if (j.type === 'range_picker_time' && dataInput[j.name]) {
            console.log("input" ,dataInput[j.name]);
            dataConvert.from = Math.floor(dataInput[j.name][0].valueOf()/1000)
            dataConvert.to = Math.floor(dataInput[j.name][1].valueOf()/1000)
        } else {
            dataConvert[j.name] = dataInput[j.name]
        }
    })
    return dataConvert;
}

export const convertDataToFillForm = (jsonFormat, dataInput) => {
    const dataConvert = {};
    jsonFormat.map(j => {
        if (j.type === 'date' && dataInput[j.name]) {
            dataConvert[j.name] = moment(dataInput[j.name], "DD-MM-YYYY");
        } else {
            dataConvert[j.name] = dataInput[j.name]
        }
    });
    return dataConvert;
}

