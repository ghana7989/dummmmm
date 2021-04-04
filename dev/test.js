const Blockchain = require('./Blockchain.js');
const Bitcoin=new Blockchain();
const bc1={

"chain": [
    {
    "index": 1,
    "timestamp": 1602432601588,
    "transactions": [],
    "nonce": 100,
    "hash": "0",
    "previousBlockhash": "0"
    },
    {
    "index": 2,
    "timestamp": 1602432645408,
    "transactions": [],
    "nonce": 18140,
    "hash": "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100",
    "previousBlockhash": "0"
    },
    {
    "index": 3,
    "timestamp": 1602432648544,
    "transactions": [
    {
    "amount": 12.5,
    "sender": "00",
    "recipient": "37724b400bdc11eb969469b1774188fd",
    "transactionId": "5198ef600bdc11eb969469b1774188fd"
    }
    ],
    "nonce": 23353,
    "hash": "0000140664894c75404a7303e6fafccefec92edca9e3b4ad3ff8a08341804acb",
    "previousBlockhash": "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100"
    },
    {
    "index": 4,
    "timestamp": 1602432652724,
    "transactions": [
    {
    "amount": 12.5,
    "sender": "00",
    "recipient": "37724b400bdc11eb969469b1774188fd",
    "transactionId": "536fd2400bdc11eb969469b1774188fd"
    }
    ],
    "nonce": 45797,
    "hash": "00000e63aa3e96395a544e603edbb8ca0d8c8a460550f18366bb6e9dbef08692",
    "previousBlockhash": "0000140664894c75404a7303e6fafccefec92edca9e3b4ad3ff8a08341804acb"
    },
    {
    "index": 5,
    "timestamp": 1602432709103,
    "transactions": [
    {
    "amount": 12.5,
    "sender": "00",
    "recipient": "37724b400bdc11eb969469b1774188fd",
    "transactionId": "55ed7c700bdc11eb969469b1774188fd"
    },
    {
    "amount": 3100,
    "sender": "NTLUCK73ERGBD7UDAKDBAD8DH",
    "recipient": "EVERFUCKTWIUDHIUKHDKNJXCNAC",
    "transactionId": "6a6a8ad00bdc11eb969469b1774188fd"
    },
    {
    "amount": 3700,
    "sender": "NTLUCK73ERGBD7UDAKDBAD8DH",
    "recipient": "EVERFUCKTWIUDHIUKHDKNJXCNAC",
    "transactionId": "6f9ca6a00bdc11eb969469b1774188fd"
    },
    {
    "amount": 100,
    "sender": "NTLUCK73ERGBD7UDAKDBAD8DH",
    "recipient": "EVERFUCKTWIUDHIUKHDKNJXCNAC",
    "transactionId": "72c425600bdc11eb969469b1774188fd"
    }
    ],
    "nonce": 5127,
    "hash": "0000cc933af274ae1184cc34451a53c3c9ab34db05219182833672049ff9ed1e",
    "previousBlockhash": "00000e63aa3e96395a544e603edbb8ca0d8c8a460550f18366bb6e9dbef08692"
    },
    {
    "index": 6,
    "timestamp": 1602432781133,
    "transactions": [
    {
    "amount": 12.5,
    "sender": "00",
    "recipient": "37724b400bdc11eb969469b1774188fd",
    "transactionId": "778864300bdc11eb969469b1774188fd"
    },
    {
    "amount": 200,
    "sender": "NTLUCK73ERGBD7UDAKDBAD8DH",
    "recipient": "EVERFUCKTWIUDHIUKHDKNJXCNAC",
    "transactionId": "8af1dfb00bdc11eb969469b1774188fd"
    },
    {
    "amount": 300,
    "sender": "NTLUCK73ERGBD7UDAKDBAD8DH",
    "recipient": "EVERFUCKTWIUDHIUKHDKNJXCNAC",
    "transactionId": "951edab00bdc11eb969469b1774188fd"
    },
    {
    "amount": 400,
    "sender": "NTLUCK73ERGBD7UDAKDBAD8DH",
    "recipient": "EVERFUCKTWIUDHIUKHDKNJXCNAC",
    "transactionId": "99cb24b00bdc11eb969469b1774188fd"
    }
    ],
    "nonce": 68402,
    "hash": "000001d66965896753a739d5b5c43396b2f033d41f4b8216297227059aaeb6c1",
    "previousBlockhash": "0000cc933af274ae1184cc34451a53c3c9ab34db05219182833672049ff9ed1e"
    }
],
"pendingTransactions": [
{
"amount": 12.5,
"sender": "00",
"recipient": "37724b400bdc11eb969469b1774188fd",
"transactionId": "a27725000bdc11eb969469b1774188fd"
}
],
"currentNodeUrl": "http://localhost:3001",
"networkNodes": []
};
    

console.log('VALID: ',Bitcoin.chainIsValid(bc1.chain));