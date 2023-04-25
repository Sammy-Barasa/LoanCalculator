import axios from "axios";
// import Cookies from "js-cookie";


const axiosFetch = ()=>{

    let headers ={
        'X-Requested-With': 'XMLHttpRequest',
        }


    // console.log(headers)
    const axiosInstance = axios.create({
        // "https://loancalculator-production.up.railway.app/"
        // http://127.0.0.1:8000
        // https://loancalculator-production.up.railway.app/
        // http://loancalculator.zeabur.app/calc/banks/
        baseURL:"https://loancalculator.zeabur.app/",
        // credentials: "same-origin",
        headers:headers,
    })
    axiosInstance.defaults.headers.common.accept = 'application/json'
    return  axiosInstance
}

export default axiosFetch