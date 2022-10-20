export const convert2StringQuery = (obj) => {
    var str = [];
    for (var p in obj)
        if (obj.hasOwnProperty(p) && obj[p] !== undefined && obj[p] !== null) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
    return str.join("&");
}