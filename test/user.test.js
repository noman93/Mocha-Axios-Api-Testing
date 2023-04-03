const { expect } = require('chai');
const axios = require('axios');
const jsonData = require('../env.json');
const fs = require('fs')
const { faker } = require('@faker-js/faker')
var rand = require('../generateRandomNumber')


const userData = require('../users.json')

describe("User can do login", () => {

    it("User cannot login with invalid email", async () => {
        try {
            var response = await axios.post(`${jsonData.baseUrl}/user/login`,
                {
                    "email": "salman@roadtocareer",
                    "password": "1234"
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    }
                })
        }
        catch (error) {
            //console.log(error);
            
            console.log(error.response.data.message);
            expect(error.response.data.message).contains("User not found");
            expect(error).to.exist;
            
        }
        

    })

    it("User cannot login with invalid password", async () => {
        try {
            var response = await axios.post(`${jsonData.baseUrl}/user/login`,
                {
                    "email": "salman@roadtocareer.net",
                    "password": "123"
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    }

                })
        }
        catch (error) {
            //console.log(error);
            console.log(error.response.data.message);
            expect(error.response.data.message).contains("Password incorrect")
            expect(error).to.exist;
            
        }
        

    })

    it("User can login successfully with valid creds", async () => {
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
        expect(response.data.message).contains("Login successfully")
        let token = response.data.token;
        jsonData.token = token;
        fs.writeFileSync('env.json', JSON.stringify(jsonData))

    })
})

describe("Create Customer", () => {    

    it("Admin cannot create new Customer with existing creds ", async () => {
        var response = await axios.post(`${jsonData.baseUrl}/user/create`, {
            "name": "Dr. Alison Grady",
            "email": "user37808@test.com",
            "password": "1234",
            "phone_number": "01506790840",
            "nid": "123437808",
            "role": "Customer"
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": jsonData.token,
                "X-AUTH-SECRET-KEY": jsonData.secretKey
            }
        }).then((res) => res.data)

        expect(response.message).contains('User already exists')
        

    })



    var customer_name = faker.name.fullName();
    var customer_email = faker.internet.email().toLowerCase();
    var customer_phone_number = "01509" + rand(100000, 999999);
    it("Admin can create new Customer", async () => {
        var response = await axios.post(`${jsonData.baseUrl}/user/create`, {
            "name": customer_name,
            "email": customer_email,
            "password": "1234",
            "phone_number": customer_phone_number,
            "nid": "123456789",
            "role": "Customer"
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": jsonData.token,
                "X-AUTH-SECRET-KEY": jsonData.secretKey
            }
        }).then((res) => res.data)
        

        var customer1_id = response.user.id;
        var customer1_name = response.user.name;
        var customer1_email = response.user.email;
        var customer1_phone_number = response.user.phone_number;
        var customer1_role = response.user.role;

        var newCustomer = {
            id: customer1_id,
            name: customer1_name,
            email: customer1_email,
            phone_number: customer1_phone_number,
            role: customer1_role
        }

        userData.push(newCustomer);

        fs.writeFileSync('users.json', JSON.stringify(userData))
        console.log("Saved!")
        expect(response.message).contains("User created")
    })


    var _name2 = faker.name.fullName();
    var _email2 = faker.internet.email().toLowerCase();
    var _phone_number2 = "01509" + rand(100000, 999999);
    it("Admin can create Another new Customer", async () => {
        var response = await axios.post(`${jsonData.baseUrl}/user/create`, {
            "name": _name2,
            "email": _email2,
            "password": "1234",
            "phone_number": _phone_number2,
            "nid": "123456789",
            "role": "Customer"
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": jsonData.token,
                "X-AUTH-SECRET-KEY": jsonData.secretKey
            }
        }).then((res) => res.data)
        

        var customer2_id = response.user.id;
        var customer2_name = response.user.name;
        var customer2_email = response.user.email;
        var customer2_phone_number = response.user.phone_number;
        var customer2_role = response.user.role;

        var newCustomer2 = {
            id: customer2_id,
            name: customer2_name,
            email: customer2_email,
            phone_number: customer2_phone_number,
            role: customer2_role
        }

        userData.push(newCustomer2);

        fs.writeFileSync('users.json', JSON.stringify(userData))
        console.log("Saved!")
        expect(response.message).contains("User created")
    })

})    

describe("Create Agent", () => { 

    it("Admin cannot create new Agent with existing creds ", async () => {
        var response = await axios.post(`${jsonData.baseUrl}/user/create`, {
            "name": "Test Agent 1",
            "email": "agent47285@test.com",
            "password": "1234",
            "phone_number": "01702363453",
            "nid": "123456789",
            "role": "Agent"
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": jsonData.token,
                "X-AUTH-SECRET-KEY": jsonData.secretKey
            }
        }).then((res) => res.data)

        expect(response.message).contains('User already exists')
        
    })

    var _name = faker.name.fullName();
    var _email = faker.internet.email().toLowerCase();
    var _phone_number = "01709" + rand(100000, 999999);
    it("Admin can create new Agent", async () => {
        var response = await axios.post(`${jsonData.baseUrl}/user/create`, {
            "name": _name,
            "email": _email,
            "password": "1234",
            "phone_number": _phone_number,
            "nid": "123456789",
            "role": "Agent"
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": jsonData.token,
                "X-AUTH-SECRET-KEY": jsonData.secretKey
            }
        }).then((res) => res.data)
        

        var agent_id = response.user.id;
        var agent_name = response.user.name;
        var agent_email = response.user.email;
        var agent_phone_number = response.user.phone_number;
        var agent_role = response.user.role;

        var newAgent = {
            id: agent_id,
            name: agent_name,
            email: agent_email,
            phone_number: agent_phone_number,
            role: agent_role
        }

        userData.push(newAgent);

        fs.writeFileSync('users.json', JSON.stringify(userData))
        expect(response.message).contains("User created")
        console.log("Saved!")
    })

})    

describe("Search Customer By phone number", () => { 


    it("Search Customer By invalid phone number", async () => {
        try {
            var response = await axios.get(`${jsonData.baseUrl}/user/search/phonenumber/258465646`,
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
            //console.log(response.message);
            expect(error.response.data.message).contains("User not found")
            expect(error).to.exist;
            //expect(error.response.data.message).contains("User not found")
        }
        

    })

    it("Search by the Customer phone number", async () => {
        var customer_phoneNumber = userData[userData.length - 3].phone_number;
        var response = await axios.get(`${jsonData.baseUrl}/user/search/phonenumber/${customer_phoneNumber}`,
            {

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": jsonData.token,
                    "X-AUTH-SECRET-KEY": jsonData.secretKey
                }

            }).then((res) => res.data)

        console.log(response.message);
        expect(response.message).contains("User found")
    })
})