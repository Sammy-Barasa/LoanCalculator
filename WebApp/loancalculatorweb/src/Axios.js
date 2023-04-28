import axios from "axios";
import Cookies from "js-cookie";



const axiosFetch = ()=>{
    

    let headers ={
        "Authorization":"",
        "X-CSRFToken":"",
        'X-Requested-With': 'XMLHttpRequest',
        }

        
    // console.log(headers)
    const axiosInstance = axios.create({
        // "https://loancalculator-production.up.railway.app/"
        // http://127.0.0.1:8000
        // https://loancalculator-production.up.railway.app/
        // http://loancalculator.zeabur.app/calc/banks/
        
        baseURL:"http://127.0.0.1:8000/",
        // baseURL:"https://loancalculator.zeabur.app/",
        // credentials: "same-origin",
        headers:headers,
    })
    axiosInstance.defaults.headers.common.accept = 'application/json'
    axiosInstance.interceptors.request.use(function (config) {
        // Do something before request is sent
        console.log(config)
        console.log(config.url)
        if(!config.url.includes("register")){
            if(!config.url.includes("login")){
            const userToken = localStorage.getItem("token")
            const csrftoken = Cookies.get("csrftoken")
    
            if(userToken){
                config.headers["Authorization"] = `Bearer ${userToken}`
            }
            if(csrftoken){
                config.headers["X-CSRFToken"] = `${csrftoken}`
            }
        }
        }
        console.log(config)
        return config;
      }, function (error) {
        // Do something with request error
        return Promise.reject(error);
      });
    return  axiosInstance
}

export default axiosFetch