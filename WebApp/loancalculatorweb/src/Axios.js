import axios from "axios";
import Cookies from "js-cookie";



const axiosFetch = ()=>{
    const userToken = localStorage.getItem("token")

    let headers ={
        "Authorization":"",
        "X-CSRFToken":"",
        'X-Requested-With': 'XMLHttpRequest',
        }

        const csrftoken = Cookies.get("csrftoken")
    
        if(userToken){
            headers["Authorization"] = `Bearer ${userToken}`
        }
        if(csrftoken){
            headers["X-CSRFToken"] = `${csrftoken}`
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