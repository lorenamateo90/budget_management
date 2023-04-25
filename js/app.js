// Variables and selectors

const form = document.querySelector('#add-expense');
const expenditureList = document.querySelector('#expenses ul');

// Events

eventListeners();
function eventListeners() {
    document.addEventListener('DOMContentLoaded', askBudget);
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
    };
}

// Instantiate
const ui = new UI();
let budget;

// Functions

function askBudget(){
    const userBudget = prompt ('¿Cuál es tu presupuesto?');
    console.log(Number(userBudget));

    if(userBudget === '' || userBudget === null || isNaN(userBudget) || userBudget <= 0){
        window.location.reload();
    }

    // Valid budget

    budget = new Budget(userBudget);
    ui.insertBudget(budget);
}