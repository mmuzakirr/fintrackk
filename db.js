// File: db.js - SOLUSI SEDERHANA MENGGUNAKAN JSON DAN LOCAL STORAGE (TIDAK PAKAI SQL.JS)

window.FinTrackDB = {
    DB_KEY: 'fintrack_json_transactions' // Kunci untuk Local Storage
};

// --- Fungsi Inisialisasi Database (Memuat atau membuat array kosong) ---
window.initDatabase = async function() {
    console.log("Initializing database using Local Storage (JSON).");
    // Tidak ada inisialisasi SQL.js yang diperlukan
    return true; 
};

// --- Fungsi Simpan Data Transaksi ke Local Storage ---
window.saveTransactions = function(transactions) {
    try {
        // Konversi array transaksi menjadi string JSON
        const jsonString = JSON.stringify(transactions);
        
        // Simpan ke Local Storage
        localStorage.setItem(FinTrackDB.DB_KEY, jsonString);
        console.log("Transactions successfully saved to Local Storage.");
    } catch (error) {
        console.error("Error saving transactions:", error);
    }
};

// --- Fungsi Muat Data Transaksi dari Local Storage ---
window.loadTransactions = function() {
    try {
        const savedJSON = localStorage.getItem(FinTrackDB.DB_KEY);

        if (savedJSON) {
            // Parse string JSON kembali menjadi array objek
            const transactions = JSON.parse(savedJSON);
            console.log("Transactions loaded from Local Storage.");
            
            // Tambahkan numericAmount untuk charting
            return transactions.map(t => ({
                ...t,
                numericAmount: parseFloat(t.amount.replace(/\./g, '')) || 0
            }));
        } else {
            console.log("No saved data found. Returning empty array.");
            return [];
        }
    } catch (error) {
        console.error("Error loading transactions:", error);
        return [];
    }
};

// --- Fungsi Add Transaksi (Memuat -> Menambah -> Menyimpan) ---
window.addTransactionToDB = function(data) {
    // 1. Muat data yang sudah ada
    let transactions = window.loadTransactions().map(t => ({
        id: t.id, // Pastikan formatnya kembali ke format dasar
        type: t.type,
        category: t.category,
        amount: t.amount,
        date: t.date
    }));

    // 2. Tentukan ID baru
    const newId = transactions.length > 0 ? transactions[0].id + 1 : 1; 

    // 3. Tambahkan transaksi baru
    const newTx = {
        id: newId,
        type: data.type,
        category: data.category,
        amount: data.amount,
        date: data.date
    };
    
    // Tambahkan di awal array agar urutannya terbaru di atas (DESC)
    transactions.unshift(newTx); 

    // 4. Simpan kembali seluruh array ke Local Storage
    window.saveTransactions(transactions);
    return true;
};

// ------------------------------------------------------------------
// --- LOGIKA CHARTING DATA (Tidak Ada Perubahan Logika) ---
// ------------------------------------------------------------------

window.getChartData = function(transactions) {
    const today = new Date();
    const monthlyData = {};
    for (let i = 0; i < 6; i++) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const key = d.toLocaleString('id-ID', { month: 'short', year: '2-digit' });
        monthlyData[key] = { income: 0, expense: 0, net: 0 };
    }
    
    const categoryTotals = {};

    transactions.forEach(t => {
        const txDate = new Date(t.date);
        const monthKey = txDate.toLocaleString('id-ID', { month: 'short', year: '2-digit' });
        // Gunakan numericAmount yang sudah ditambahkan di loadTransactions
        const amount = t.numericAmount;
            
        if (monthlyData[monthKey]) {
            if (t.type === 'income') {
                monthlyData[monthKey].income += amount;
                monthlyData[monthKey].net += amount;
            } else {
                monthlyData[monthKey].expense += amount;
                monthlyData[monthKey].net -= amount;
                
                if (t.category) {
                    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + amount;
                }
            }
        }
    });
    
    const sortedCategories = Object.entries(categoryTotals)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

    const monthlyArray = Object.entries(monthlyData)
        .sort(([keyA], [keyB]) => new Date('01 ' + keyA) - new Date('01 ' + keyB));
    
    return { monthlyArray, sortedCategories };
};