/** @format */

// import 'regenerator-runtime/runtime'
// const axios = require('axios')
// import { async  } from 'regenerator-runtime'
const NPKValue = document.getElementById('NPKValue')
const FarmerAddress = document.getElementById('FarmerAddress')
const FertilizerQuantity = document.getElementById('FertilizerQuantity')
const Land = document.getElementById('Land')
const dealerAddressElement = document.getElementById('dealerAddress')
const fertilizerTypeElement = document.getElementById('fertilizerType')

dealerAddressElement.disabled = true
fertilizerTypeElement.disabled = true
let finalParameters = {}
Land.addEventListener('change', e => {
	// console.log(e.target.value)
	FertilizerQuantity.value = Number(e.target.value) * 50
	FertilizerQuantity.disabled = true
	finalParameters = {
		...finalParameters,
		fertilizerQuantity: FertilizerQuantity.value,
		land: e.target.value,
	}
})

NPKValue.addEventListener('change', ({target: {value}}) => {
	finalParameters = {
		...finalParameters,
		npk: value,
	}
})
FarmerAddress.addEventListener('change', ({target: {value}}) => {
	finalParameters = {
		...finalParameters,
		farmer: value,
	}
})

document.getElementById('submit').addEventListener('click', async e => {
	e.preventDefault()
	if (!!finalParameters) {
		const url = 'http://localhost:3001/transaction/broadcast'
		const {
			data: {dealerAddress, farmer, fertilizerType, npk, transactionId},
		} = await axios.post(url, finalParameters, {
			headers: {'Content-types': 'application/json; charset=UTF-8'},
		})
		//         dealerAddress: ""
		// farmer: "hfhkdfjkfhd"
		// fertilizerType: "70-54-87"
		// npk: 7989
		// transactionId: "0ba5955c4dad48ec86cbe395964edde5"

		dealerAddressElement.value = dealerAddress
		fertilizerTypeElement.value = fertilizerType

		NPKValue.disabled = true
		FarmerAddress.disabled = true
	} else {
		alert('Fucked Up')
	}
})
