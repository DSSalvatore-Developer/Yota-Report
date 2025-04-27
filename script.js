// MARK: Блок - Переменные элементов на странице
const loginScreen = document.getElementById('login-screen');
const feedbackScreen = document.getElementById('feedback-screen');
const selectStoreScreen = document.getElementById('select-store-screen');
const reportScreen = document.getElementById('report-screen');
const viewReportsScreen = document.getElementById('view-reports-screen');

// MARK: Блок - Авторизация
const loginButton = document.getElementById('login-button');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

// MARK: Блок - Обратная связь
const feedbackButton = document.getElementById('feedback-button');
const closeFeedback = document.getElementById('close-feedback');
const sendFeedback = document.getElementById('send-feedback');
const feedbackTopic = document.getElementById('feedback-topic');
const feedbackMessage = document.getElementById('feedback-message');
const feedbackPhone = document.getElementById('feedback-phone');

// MARK: Блок - Торговые точки
const storeList = document.getElementById('store-list');
const addStoreButton = document.getElementById('add-store');
const newStoreInput = document.getElementById('new-store');

// MARK: Блок - Отчет
const employeeNameInput = document.getElementById('employee-name');
const reportDateInput = document.getElementById('report-date');
const operationTypeSelect = document.getElementById('operation-type');
const operationComment = document.getElementById('operation-comment');
const operationQuantity = document.getElementById('operation-quantity');
const operationPrice = document.getElementById('operation-price');
const splitPaymentCheckbox = document.getElementById('split-payment');
const cashAmountInput = document.getElementById('cash-amount');
const cardAmountInput = document.getElementById('card-amount');
const addOperationButton = document.getElementById('add-operation');
const operationList = document.getElementById('operation-list');
const submitReportButton = document.getElementById('submit-report');

// MARK: Блок - SIM-карты
const iccNumberInput = document.getElementById('icc-number');
const simOperatorSelect = document.getElementById('sim-operator');
const addSimButton = document.getElementById('add-sim');
const simList = document.getElementById('sim-list');

// MARK: Блок - Фильтры для просмотра отчетов
const filterStartDate = document.getElementById('filter-start-date');
const filterEndDate = document.getElementById('filter-end-date');
const filterEmployee = document.getElementById('filter-employee');
const filterStore = document.getElementById('filter-store');
const applyFiltersButton = document.getElementById('apply-filters');
const filteredReportsDiv = document.getElementById('filtered-reports');

// MARK: Блок - Данные
let selectedStore = null;
let operations = [];
let simCards = [];

// MARK: Блок - Логин
loginButton.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (username === "Yota Кемерово" && password === "12345678") {
        showScreen(selectStoreScreen);
        loadStores();
    } else {
        alert('Неверный логин или пароль!');
    }
});

// MARK: Блок - Открыть/закрыть обратную связь
feedbackButton.addEventListener('click', () => {
    feedbackScreen.classList.remove('hidden');
});

closeFeedback.addEventListener('click', () => {
    feedbackScreen.classList.add('hidden');
});

// MARK: Блок - Отправка обратной связи
sendFeedback.addEventListener('click', () => {
    const topic = feedbackTopic.value.trim();
    const message = feedbackMessage.value.trim();
    const phone = feedbackPhone.value.trim();

    if (!topic || !message || !phone) {
        alert('Пожалуйста, заполните все поля.');
        return;
    }

    const mailtoLink = `mailto:D.S.Salvatore@iCloud.com?subject=${encodeURIComponent(topic)}&body=${encodeURIComponent(`Сообщение: ${message}\nТелефон: ${phone}`)}`;
    window.location.href = mailtoLink;
});

// MARK: Блок - Работа с экранами
function showScreen(screen) {
    [loginScreen, selectStoreScreen, reportScreen, viewReportsScreen].forEach(s => s.classList.add('hidden'));
    screen.classList.remove('hidden');
    screen.classList.add('active');
}

// MARK: Блок - Работа с LocalStorage для сохранения черновика отчета
function saveDraft() {
    const draft = {
        selectedStore,
        employeeName: employeeNameInput.value,
        reportDate: reportDateInput.value,
        operations,
        simCards
    };
    localStorage.setItem('yota-report-draft', JSON.stringify(draft));
}

function loadDraft() {
    const draft = JSON.parse(localStorage.getItem('yota-report-draft'));
    if (draft) {
        selectedStore = draft.selectedStore;
        employeeNameInput.value = draft.employeeName;
        reportDateInput.value = draft.reportDate;
        operations = draft.operations || [];
        simCards = draft.simCards || [];
        renderOperations();
        renderSimCards();
    }
}

// MARK: Блок - Работа с торговыми точками
addStoreButton.addEventListener('click', () => {
    const store = newStoreInput.value.trim();
    if (!store) return;

    const storeRef = firebase.database().ref('stores').push();
    storeRef.set({
        name: store
    });

    newStoreInput.value = '';
    loadStores();
});

function loadStores() {
    storeList.innerHTML = '';
    firebase.database().ref('stores').once('value', snapshot => {
        snapshot.forEach(childSnapshot => {
            const storeData = childSnapshot.val();
            const div = document.createElement('div');
            div.className = 'store-item';
            div.innerHTML = `
                <span>${storeData.name}</span>
                <button class="delete-button" onclick="deleteStore('${childSnapshot.key}')">Удалить</button>
                <button onclick="selectStore('${storeData.name}')">Выбрать</button>
            `;
            storeList.appendChild(div);
        });
    });
}

function deleteStore(key) {
    firebase.database().ref('stores').child(key).remove();
    loadStores();
}

function selectStore(name) {
    selectedStore = name;
    showScreen(reportScreen);
    loadDraft();
}

// MARK: Блок - Работа с операциями
addOperationButton.addEventListener('click', () => {
    const type = operationTypeSelect.value;
    const comment = operationComment.value.trim();
    const quantity = Number(operationQuantity.value);
    const price = Number(operationPrice.value);
    const splitPayment = splitPaymentCheckbox.checked;
    const cashAmount = Number(cashAmountInput.value);
    const cardAmount = Number(cardAmountInput.value);

    if (!type || !comment) {
        alert('Заполните тип операции и комментарий.');
        return;
    }

    operations.push({ type, comment, quantity, price, splitPayment, cashAmount, cardAmount });
    renderOperations();
    saveDraft();

    operationTypeSelect.value = '';
    operationComment.value = '';
    operationQuantity.value = '';
    operationPrice.value = '';
    splitPaymentCheckbox.checked = false;
    cashAmountInput.value = '';
    cardAmountInput.value = '';
    cashAmountInput.classList.add('hidden');
    cardAmountInput.classList.add('hidden');
});

// MARK: Блок - Отображение списка операций
function renderOperations() {
    operationList.innerHTML = '';
    operations.forEach((op, index) => {
        const div = document.createElement('div');
        div.className = 'operation-item';
        div.innerHTML = `
            <span>${op.type}: ${op.comment}</span>
            <button class="delete-button" onclick="deleteOperation(${index})">Удалить</button>
        `;
        operationList.appendChild(div);
    });
}

function deleteOperation(index) {
    operations.splice(index, 1);
    renderOperations();
    saveDraft();
}

// MARK: Блок - Работа с SIM-картами
addSimButton.addEventListener('click', () => {
    const icc = iccNumberInput.value.trim();
    const operator = simOperatorSelect.value;

    if (!icc) return;

    simCards.push({ icc, operator, used: false });
    renderSimCards();
    saveDraft();

    iccNumberInput.value = '';
});

function renderSimCards() {
    simList.innerHTML = '';
    simCards.forEach((sim, index) => {
        const div = document.createElement('div');
        div.className = 'sim-item';
        div.innerHTML = `
            <span>${sim.operator}: ${sim.icc}</span>
            <button class="delete-button" onclick="deleteSim(${index})">Удалить</button>
        `;
        simList.appendChild(div);
    });
}

function deleteSim(index) {
    simCards.splice(index, 1);
    renderSimCards();
    saveDraft();
}

// MARK: Блок - Отправка отчета
submitReportButton.addEventListener('click', () => {
    const employeeName = employeeNameInput.value.trim();
    const reportDate = reportDateInput.value;

    if (!employeeName || !reportDate || !selectedStore) {
        alert('Пожалуйста, заполните все поля.');
        return;
    }

    const reportData = {
        employeeName,
        reportDate,
        store: selectedStore,
        operations,
        simCards,
        timestamp: Date.now()
    };

    firebase.database().ref('reports').push(reportData);

    localStorage.removeItem('yota-report-draft');
    alert('Отчет отправлен!');
    location.reload();
});

// MARK: Блок - Раздельная оплата - показать поля
splitPaymentCheckbox.addEventListener('change', () => {
    if (splitPaymentCheckbox.checked) {
        cashAmountInput.classList.remove('hidden');
        cardAmountInput.classList.remove('hidden');
    } else {
        cashAmountInput.classList.add('hidden');
        cardAmountInput.classList.add('hidden');
    }
});

// MARK: Блок - Фильтрация отчетов
applyFiltersButton.addEventListener('click', () => {
    filteredReportsDiv.innerHTML = '';
    const start = new Date(filterStartDate.value).getTime();
    const end = new Date(filterEndDate.value).getTime();
    const employee = filterEmployee.value.trim().toLowerCase();
    const store = filterStore.value.trim().toLowerCase();

    firebase.database().ref('reports').once('value', snapshot => {
        snapshot.forEach(childSnapshot => {
            const report = childSnapshot.val();
            if (
                (!start || report.timestamp >= start) &&
                (!end || report.timestamp <= end) &&
                (!employee || report.employeeName.toLowerCase().includes(employee)) &&
                (!store || report.store.toLowerCase().includes(store))
            ) {
                const div = document.createElement('div');
                div.className = 'report-item';
                div.innerHTML = `
                    <strong>${report.reportDate}</strong> - ${report.employeeName} - ${report.store}
                `;
                filteredReportsDiv.appendChild(div);
            }
        });
    });
});
