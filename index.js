let loginSection = document.querySelector("#loginSection")
let appSection = document.querySelector("#servicesSection")
let loginBtn = document.querySelector("#loginBtn")
let modal = document.querySelector("#modal")

//this is used to track who is curently logged in
let currUser = null;


//this represents our customer accounts  database
let accounts = [
  {
    accNumber: 2,
    name: "Adesope",
    password: "2",
    balance: 100000,
    transactions: [] 
  },
  {
    accNumber: 3920184839,
    name: "david",
    password: "david112",
    balance: 300000,
    transactions: [] 
  },
  {
    accNumber: 9403853928,
    name: "Esther",
    password: "esther99",
    balance: 70000,
    transactions: [] 
  },
  {
    accNumber: 1929048763,
    name: "Idan",
    password: "Idan133",
    balance: 150000,
    transactions: [] 
  },
  {
    accNumber: 2049873476,
    name: "Joseph",
    password: "joe112",
    balance: 250000,
    transactions: [] 
  }
]






//get all modal sections
let modalSections = modal.querySelectorAll("section")



document.addEventListener("DOMContentLoaded", function (e) {
  //get the logged in user 
  let loggedInUser = sessionStorage.getItem("loggedInUser")
  //update the current user
  currUser = JSON.parse(loggedInUser)
  
  //check if there is a logged in user
  if (currUser != null) {
    //hide the login section
    loginSection.classList.add("hidden")
    //display the app section
    appSection.classList.remove("hidden")
    document.querySelector("#userInfo_name").textContent = currUser.name
    updateDisplayBalance(currUser.balance)
  }
  else{
    //the user is not logged in
    loginSection.classList.remove("hidden")
    appSection.classList.add("hidden")
  }
  
  //get all the customers saved in an array, from the session storage
  let res = getAllCustomerDetailsFromStorage()
  if (res != null) {
    //update the accounts list
    accounts = res;

    //get the currently logged in user from the "accounts" list so that the reference can point to the same object
    currUser = getCustomer(currUser.accNumber)
  }

})




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
  saveSingleCustomerDetailsToStorage(currUser)

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

let btnOpenTransactionDetailsModal = document.querySelector("#btnOpenTransactionDetailsModal")
btnOpenTransactionDetailsModal.addEventListener("click", function (e) {
  let services = modal.querySelector("#services")
  
  services.classList.add("hidden")
  modal.classList.remove("hidden")

  let tBodyElemnt = document.querySelector("#transactionBody")
  let userTransactions = currUser.transactions 

  tBodyElemnt.replaceChildren()
  for (let i = 0; i < userTransactions.length; i++) {
    let userTransaction = userTransactions[i]
    let tr = createTableRow(userTransaction.accNumber, userTransaction.name, userTransaction.amount, userTransaction.transactionType, userTransaction.transactionAction)
    tBodyElemnt.append(tr)
  }
  
  let transactionDetailsModalSection = document.querySelector("#transactionDetailsModalSection")
  transactionDetailsModalSection.classList.remove("hidden")
})






let btnWithdraw = modal.querySelector("#btnWithdraw")
btnWithdraw.addEventListener("click", function (e) {

  //get the amount and account number the user entered
  let amountToWithdraw = modal.querySelector("#txtAmountToWithdraw")
  let accountNoEntered = modal.querySelector("#txtAccNo")
  let bankOptions = modal.querySelector("#slctBankOptions")

  //if the amount is available, validate the withdrawal process
  let validated = withdraw(amountToWithdraw.value, bankOptions.value, accountNoEntered.value)

  if (validated == true) {
    alert("Withdrawal successful")
    closeModal()
  }
  else{
    alert("enter a correct account number")
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

  let serviceProvider = modal.querySelector("#slctServiceProvider")

  let val = buyAirtime(amountOfAirtimeToBuy.value, serviceProvider.value, numberToBuyAirtimeTo.value)

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
    showLoginSections(appSection, loginSection)
    closeModal()
  }
  else{
    alert("incorrect password..")
  }

})

let payBills = document.querySelector("#pay-bills")
payBills.addEventListener("click", function (e) {
  payBill()
})

let btnCloseModal2 = document.querySelector(".modal-close2")
btnCloseModal2.addEventListener("click", function (e) {
  closeModal()
})

let btncloseModal = document.querySelector(".modal-close")
btncloseModal.addEventListener("click", function (e) {
  closeModal()
})

let btnLogOut = document.querySelector("#btnLogOut")
btnLogOut.addEventListener("click", function (e) {
  currUser = null
  sessionStorage.removeItem("loggedInUser")
  showLoginSections(appSection, loginSection)
})
























function showLoginSections(appSection, loginSection) {
  
  appSection.classList.add("hidden")
  loginSection.classList.remove("hidden")
}

function updateDisplayBalance(newBalance) {
  let userBalance = document.querySelector("#userInfo_balance")

  userBalance.textContent =  newBalance 
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
  

  
  let services = modal.querySelector("#services")
  let transactionDetailsModalSection = document.querySelector("#transactionDetailsModalSection")
  services.classList.remove("hidden")
  transactionDetailsModalSection.classList.add("hidden")
  //show the modal by removing the hidden class
  modal.classList.remove("hidden")
}

function closeModal() {
  modal.classList.add("hidden")
}

function createTableRow(accountNo, name, amount, transactionType, transactionAction) {
  // "<tr id>
  //                               <td class>[Name]</td>
  //                               <td>[transactionAction]</td>
  //                               <td>[amount]</td>
  //                           </tr>"


  //create the tr element
  let tr = document.createElement("tr")
  //create the first td element
  let td1 = document.createElement("td")
  td1.classList.add("flex", "flex-col")
  let span1 = document.createElement("span")
  span1.textContent = name
  let span2 = document.createElement("span")
  span2.textContent = accountNo
  //append span 1 and span2 to the first td
  td1.appendChild(span1)
  td1.appendChild(span2)
  //create the second td element
  let td2 = document.createElement("td")
  td2.textContent = transactionAction

  //create the third td, element
  let td3 = document.createElement("td")
  if (transactionType == "Credit") {
    td3.classList.add("text-green-700")
  }
  else{
    td3.classList.add("text-red-700")
  }
  td3.textContent = amount

  //make td1, td2, td3, a child of tr element
  tr.appendChild(td1)
  tr.appendChild(td2)
  tr.appendChild(td3)

  //return the newly created table row (tr) element
  return tr
}





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


function withdraw(amountEntered, bankOptions, accountNo) {

  //check if the account number entered length is 10
  if (accountNo.length != 10) {
    return false
  }

  //check if the amount the user entered is available in the currently logged in user account
  if (amountEntered <= currUser.balance) {
    //reduce the available balance  
    deductCustomerBalance(currUser.accNumber, amountEntered)

    //record the transaction for sender and receiver
      let withdrawTransaction = {
      accountNo: "",
      name: bankOptions,
      amount: amountEntered,
      transactionType: "Debit",
      transactionAction: "Withdraw"
    }

    currUser.transactions.push(withdrawTransaction)
    updateDisplayBalance(currUser.balance)
    saveSingleCustomerDetailsToStorage(currUser)
    saveCustomersDetailToSessionStorage()
    
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

  let depositTransaction = {
    accountNo: currUser.accNumber,
    name: currUser.name,
    amount: amount,
    transactionType: "Credit",
    transactionAction: "Deposit"
  }

  currUser.transactions.push(depositTransaction)
  updateDisplayBalance(currUser.balance)
  saveSingleCustomerDetailsToStorage(currUser)
  saveCustomersDetailToSessionStorage()

}

function transfer(amountEntered, accountNo) {
  //check if the account number entered is the current user account (you should not be able to transfer from your acct to your account)
  if (accountNo == currUser.accNumber) {
    alert("this action is not possible")
    return
  }

  //check if the amount the user entered is available in the currently logged in user account
  if (amountEntered <= currUser.balance) {
     
    let customer = getCustomer(accountNo)
    //add to the other user balance
    let res = topUpCustomerBalance(accountNo, amountEntered)

    if (res == false) {
      alert("Incorrect account number")
      return
    }

    console.log("before " + currUser.balance)
    console.log(amountEntered)
    //deduct current user balance
    deductCustomerBalance(currUser.accNumber, amountEntered)
    console.log("after " + currUser.balance)
    
    //record the transaction for sender and receiver
    recordCustomersTransaction(currUser.accNumber, accountNo, amountEntered, "transfer")

    //update the current user balance
    updateDisplayBalance(currUser.balance)
    saveSingleCustomerDetailsToStorage(currUser)
    saveCustomersDetailToSessionStorage()
    return true
  }
  else {
    alert("insufficient funds...")
  }
}


function buyAirtime(amount, provider, numberToBuyAirtimeTo) {
  // Check whether a provider was selected 
  if (provider == null) {
    alert("Please select a service provider")
    return false 
  }
  if (numberToBuyAirtimeTo.length != 11) {
    alert("Enter a correct phone number")
    return
  }
  // Check if the amount is valid and affordable
  if (amount > 0 && amount <= currUser.balance) {

    // Deduct the amount from the customer's account
    deductCustomerBalance(currUser.accNumber, amount)

    // Record the airtime transaction
    recordAirtimePurchaseTransaction(currUser.accNumber, amount, provider)

    // Update the displayed balance
    updateDisplayBalance(currUser.balance)
    saveSingleCustomerDetailsToStorage(currUser)
    saveCustomersDetailToSessionStorage()
    
    return true
  }

  else{
    alert("Invalid amount or insufficient funds...")
    return false
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








function getAllCustomerDetailsFromStorage() {
  let allCustomers = sessionStorage.getItem("allCustomer")
  return JSON.parse(allCustomers)
}

function saveCustomersDetailToSessionStorage() {
  sessionStorage.setItem("allCustomer", JSON.stringify(accounts))
}

function saveSingleCustomerDetailsToStorage(loggedInUser) {
  sessionStorage.setItem("loggedInUser", JSON.stringify(loggedInUser))
}



function topUpCustomerBalance(customerAccNo, amount) {
  let customer = getCustomer(customerAccNo)
  
  if (customer == null) {
    return false
  }

  customer.balance = customer.balance + Number(amount)
}


function deductCustomerBalance(customerAccNo, amountToDeduct) {
  let customer = getCustomer(customerAccNo)

  if (customer == null) {
    return false
  }

  customer.balance = customer.balance - Number(amountToDeduct)
}

function getCustomer(customerAccNo) {
  let customer = null

  for (let i = 0; i < accounts.length; i++) {
    //check if the account number entered is a verified ABZ account number
    if (customerAccNo == accounts[i].accNumber) {
      customer = accounts[i]
    }
  }
  return customer
}


function recordCustomersTransaction(senderAccNo, receiverAccNo, amount, transactionAction) {
    // Find the customer using their account number
    let sender = getCustomer(senderAccNo)
    let receiver = getCustomer(receiverAccNo)

    //check if the customer exists
    if (sender == null) {
      return false
    }

    if (receiver == null) {
      return false
    }

    let senderTransactionHistory = {
      accountNo: receiver.accNumber,
      name: receiver.name,
      amount: amount,
      transactionType: "Debit",
      transactionAction: transactionAction
    }

    let receiverTransactionHistory = {
      accountNo: sender.accNumber,
      name: sender.name,
      amount: amount,
      transactionType: "Credit",
      transactionAction: transactionAction
    }

    //add the transaction to each customer's transaction history
    sender.transactions.push(senderTransactionHistory)
    receiver.transactions.push(receiverTransactionHistory)
}

function recordAirtimePurchaseTransaction(senderAccNo, amount, provider) {

  let sender = getCustomer(senderAccNo)

  if (sender == null) {
    return false
  }

  let airtimeTransaction = {
    accountNo: "",
    name: provider,
    amount: amount,
    transactionType: "Debit",
    transactionAction: "Airtime Purchase"
  }

  sender.transactions.push(airtimeTransaction)

  return true
}
