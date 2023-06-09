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
        this.expenses = [...this.expenses, expense];
        this.calculateRemaining();
    }

    calculateRemaining(){
        const spent = this.expenses.reduce((total, expense) => total + expense.quantity, 0);
        this.remaining = this.budget - spent;
    }

    removeExpense(id){
        this.expenses = this.expenses.filter( expense => expense.id !== id );
        this.calculateRemaining();
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
        // Create div
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

        this.cleanUpHtml(); // Clean up previous html

        // Iterate over expenses
        expenses.forEach( expense => {
            const { quantity, name, id } = expense;

            // Create LI
            const newExpense = document.createElement('li');
            newExpense.className = 'list-group-item d-flex justify-content-between align-items-center';
            newExpense.dataset.id = id;

            // Add expenses html 
            newExpense.innerHTML = `${name} <span class='badge badge-primary badge-pill'> $ ${quantity} </span>`;

            // Delete button
            const btnDelete = document.createElement('button');
            btnDelete.classList.add('btn', 'btn-danger', 'delete-expense');
            btnDelete.innerHTML = 'Borrar &times;';
            btnDelete.onclick = () => {
                removeExpense(id);
            }
            newExpense.appendChild(btnDelete);

            // Add to html

            expenditureList.appendChild(newExpense);
        })
    }

    cleanUpHtml(){
        while(expenditureList.firstChild) {
            expenditureList.removeChild(expenditureList.firstChild);
        }
    }

    updateRemaining(remaining){
        document.querySelector('#remaining').textContent = remaining;
    }

    checkBudget(budgetObj){
        const { budget, remaining } = budgetObj;

        const remainingDiv = document.querySelector('.remaining')

        // Check 25%
        if ((budget / 4 ) > remaining ){
            remainingDiv.classList.remove('alert-success', 'alert-warning');
            remainingDiv.classList.add('alert-danger');
        } else if ((budget / 2 ) > remaining ){
            remainingDiv.classList.remove('alert-success');
            remainingDiv.classList.add('alert-warning');
        } else {
            remainingDiv.classList.remove('alert-danger', 'alert-warning');
            remainingDiv.classList.add('alert-success');
        }

        // If total is zero or less
        if ( remaining <= 0) {
            ui.printAlert('El presupuesto se ha agotado', 'error');

            form.querySelector('button[type="submit"]').disabled = true;
        }
    };
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
    const { expenses, remaining } = budget;
    ui.addExpenseList(expenses);

    ui.updateRemaining(remaining);

    ui.checkBudget(budget);

    // Reset form
    form.reset();

}

function removeExpense (id) {
    budget.removeExpense(id);
    const { expenses, remaining } = budget;
    ui.addExpenseList(expenses);

    ui.updateRemaining(remaining);

    ui.checkBudget(budget);
}