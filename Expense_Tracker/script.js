const balanceEl = document.querySelector("#balance-overview h2");
const incomeEl = document.querySelector(".income");
const expenseEl = document.querySelector(".expense");
const transactionList = document.querySelector("#transactions ul");
const form = document.querySelector("#add-transaction form");

let balance = 0;
let income = 0;
let expense = 0;
let transactions = [];

function updateUI() {
  balance = income - expense;
  balanceEl.textContent = `Current Balance: ₹${balance}`;
  incomeEl.textContent = `Income: ₹${income}`;
  expenseEl.textContent = `Expense: ₹${expense}`;

  transactionList.innerHTML = "";
  transactions.forEach(tx => {
    const li = document.createElement("li");
    li.textContent = `${tx.icon} ${tx.description} ${tx.amount > 0 ? "+" : ""}₹${tx.amount} (${tx.date})`;
    transactionList.prepend(li); 
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const description = form.description.value;
  const amount = Number(form.amount.value);
  const category = form.category.value;
  const type = form.type.value;

  const icons = {
    Food: "🛒",
    Travel: "🚕",
    Shopping: "🛍",
    Other: "💸"
  };
  const icon = icons[category] || "💰";

  const transaction = {
    description,
    amount: type === "income" ? amount : -amount,
    category,
    date: new Date().toLocaleDateString(),
    icon
  };

  if (transaction.amount > 0) {
    income += transaction.amount;
  } else {
    expense += Math.abs(transaction.amount);
  }

  transactions.push(transaction);
  updateUI();

  form.reset();
});

updateUI();
