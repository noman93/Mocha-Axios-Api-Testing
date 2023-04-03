const axios = require('axios');
const jsonData = require('../env.json');
const fs = require('fs')
const userData = require('../users.json')
const { expect } = require('chai');
const trnxData = require('../transaction.json')


before(async () => {
    var response = await axios.post(`${jsonData.baseUrl}/user/login`,
        {
            "email": "salman@roadtocareer.net",
            "password": "1234"
        },
        {
            headers: {
                "Content-Type": "application/json",
            }
        })
    console.log(response.data)
    let token = response.data.token;
    jsonData.token = token;
    fs.writeFileSync('env.json', JSON.stringify(jsonData))

})



describe("Deposit to the Agent from system", () => {
    it("Can not Deposit to agent less then 10 tk ", async () => {
        var agent_phoneNumber = userData[userData.length - 1].phone_number;
        var response = await axios.post(`${jsonData.baseUrl}/transaction/deposit`,
            {
                "from_account": "SYSTEM",
                "to_account": agent_phoneNumber,
                "amount": 8
            },
            {

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": jsonData.token,
                    "X-AUTH-SECRET-KEY": jsonData.secretKey
                }

            }).then((res) => res.data)

        console.log(response.message);
        expect(response.message).contains("Minimum deposit amount 10 tk and maximum deposit amount 10000 tk")
    })

    it("Can not Deposit to agent more then 10000 tk ", async () => {
        var agent_phoneNumber = userData[userData.length - 1].phone_number;
        var response = await axios.post(`${jsonData.baseUrl}/transaction/deposit`,
            {
                "from_account": "SYSTEM",
                "to_account": agent_phoneNumber,
                "amount": 15000
            },
            {

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": jsonData.token,
                    "X-AUTH-SECRET-KEY": jsonData.secretKey
                }

            }).then((res) => res.data)

        console.log(response.message);
        expect(response.message).contains("Minimum deposit amount 10 tk and maximum deposit amount 10000 tk")
    })


    it("Deposit to agent successfully", async () => {
        var agent_phoneNumber = userData[userData.length - 1].phone_number;
        var response = await axios.post(`${jsonData.baseUrl}/transaction/deposit`,
            {
                "from_account": "SYSTEM",
                "to_account": agent_phoneNumber,
                "amount": 5000
            },
            {

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": jsonData.token,
                    "X-AUTH-SECRET-KEY": jsonData.secretKey
                }

            }).then((res) => res.data)

        console.log(response);
        expect(response.message).contains("Deposit successful")
    })


})
describe("Deposit to the Customer from Agent", () => {

    it("Can not Deposit to customer if agent not have enough balance", async () => {
        var agent_phoneNumber = userData[userData.length - 1].phone_number;
        var customer_phoneNumber = userData[userData.length - 3].phone_number;
        var response = await axios.post(`${jsonData.baseUrl}/transaction/deposit`,
            {
                "from_account": agent_phoneNumber,
                "to_account": customer_phoneNumber,
                "amount": 50000
            },
            {

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": jsonData.token,
                    "X-AUTH-SECRET-KEY": jsonData.secretKey
                }

            }).then((res) => res.data)

        console.log(response);
        expect(response.message).contains("Insufficient balance")
    })


    it("Deposit to customer successfully", async () => {
        var agent_phoneNumber = userData[userData.length - 1].phone_number;
        var customer_phoneNumber = userData[userData.length - 3].phone_number;
        var response = await axios.post(`${jsonData.baseUrl}/transaction/deposit`,
            {
                "from_account": agent_phoneNumber,
                "to_account": customer_phoneNumber,
                "amount": 2000
            },
            {

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": jsonData.token,
                    "X-AUTH-SECRET-KEY": jsonData.secretKey
                }

            }).then((res) => res.data)

        let trnxId_value = response.trnxId;
        trnxData.trnxId = trnxId_value;


        fs.writeFileSync('transaction.json', JSON.stringify(trnxData))

        console.log(response);
        expect(response.message).contains("Deposit successful")
    })
})
describe("Check balance of customer", () => {
    it("Can not  Check balance by invalid  customer number", async () => {
        var customer_phoneNumber = "258465646";
        try {
            var response = await axios.get(`${jsonData.baseUrl}/transaction/balance/${customer_phoneNumber}`,
                {

                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": jsonData.token,
                        "X-AUTH-SECRET-KEY": jsonData.secretKey
                    }

                })
            
        }
        catch (error) {
            //console.log(error);
            console.log(error.response.data.message);
            expect(error.response.data.message).contains("User not found")
            expect(error).to.exist;

        }
    })





    it("Check balance of customer", async () => {
        var customer_phoneNumber = userData[userData.length - 3].phone_number;
        var response = await axios.get(`${jsonData.baseUrl}/transaction/balance/${customer_phoneNumber}`,
            {

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": jsonData.token,
                    "X-AUTH-SECRET-KEY": jsonData.secretKey
                }

            }).then((res) => res.data)

        console.log(response.message);
        expect(response.message).contains("User balance")
    })

})
describe("Check statement by trnxId ", () => {
    it("Can not  Check statement by invalid trnxId of customer", async () => {
        var customer_trnxId = "TXN93812";
        try {
            var response = await axios.get(`${jsonData.baseUrl}/transaction/search/${customer_trnxId}`,
                {

                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": jsonData.token,
                        "X-AUTH-SECRET-KEY": jsonData.secretKey
                    }

                })

        }
        catch (error) {
            //console.log(error);
            console.log(error.response.data.message);
            expect(error.response.data.message).contains("Transaction not found")
            expect(error).to.exist;

        }
    })



    it("Check statement by trnxId of customer", async () => {
        var customer_trnxId = trnxData.trnxId;
        var response = await axios.get(`${jsonData.baseUrl}/transaction/search/${customer_trnxId}`,
            {

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": jsonData.token,
                    "X-AUTH-SECRET-KEY": jsonData.secretKey
                }

            }).then((res) => res.data)

        console.log(response.message);
        expect(response.message).contains("Transaction list")
    })


})
describe("Withdraw by customer ", () => {
    it("Can not Withdraw  if customer not have enough balance ", async () => {
        var agent_phoneNumber = userData[userData.length - 1].phone_number;
        var customer_phoneNumber = userData[userData.length - 3].phone_number;
        var response = await axios.post(`${jsonData.baseUrl}/transaction/withdraw`,
            {
                "from_account": customer_phoneNumber,
                "to_account": agent_phoneNumber,
                "amount": 20000
            },
            {

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": jsonData.token,
                    "X-AUTH-SECRET-KEY": jsonData.secretKey
                }

            }).then((res) => res.data)




        console.log(response.message);
        expect(response.message).contains("Insufficient balance")
    })


    it("Withdraw  by customer successfully ", async () => {
        var agent_phoneNumber = userData[userData.length - 1].phone_number;
        var customer_phoneNumber = userData[userData.length - 3].phone_number;
        var response = await axios.post(`${jsonData.baseUrl}/transaction/withdraw`,
            {
                "from_account": customer_phoneNumber,
                "to_account": agent_phoneNumber,
                "amount": 1000
            },
            {

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": jsonData.token,
                    "X-AUTH-SECRET-KEY": jsonData.secretKey
                }

            }).then((res) => res.data)

        var currentBalance_value = response.currentBalance;
        trnxData.currentBalance = currentBalance_value;


        fs.writeFileSync('transaction.json', JSON.stringify(trnxData))

        console.log(response);
        let currentBalance = trnxData.currentBalance.toString()
        expect(response.message).contains("Withdraw successful")
        expect(currentBalance).contains("990")

    })

})
describe(" Send Money to another customer ", () => {



    it("Can not  Send money to another customer if not have enough balance ", async () => {
        var customer_phoneNumber1 = userData[userData.length - 3].phone_number;
        var customer_phoneNumber2 = userData[userData.length - 2].phone_number;
        var response = await axios.post(`${jsonData.baseUrl}/transaction/sendmoney`,
            {
                "from_account": customer_phoneNumber1,
                "to_account": customer_phoneNumber2,
                "amount": 20000
            },
            {

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": jsonData.token,
                    "X-AUTH-SECRET-KEY": jsonData.secretKey
                }

            }).then((res) => res.data)

        let currentBalance_value = response.currentBalance;
        trnxData.currentBalance = currentBalance_value;


        fs.writeFileSync('transaction.json', JSON.stringify(trnxData))

        console.log(response);
        expect(response.message).contains("Insufficient balance")
    })





    it("Send money to another customer ", async () => {
        var customer_phoneNumber1 = userData[userData.length - 3].phone_number;
        var customer_phoneNumber2 = userData[userData.length - 2].phone_number;
        var response = await axios.post(`${jsonData.baseUrl}/transaction/sendmoney`,
            {
                "from_account": customer_phoneNumber1,
                "to_account": customer_phoneNumber2,
                "amount": 500
            },
            {

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": jsonData.token,
                    "X-AUTH-SECRET-KEY": jsonData.secretKey
                }

            }).then((res) => res.data)

        var currentBalance_value = response.currentBalance;
        trnxData.currentBalance = currentBalance_value;


        fs.writeFileSync('transaction.json', JSON.stringify(trnxData))

        console.log(response.message);
        let currentBalance = trnxData.currentBalance.toString()

        expect(response.message).contains("Send money successful")
        expect(currentBalance).contains("485")
    })
})
describe("Check customer statement", () => {

    it("Can not  Check statement by invalid phone number of customer", async () => {
        var customer_phone_number = "01365494666";
        try {
            var response = await axios.get(`${jsonData.baseUrl}/transaction/statement/${customer_phone_number}`,
                {

                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": jsonData.token,
                        "X-AUTH-SECRET-KEY": jsonData.secretKey
                    }

                })

        }
        catch (error) {
            //console.log(error);
            console.log(error.response.data.message);
            expect(error.response.data.message).contains("User not found")
            expect(error).to.exist;

        }
    })



    it("Check customer statement", async () => {
        var customer_phone_number = userData[userData.length - 3].phone_number;
        var response = await axios.get(`${jsonData.baseUrl}/transaction/statement/${customer_phone_number}`,
            {

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": jsonData.token,
                    "X-AUTH-SECRET-KEY": jsonData.secretKey
                }

            }).then((res) => res.data)

        console.log(response.message);
        expect(response.message).contains("Transaction list")
    })










})