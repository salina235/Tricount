let people = [];
let expenses = []; 

const nameInput = document.getElementById("participanteName");
const addPersonBtn = document.getElementById("addparticipanteBtn");
const peopleList = document.getElementById("participanteList");
const expenseInput = document.getElementById("expenseDesc");
const expenseAmountInput = document.getElementById("expenseAmount");
const expensePayerSelect = document.getElementById("expensePayer");
const participantChecked = document.getElementById("participantsCheckboxes");
const addExpenseBtn = document.getElementById("addExpenseBtn");
const expenseList = document.getElementById("expenseList");
const resultSection = document.getElementById("resultsSection");


function addParticipant() {
    const participantName = nameInput.value.trim();
    if (participantName === "") {
        alert("Enter your name");
        return;
    }
    if (people.includes(participantName)) {
        alert("This name already exists.");
        return;
    }
    people.push(participantName);
    nameInput.value = "";
    updateParticipante();
}


function updateParticipante() {
    
    peopleList.innerHTML = "";
    people.forEach(person => {
        const li = document.createElement("li");
        li.textContent = person;
        
        
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = () => deleteParticipante(person);
        li.appendChild(deleteBtn);
        
        peopleList.appendChild(li);
    });

    
    expensePayerSelect.innerHTML = '<option value="">--------Selecciona quien pago------</option>';
    people.forEach(person => {
        const option = document.createElement("option");
        option.value = person;
        option.textContent = person;
        expensePayerSelect.appendChild(option);
    });

    
    participantChecked.innerHTML = "";
    people.forEach(person => {
        const div = document.createElement("div");
        
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = `participant-${person}`;
        checkbox.name = "involved-participant";
        checkbox.value = person;
        checkbox.checked = true;

        const label = document.createElement("label");
        label.htmlFor = `participant-${person}`;
        label.textContent = person;
        
        div.appendChild(checkbox);
        div.appendChild(label);
        participantChecked.appendChild(div);
    });
    
    updateExpensesList();
    calculateBalances();
}


function deleteParticipante(participantName) {
    people = people.filter(person => person !== participantName);
    
    expenses = expenses.filter(expense => {
        if (expense.participants.length === 1 && expense.participants[0] === participantName) {
            return false;
        }
        return true;
    });
    
    expenses.forEach(expense => {
        expense.participants = expense.participants.filter(p => p !== participantName);
        if (expense.participants.length > 0) {
            expense.amountPerPerson = expense.amount / expense.participants.length;
        }
    });
    
    updateParticipante();
}


function addExpense() {
    const description = expenseInput.value.trim();
    const amount = parseFloat(expenseAmountInput.value);
    const payer = expensePayerSelect.value;
    
   
    const participants = Array.from(
        document.querySelectorAll("input[name='involved-participant']:checked")
    ).map(checkbox => checkbox.value);

    
    if (description === "") {
        alert("Please enter expense description");
        return;
    }
    
    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount");
        return;
    }
    
    if (payer === "") {
        alert("Please select who paid");
        return;
    }
    
    if (participants.length === 0) {
        alert("Please select at least one participant");
        return;
    }

   
    const newExpense = {
        id: Date.now(),
        description,
        amount,
        payer,
        participants: participants,
        amountPerPerson: amount / participants.length
    };
    
    expenses.push(newExpense);
    
   
    expenseInput.value = "";
    expenseAmountInput.value = "";
    expensePayerSelect.value = "";
    
    updateParticipante();
}


function updateExpensesList() {
    expenseList.innerHTML = "";
    
    expenses.forEach(expense => {
        const div = document.createElement("div");
        div.className = "expense-item";
        div.innerHTML = `
            <strong>${expense.description}</strong>: $${expense.amount.toFixed(2)}
            <br>Paid by: ${expense.payer}
            <br>Split between: ${expense.participants.join(", ")}
            <br>Per person: $${expense.amountPerPerson.toFixed(2)}
        `;
        expenseList.appendChild(div);
    });
}


function calculateBalances() {
    if (people.length === 0) {
        resultSection.innerHTML = "";
        return;
    }
    
    const balances = {};
    people.forEach(person => {
        balances[person] = 0;
    });
    
  
    expenses.forEach(expense => {
        balances[expense.payer] += expense.amount;
        expense.participants.forEach(participant => {
            balances[participant] -= expense.amountPerPerson;
        });
    });
    
    
    resultSection.innerHTML = "<h3>Final Balances</h3>";
    
    let hasBalances = false;
    people.forEach(person => {
        const balance = balances[person];
        if (Math.abs(balance) > 0.01) { 
            hasBalances = true;
            const p = document.createElement("p");
            if (balance > 0) {
                p.textContent = `${person} should receive: $${balance.toFixed(2)}`;
                p.style.color = "green";
            } else {
                p.textContent = `${person} should pay: $${Math.abs(balance).toFixed(2)}`;
                p.style.color = "red";
            }
            resultSection.appendChild(p);
        }
    });
    
    if (!hasBalances) {
        const p = document.createElement("p");
        p.textContent = "Everyone is settled up!";
        p.style.color = "blue";
        resultSection.appendChild(p);
    }
}


addPersonBtn.addEventListener("click", addParticipant);
addExpenseBtn.addEventListener("click", addExpense);


nameInput.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        addParticipant();
    }
});

expenseAmountInput.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        addExpense();
    }
});

updateParticipante();