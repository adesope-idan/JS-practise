let loginSection = document.querySelector("#loginSection")
let appSection = document.querySelector("#servicesSection")
let loginBtn = document.querySelector("#loginBtn")
let modal = document.querySelector("#modal")

//this is used to track who is curently logged in
let currUser = null;

let accounts = [
  {
    accNumber: 2,
    name: "Adesope",
    password: "2",
    balance: 100000
  },
  {
    accNumber: 3920184839,
    name: "david",
    password: "david112",
    balance: 300000
  },
  {
    accNumber: 9403853928,
    name: "Esther",
    password: "esther99",
    balance: 70000
  },
  {
    accNumber: 1929048763,
    name: "Idan",
    password: "Idan133",
    balance: 150000
  },
  {
    accNumber: 2049873476,
    name: "Joseph",
    password: "joe112",
    balance: 250000
  }
]

//get all modal sections
let modalSections = modal.querySelectorAll("section")



loginBtn.addEventListener("click", function (e) {

  //step 1: Get the credentials the user entered
  let accNumberField = document.querySelector("input#accNo")
  let passwordField = document.querySelector("#password")
  //step 2: validate credentials
  let res = login(accNumberField.value, passwordField.value)

  //step 3: incorrect detail, notify the user and stop further processing of the function
  if (res == false) {
    alert("incorrect username or password...")
    //stop further processing of the function
    return 
  }

  //step 4: Credential are valid, save the customer object by updating the currently logged in user
  currUser = res

  //step 5: Update the user details in the user/app info section in the top navigation bar
  let userInfoName = document.querySelector("#userInfo_name")

  userInfoName.textContent = currUser.name
  updateDisplayBalance(currUser.balance)



  //step : navigate to the home page
  //hide the login section
  loginSection.classList.add("hidden")
  //show the homepage
  appSection.classList.remove("hidden")
})





let btnOpenDepositModal = document.querySelector("#btnOpenDepositModal")
btnOpenDepositModal.addEventListener("click", function (e) {

  //get the transfer section
  let depositModalSection = getModalSection("depositModalSection")

  openModal("Deposit Money", depositModalSection)
})


let btnOpenTransferModal = document.querySelector("#btnOpenTransferModal")
btnOpenTransferModal.addEventListener("click", function (e) {

  //get the transfer section
  let transferModalSection = getModalSection("transferModalSection")

  openModal("Transfer Money", transferModalSection)
})

let btnOpenWithdrawModal = document.querySelector("#btnOpenWithdrawModal")
btnOpenWithdrawModal.addEventListener("click", function (e) {

  //get thewithdrawal section
  let withdrawalModalSection = getModalSection("withdrawModalSection")

  //open the modal box and make the withdrawal section visible
  openModal("Withdraw Money", withdrawalModalSection)
})

let btnOpenBuyAirtimeModal = document.querySelector("#btnOpenBuyAirtimeModal")
btnOpenBuyAirtimeModal.addEventListener("click",function(e) {

  //get the buy airtime section
  let BuyAirtimeModalSection = getModalSection("buyAirtimeModalSection")

  //open the modal box and make the buy airtime section visible
  openModal("Buy Airtime", BuyAirtimeModalSection)
})

let btnOpenChangePinModal = document.querySelector("#btnOpenChangePinModal")
btnOpenChangePinModal.addEventListener("click", function (e) {
  
  let changePinModalSection = getModalSection("changePinModalSection")
  openModal("Change Pin", changePinModalSection)
})





let btnWithdraw = modal.querySelector("#btnWithdraw")
btnWithdraw.addEventListener("click", function (e) {

  //get the amount and account number the user entered
  let amountToWithdraw = modal.querySelector("#txtAmountToWithdraw")
  let txtAccNo = modal.querySelector("#txtAccNo")

  //if the amount is available, validate the withdrawal process
  let validated = withdraw(amountToWithdraw.value)

  closeModal()

  if (validated == true) {
    alert("Withdrawal successful")
  }

})


let btnDeposit = modal.querySelector("#btnDeposit")
btnDeposit.addEventListener("click", function (e) {
  let amountToDeposit = modal.querySelector("#txtAmountToDeposit")

  deposit(amountToDeposit.value)

  closeModal()
})


let btnTransfer = modal.querySelector("#btnTransfer")
btnTransfer.addEventListener("click", function (e) {
  let amountToTransfer = modal.querySelector("#txtAmountToTransfer")
  let accNoToTransferTo = modal.querySelector("#txtAccNoToTransferTo")

  let val = transfer(amountToTransfer.value, accNoToTransferTo.value)
  if (val == true) {
    closeModal()
    alert("transfer successful")
  }
})

let btnBuyAirtime = modal.querySelector("#btnBuyAirtime")
btnBuyAirtime.addEventListener("click", function (e) {
  let amountOfAirtimeToBuy = modal.querySelector("#txtAmountOfAirtimeToBuy")
  let numberToBuyAirtimeTo = modal.querySelector("#txtNumberToBuyAirtimeTo")

  let val = buyAirtime(amountOfAirtimeToBuy.value)
  if (val == true) {
    closeModal()
    alert("Airtime bought successfully")
  }
})

let btnChangePin = modal.querySelector("#btnChangePin")
btnChangePin.addEventListener("click", function (e) {
  
  //get the value of the password entered
  let currPassword = modal.querySelector("#txtcurrPassword")
  let newPassword = modal.querySelector("#txtNewPassword")

  let val = changePin(currPassword.value, newPassword.value)
  if (val == true) {
    alert("Pin changed sucessfully..")
    closeModal()
    appSection.classList.add("hidden")
    loginSection.classList.remove("hidden")
  }
  else{
    alert("incorrect password..")
  }

})

let payBills = document.querySelector("#pay-bills")
payBills.addEventListener("click", function (e) {
  payBill()
})

let btncloseModal = document.querySelector(".modal-close")
btncloseModal.addEventListener("click", function (e) {
  closeModal()
})
























function login(accNumber, password) {
  for(let i = 0; i < accounts.length; i++){
    if (accNumber == accounts[i].accNumber && password == accounts[i].password) {
      return accounts[i]
    }

    //if details entered doesn't match, and it already gone through all the objects
    if(i == accounts.length - 1){
      return false;
    }
  }
}

function withdraw(amountEntered) {
  //check if the amount the user entered is available in the currently logged in user account
  if (amountEntered <= currUser.balance) {
    //reduce the available balance  
    deductCustomerBalance(currUser.accNumber, amountEntered)
    updateDisplayBalance(currUser.balance)
    return true
  }
  else{
    alert("insufficient funds...")
  }

}

function deposit(amount) {
  
  //add to the available balance
  let res = topUpCustomerBalance(currUser.accNumber, amount)
  if (res == false) {
    alert("Incorrect account number")
    return
  }
  updateDisplayBalance(currUser.balance)
  
}

function transfer(amountEntered, accountNo) {
  //check if the amount the user entered is available in the currently logged in user account
  if (amountEntered <= currUser.balance) {
    //add to the other user balance
    let res = topUpCustomerBalance(accountNo, amountEntered)

    if (res == false) {
      alert("Incorrect account number")
      return
    }
    
    //reduce the available balance of the current user 
    deductCustomerBalance(currUser.accNumber, amountEntered) 
    //update the other user balance
    updateDisplayBalance(currUser.balance)

    return true
  }
  else{
    alert("insufficient funds...")
  } 
}

function buyAirtime(amount) {
  //check if the amount the user entered is available in the currently logged in user account
  if (amount <= currUser.balance && amount > 0) {
    //reduce the available balance  
    deductCustomerBalance(currUser.accNumber, amount)
    updateDisplayBalance(currUser.balance)
    return true
  }
  else{
    alert("insufficient funds...")
  }
}
function changePin(currPassword, newPassword) {
  let passwordChanged = false
  //check if the password entered is the current one.
  if (currPassword == currUser.password) {
    passwordChanged = true
    //update the password with the new password
    currUser.password = newPassword
    return true
  }
  if (passwordChanged == false) {
    return false
  }
}
function payBill() {
  alert("This feature is still in progress, try again later...")
}

function getModalSection(modalSectionIdToFind) {
  let getModalSectionElement = null;
  
  for (let i = 0; i < modalSections.length; i++) {
    //check that the
    if(modalSections[i].id == modalSectionIdToFind){
      //assign the item/element
       getModalSectionElement = modalSections[i];
       break
    } 
  }

  return getModalSectionElement
}

function updateDisplayBalance(newBalance) {
  let userBalance = document.querySelector("#userInfo_balance")

  userBalance.textContent =  newBalance 
}

function topUpCustomerBalance(customerAccNo, amount) {
  let foundUser = false
  for (let i = 0; i < accounts.length; i++) {
    //check if the account number entered is a verified ABZ account number
    if (customerAccNo == accounts[i].accNumber) {
      foundUser = true
      //update the balance of the account 
      currUser.balance = currUser.balance + Number(amount)
    }
  }

  if (foundUser == false) {
    return false
  }
}


function deductCustomerBalance(customerAccNo, amountToDeduct) {
  let foundUser = false
  for (let i = 0; i < accounts.length; i++) {
    foundUser = true
    //check if the account number entered is a verified ABZ account number
    if (customerAccNo == accounts[i].accNumber) {
      //update the balance of the account 
      currUser.balance = currUser.balance - Number(amountToDeduct)
    }
  }
  if (foundUser == false) {
    return false
  }
}


function openModal(title, visibleSectionElement = null) {
  //update the title of the modal
  let titleElement = modal.querySelector(".title")
  titleElement.textContent = title

  //hide all the sections
  for (let i = 0; i < modalSections.length; i++) {
    modalSections[i].classList.add("hidden")
  }

  // check if "visible section element" holds an element
  if (visibleSectionElement != undefined) {
    //show a section in the modal
    visibleSectionElement.classList.remove("hidden")
  }
  

  //show the modal by removing the hidden class
  modal.classList.remove("hidden")
}

function closeModal() {
  modal.classList.add("hidden")
}
