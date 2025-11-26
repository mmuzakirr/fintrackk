// File: app.js - PERUBAHAN KEGANTI INI SAJA:

// Fungsi utama untuk inisialisasi aplikasi Vue.js
const initApp = async () => {
    // 1. Cek ketersediaan fungsi database dan inisialisasi
    if (!window.initDatabase) {
        document.getElementById('app').innerHTML = '<p style="color: red; text-align: center; margin-top: 50px;">Error: db.js belum dimuat. Pastikan index.html memuat db.js sebelum app.js.</p>';
        return;
    }

    // Panggil initDatabase (karena sekarang sinkron, tidak perlu await)
    // Walaupun kita panggil, ini hanya untuk memastikan fungsi ada
    window.initDatabase(); 
    
    // ... Sisa kode createApp Vue.js (seperti yang sudah saya berikan sebelumnya) ...

    const { createApp } = Vue;

    createApp({
        // ... (sisanya sama persis)
        // ... (Metode createAccount, updateAccount, addTx TIDAK perlu diubah karena mereka memanggil fungsi yang sudah diupdate di db.js)
        // ...
        mounted() {
            // 1. Load User Data
            this.loadUserData();

            // 2. Check Login Status
            if (localStorage.getItem('fintrack_logged_in') === 'true') {
                this.isLoggedIn = true;
                this.currentView = 'Dashboard';
            }
        }
    }).mount("#app");
};

// Panggil fungsi inisialisasi aplikasi
if (window.initDatabase) {
    initApp();
} else {
    window.addEventListener('load', initApp);
}