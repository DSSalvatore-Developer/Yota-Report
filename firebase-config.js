// MARK: Блок - Конфигурация Firebase
const firebaseConfig = {
    apiKey: "ТВОЙ_API_KEY",
    authDomain: "ТВОЙ_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://ТВОЙ_PROJECT_ID.firebaseio.com",
    projectId: "ТВОЙ_PROJECT_ID",
    storageBucket: "ТВОЙ_PROJECT_ID.appspot.com",
    messagingSenderId: "ТВОЙ_MESSAGING_SENDER_ID",
    appId: "ТВОЙ_APP_ID"
};

// MARK: Блок - Инициализация Firebase
firebase.initializeApp(firebaseConfig);
