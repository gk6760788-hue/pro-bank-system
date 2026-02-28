let currentUser = null;

function generateAccNo(){
    return "ACC" + Math.floor(100000 + Math.random()*900000);
}

function getUsers(){
    return JSON.parse(localStorage.getItem("users")) || {};
}

function saveUsers(users){
    localStorage.setItem("users", JSON.stringify(users));
}

function register(){
    let name = document.getElementById("name").value;
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let balance = parseInt(document.getElementById("balance").value)||0;

    let users = getUsers();

    if(users[username]){
        alert("User already exists!");
        return;
    }

    users[username]={
        name,
        password,
        balance,
        accNo:generateAccNo(),
        history:[]
    };

    saveUsers(users);
    alert("Account Created!");
}

function login(){
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let users = getUsers();

    if(users[username] && users[username].password===password){
        currentUser=username;
        document.getElementById("authSection").classList.add("hidden");
        showDashboard();
    } else alert("Invalid login");
}

function showDashboard(){
    hideAll();
    document.getElementById("dashboard").classList.remove("hidden");

    let users=getUsers();
    document.getElementById("welcome").innerText="Welcome "+users[currentUser].name;
    document.getElementById("balanceAmount").innerText=users[currentUser].balance;
    document.getElementById("accNo").innerText=users[currentUser].accNo;
}

function showTransfer(){ hideAll(); document.getElementById("transferSection").classList.remove("hidden"); }
function showHistory(){ 
    hideAll(); 
    document.getElementById("historySection").classList.remove("hidden");
    loadHistory();
}

function hideAll(){
    document.querySelectorAll(".card").forEach(c=>c.classList.add("hidden"));
}

function transfer(){
    let toUser=document.getElementById("toUser").value;
    let amount=parseInt(document.getElementById("amount").value);

    let users=getUsers();

    if(!users[toUser]){ alert("User not found"); return;}
    if(users[currentUser].balance<amount){ alert("Insufficient balance"); return;}

    users[currentUser].balance-=amount;
    users[toUser].balance+=amount;

    users[currentUser].history.push({type:"Sent",user:toUser,amount});
    users[toUser].history.push({type:"Received",user:currentUser,amount});

    saveUsers(users);
    alert("Transfer successful");
    showDashboard();
}

function loadHistory(){
    let users=getUsers();
    let history=users[currentUser].history;
    let table=document.getElementById("historyTable");
    table.innerHTML="";
    history.forEach(h=>{
        table.innerHTML+=`<tr><td>${h.type}</td><td>${h.user}</td><td>₹${h.amount}</td></tr>`;
    });
}

function toggleTheme(){
    document.body.classList.toggle("dark");
}

function deleteAccount(){
    let users=getUsers();
    delete users[currentUser];
    saveUsers(users);
    alert("Account deleted");
    logout();
}

function logout(){
    currentUser=null;
    document.getElementById("authSection").classList.remove("hidden");
    hideAll();
}