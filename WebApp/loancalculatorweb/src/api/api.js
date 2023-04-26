import axiosFetch from '../Axios'

export const RegisterUser = (userData,setData,setError)=> {
    
    axiosFetch().post('auth/register/',userData)
    .then((response)=>{
        console.log(response)
        setData(response)
    }).catch((error)=>{
        console.log(error)  
        setError(error)
    })
}

export const LoginUser = (userData,setData,setError)=> {

    axiosFetch().post('auth/login/',userData)
    .then((response)=>{
        console.log(response.data)
        setData(response)
        // console.log(response.status)
    }).catch((error)=>{
        console.log(error)
        setError(error)  
    })
}


export const CreateBank = (BankData)=> {

    axiosFetch().post('calc/banks/',BankData)
    .then((response)=>{
        console.log(response.data)
    
    })
    .catch((error)=>{
        console.log(error) 
    })
}

export const GetBank = (setLoading)=> {
    setLoading(true)
    axiosFetch().get('calc/banks/')
    .then((response)=>{
        console.log(response.data)
        setLoading(false)
    })
    .catch((error)=>{
        console.log(error) 
        setLoading(false)
    })
}

export const CreateLoan= (LoanData,setLoading)=> {
    setLoading(true)
    axiosFetch().post('calc/loans/create/',LoanData)
    .then((response)=>{
        console.log(response.data)
        setLoading(false)
    })
    .catch((error)=>{
        console.log(error)
        setLoading(false) 
    })
}

// http://loancalculator.zeabur.app/calc/loanproducts/create/
export const GetLoanProduct= (setData)=> {
    axiosFetch().get('calc/loanproducts/')
    .then((response)=>{
        console.log(response.data)
        setData(response.data)
    })
    .catch((error)=>{
        console.log(error) 
        setData(error)
    })
}

export const CreateLoanProduct= (LoanData,setLoading)=> {

    axiosFetch().post('calc/loans/create/',LoanData)
    .then((response)=>{
        console.log(response.data)
    
    })
    .catch((error)=>{
        console.log(error) 
    })
}

// http://loancalculator.zeabur.app/calc/evaluate/

export const EvaluateLoanProduct= (LoanProductData,setLoading)=> {
    setLoading(true)
    axiosFetch().post('calc/evaluate/',LoanProductData)
    .then((response)=>{
        console.log(response.data)
        setLoading(false)
    
    })
    .catch((error)=>{
        console.log(error) 
        setLoading(false)
    })
}
