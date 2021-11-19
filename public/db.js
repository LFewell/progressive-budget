let db;
const request = window.indexedDB.open("budgetdb", 1);

request.onupgradeneeded = function (target) {
    const db = target.result;
    db.createObjectStore("temp", {autoIncrement: true});
}

request.onerror = function (e) {
    console.log("There was an error" + e.target.errorCode);

}

request.onsuccess = function (e) {
    db = e.target.result
    if (navigator.onLine) {
    checkDatabase();
    }
    
}

function checkDatabase() {
    const transaction = db.transaction(["temp"], "readwrite");
    const store = transaction.objectStore("temp");
    const getAll = store.getAll();

    getAll.onsuccess = function () {
        if (getAll.result.length > 0) {
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }
            })
            .then(res => {
                return res.json();
            })
            .then(() => {
                const transaction = db.transaction(["temp"], "readwrite");
                const store = transaction.objectStore("temp");
                store.clear();
            })
        }
    }
}

function saveRecord(record) {
    const transaction = db.transaction(["temp"], "readwrite");
    const store = transaction.objectStore("temp");
    store.add(record);
}

window.addEventListener("online", checkDatabase);