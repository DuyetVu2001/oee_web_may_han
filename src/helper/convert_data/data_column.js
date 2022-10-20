import moment from 'moment';
export const convertColumn = (columnData) => {
     return columnData.map(c => {
        if(c.type === 'date_time'){
            c.render = (val) => {
                return moment(val*1000).format('HH:mm DD/MM/YYYY')
            }
        }
        return c;
    })
}

export const convertColumn2 = (columnData) => {
    return columnData.map(c => {
       if(c.type === 'date_time'){
           c.render = (val) => {
               return moment(val).format('HH:mm DD/MM/YYYY')
           }
       }
       return c;
   })
}