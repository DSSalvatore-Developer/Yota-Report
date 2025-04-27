// MARK: Блок - Тестовая конфигурация Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCl5ia_vBLQ-VZziIyiGtJsBng4Z2SUW8I",
  authDomain: "yota-report-4a391.firebaseapp.com",
  databaseURL: "https://yota-report-4a391-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "yota-report-4a391",
  storageBucket: "yota-report-4a391.firebasestorage.app",
  messagingSenderId: "401712839981",
  appId: "1:401712839981:web:65474e9ca8bf5673a5e7a4"
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
