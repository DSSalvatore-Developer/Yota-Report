// MARK: Блок - Тестовая конфигурация Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC3fFakeTestKEY123456789",
    authDomain: "yota-report-test.firebaseapp.com",
    databaseURL: "https://yota-report-test-default-rtdb.firebaseio.com",
    projectId: "yota-report-test",
    storageBucket: "yota-report-test.appspot.com",
    messagingSenderId: "123456789000",
    appId: "1:123456789000:web:1234567890abcdef"
};

// MARK: Блок - Инициализация Firebase с обработкой ошибок
try {
    firebase.initializeApp(firebaseConfig);
} catch (error) {
    console.error("Ошибка инициализации Firebase:", error);
    showError("Не удалось подключиться к базе данных. Попробуйте позже.");
}

// MARK: Блок - Функция показа ошибки пользователю
function showError(message) {
    document.body.innerHTML = `
        <div style="text-align: center; margin-top: 50px;">
            <h1 style="color: #0077c8;">Ошибка загрузки</h1>
            <p>${message}</p>
        </div>
    `;
}
