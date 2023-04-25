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
    const quantity = document.querySelector('#quantity').value;

    // Validate
    if (name === '' || quantity === ''){
        ui.printAlert('Ambos campos son obligatorio', 'error');
        return;
    } else if ( quantity <= 0  || isNaN(quantity)){
        ui.printAlert('Cantidad no válida','error');
        return;
    }
}