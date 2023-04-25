// Variables and selectors

const form = document.querySelector('#add-expense');
const expenditureList = document.querySelector('#expenses ul');

// Events

eventListeners();
function eventListeners() {
    document.addEventListener('DOMContentLoaded', askBudget);
    form.addEventListener('submit', addExpense)
}

// Classes

class Budget {
    constructor(budget){
        this.budget = Number(budget);
        this.remaining = Number(budget);
        this.expenses = [];
    }

    newExpense(expense){
        this.expenses = [...this.expenses,expense];
    }
}

class UI {
    insertBudget(quantity){
        // Extract value
        const { budget, remaining} = quantity;

        // Add to html
        document.querySelector('#total').textContent = budget;
        document.querySelector('#remaining').textContent = remaining;
    }

    printAlert(message, type){
        // create div
        const divMessage = document.createElement('div');
        divMessage.classList.add('text-center','alert');

        if (type === 'error') {
            divMessage.classList.add('alert-danger');
        } else {
            divMessage.classList.add('alert-success');
        }

        // Error message
        divMessage.textContent = message;

        // Insert message to html
        document.querySelector('.primary').insertBefore(divMessage, form);

        // Remove from html
        setTimeout(() => {
            divMessage.remove();
        },3000)
    }

    addExpenseList(expenses){

        this.cleanUpHtml(); // clean up previous html

        // Iterate over expenses
        expenses.forEach( expense => {
            const { quantity, name, id } = expense;

            // Create LI
            const newExpense = document.createElement('li');
            newExpense.className = 'list-group-item d-flex justify-content-between align-items-center';
            newExpense.dataset.id = id;

            // Add expenses html 
            newExpense.innerHTML = `${name} <span class='badge badge-primary badge-pill'> ${quantity} </span>`;

            // Delete button
            const btnDelete = document.createElement('button');
            btnDelete.classList.add('btn', 'btn-danger', 'delete-expense');
            btnDelete.innerHTML = 'Borrar &times;';
            newExpense.appendChild(btnDelete);

            // add to html

            expenditureList.appendChild(newExpense);
        })
    }

    cleanUpHtml(){
        while(expenditureList.firstChild) {
            expenditureList.removeChild(expenditureList.firstChild);
        }
    }
}

// Instantiate
const ui = new UI();
let budget;

// Functions

function askBudget(){
    const userBudget = prompt ('¿Cuál es tu presupuesto?');

    if(userBudget === '' || userBudget === null || isNaN(userBudget) || userBudget <= 0){
        window.location.reload();
    }

    // Valid budget

    budget = new Budget(userBudget);
    ui.insertBudget(budget);
}

// Add expense

function addExpense(e){
    e.preventDefault();

    // Read form data
    const name = document.querySelector('#expense').value;
    const quantity = Number(document.querySelector('#quantity').value);

    // Validate
    if (name === '' || quantity === ''){
        ui.printAlert('Ambos campos son obligatorio', 'error');
        return;
    } else if ( quantity <= 0  || isNaN(quantity)){
        ui.printAlert('Cantidad no válida','error');
        return;
    }

    // Generate object with expense
    const expense = {name, quantity, id: Date.now()};

    // Add a new expense
    budget.newExpense(expense);

    // Message ok
    ui.printAlert('Gasto agregado correctamente');

    // Print Cost
    const { expenses } = budget;
    ui.addExpenseList(expenses);

    // Reset form
    form.reset();

}