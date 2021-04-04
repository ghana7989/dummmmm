// import 'regenerator-runtime/runtime'
// const axios = require('axios')
// import { async  } from 'regenerator-runtime'
const NPKValue = document.getElementById("NPKValue")
const FarmerAddress = document.getElementById("FarmerAddress")


let finalParameters = {}
NPKValue.addEventListener("change", ({ target: { value } }) => {
    finalParameters = {
        ...finalParameters,
        npk: value
    }
})
FarmerAddress.addEventListener("change", ({ target: { value } }) => {
    finalParameters = {
        ...finalParameters,
        farmer: value
    }
})
document.getElementById("submit").addEventListener("click", async (e) => {
    e.preventDefault()
    if (!!finalParameters) {
        const url = "http://localhost:3001/transaction/broadcast"
        const { data: {
            dealerAddress,
            farmer,
            fertilizerType,
            npk, transactionId
        } } = await axios.post(url, finalParameters, { headers: { "Content-types": "application/json; charset=UTF-8" } })
        //         dealerAddress: ""
        // farmer: "hfhkdfjkfhd"
        // fertilizerType: "70-54-87"
        // npk: 7989
        // transactionId: "0ba5955c4dad48ec86cbe395964edde5"
        const dealearAddressElement = document.getElementById('dealerAddress')
        const fertilizerTypeElement = document.getElementById('fertilizerType')

        dealearAddressElement.value = dealerAddress
        fertilizerTypeElement.value = fertilizerType
        dealearAddressElement.disabled = true
        fertilizerTypeElement.disabled = true
        NPKValue.disabled = true
        FarmerAddress.disabled = true
    } else {
        alert("Fucked Up")
    }
})