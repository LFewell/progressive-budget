let db;
const request = window.indexedDB.open("budgetdb", 1);

request.onupgradeneeded = function (e) {
    const db = request.result;
    db.createObjectStore("temp", {autoIncrement: true});
}

request.onerror = function (e) {
    console.log("There was an error");

    request.onsuccess = function (e) {
        db = request.result;
        
    }
}