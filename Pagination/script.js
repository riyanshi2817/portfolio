const content = document.getElementById("content");
const pagination = document.querySelector(".pagination");
const prevBtn = document.querySelector(".btn1");
const nextBtn = document.querySelector(".btn2");
const ul = pagination.querySelector("ul");

const items = Array.from({ length: 50 }, (_, i) => `Article ${i + 1}`);

const itemsPerPage = 5;
const totalPages = Math.ceil(items.length / itemsPerPage);
let currentPage = 1;

function renderContent() {
  content.innerHTML = "";
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const currentItems = items.slice(start, end);

  currentItems.forEach(item => {
    const div = document.createElement("div");
    div.className = "item";
    div.textContent = item;
    content.appendChild(div);
  });
}

function createPagination() {
  ul.innerHTML = "";

  function addPage(num) {
    const li = document.createElement("li");
    li.className = "link";
    li.textContent = num;
    li.setAttribute("value", num);
    if (num === currentPage) li.classList.add("active");
    li.addEventListener("click", () => {
      currentPage = num;
      update();
    });
    ul.appendChild(li);
  }

  addPage(1); 

  if (currentPage > 3) {
    const dots = document.createElement("li");
    dots.className = "dots";
    dots.textContent = "...";
    ul.appendChild(dots);
  }

  for (let i = currentPage - 1; i <= currentPage + 1; i++) {
    if (i > 1 && i < totalPages) {
      addPage(i);
    }
  }

  if (currentPage < totalPages - 2) {
    const dots = document.createElement("li");
    dots.className = "dots";
    dots.textContent = "...";
    ul.appendChild(dots);
  }

  if (totalPages > 1) addPage(totalPages); // Last

  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
}

function update() {
  renderContent();
  createPagination();
}

prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    update();
  }
});

nextBtn.addEventListener("click", () => {
  if (currentPage < totalPages) {
    currentPage++;
    update();
  }
});

update();
