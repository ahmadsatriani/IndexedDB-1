// script.js
const dbPromise = idb.open('mahasiswa-db', 1, upgradeDB => {
    if (!upgradeDB.objectStoreNames.contains('mahasiswa')) {
        upgradeDB.createObjectStore('mahasiswa', { keyPath: 'nim' });
    }
});

const form = document.getElementById('mahasiswa-form');
const namaInput = document.getElementById('nama');
const nimInput = document.getElementById('nim');
const listContainer = document.getElementById('list');

form.addEventListener('submit', event => {
    event.preventDefault();

    const nama = namaInput.value;
    const nim = nimInput.value;

    if (nama && nim) {
        addMahasiswa({ nama, nim });
        namaInput.value = '';
        nimInput.value = '';
    }
});

function addMahasiswa(mahasiswa) {
    dbPromise.then(db => {
        const tx = db.transaction('mahasiswa', 'readwrite');
        const store = tx.objectStore('mahasiswa');
        store.put(mahasiswa);
        return tx.complete;
    }).then(() => {
        console.log('Mahasiswa berhasil ditambahkan');
        showMahasiswa();
    });
}

function showMahasiswa() {
    listContainer.innerHTML = '';

    dbPromise.then(db => {
        const tx = db.transaction('mahasiswa', 'readonly');
        const store = tx.objectStore('mahasiswa');
        return store.getAll();
    }).then(mahasiswa => {
        mahasiswa.forEach(m => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `${m.nama} - ${m.nim} <button data-nim="${m.nim}" class="delete">Hapus</button>`;
            listContainer.appendChild(listItem);
        });
    });
}

listContainer.addEventListener('click', event => {
    if (event.target.classList.contains('delete')) {
        const nim = event.target.getAttribute('data-nim');
        deleteMahasiswa(nim);
    }
});

function deleteMahasiswa(nim) {
    dbPromise.then(db => {
        const tx = db.transaction('mahasiswa', 'readwrite');
        const store = tx.objectStore('mahasiswa');
        store.delete(nim);
        return tx.complete;
    }).then(() => {
        console.log('Mahasiswa dengan NIM ' + nim + ' berhasil dihapus');
        showMahasiswa();
    });
}

showMahasiswa();
