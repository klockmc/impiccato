<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>L'Impiccato Multiplayer</title>
    <!-- Caricamento di Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');
        
        body {
            font-family: 'Montserrat', sans-serif;
            background-color: #1f2937; /* Sfondo scuro per contrasto */
            color: #f7f7f7;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .game-container {
            max-width: 900px;
            width: 95%;
            background-color: #374151; /* Grigio più scuro */
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
            padding: 30px;
        }
        /* Stile per il disegno dell'Impiccato (adattato per lo sfondo scuro) */
        .hangman-drawing {
            height: 250px;
            width: 150px;
            position: relative;
            margin: 20px auto;
        }
        /* Base (0 errori) */
        .hangman-drawing::before {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 150px;
            height: 10px;
            background-color: #a0522d; /* Marrone */
            border-radius: 2px;
        }
        /* Palo verticale (0 errori) */
        .hangman-drawing::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 10px;
            width: 10px;
            height: 250px;
            background-color: #a0522d;
            border-radius: 2px;
        }
        /* Trave orizzontale (1 errore) */
        .head-support {
            position: absolute;
            top: 10px;
            left: 10px;
            width: 100px;
            height: 10px;
            background-color: #a0522d;
            border-radius: 2px;
            visibility: hidden;
        }
        /* Corda (2 errori) */
        .head-rope {
            position: absolute;
            top: 20px;
            left: 100px;
            width: 5px;
            height: 30px;
            background-color: #8b4513; 
            visibility: hidden;
        }

        /* Parti del corpo (3-8 errori) */
        .hangman-part {
            position: absolute;
            background-color: white; /* Bianco su sfondo scuro */
            border-radius: 50%; 
            visibility: hidden;
        }
        
        /* Testa (3 errori) */
        .head {
            width: 40px;
            height: 40px;
            top: 45px;
            left: 85px;
            border: 5px solid white;
        }
        /* Corpo (4 errori) */
        .body {
            width: 5px;
            height: 70px;
            top: 85px;
            left: 105px;
            border-radius: 0;
        }
        /* Braccio Sinistro (5 errori) */
        .arm-l {
            width: 50px;
            height: 5px;
            top: 100px;
            left: 55px;
            transform: rotate(30deg);
            border-radius: 2px;
        }
        /* Braccio Destro (6 errori) */
        .arm-r {
            width: 50px;
            height: 5px;
            top: 100px;
            left: 100px;
            transform: rotate(-30deg);
            border-radius: 2px;
        }
        /* Gamba Sinistra (7 errori) */
        .leg-l {
            width: 50px;
            height: 5px;
            top: 155px;
            left: 60px;
            transform: rotate(30deg);
            border-radius: 2px;
        }
        /* Gamba Destra (8 errori) */
        .leg-r {
            width: 50px;
            height: 5px;
            top: 155px;
            left: 95px;
            transform: rotate(-30deg);
            border-radius: 2px;
        }

        /* Stile pulsanti Tastiera */
        .key-button {
            background-color: #10b981; /* Verde-blu per Indovino */
            color: white;
            padding: 8px 12px;
            margin: 4px;
            border-radius: 6px;
            font-weight: bold;
            transition: background-color 0.1s;
        }
        .key-button:hover:not(:disabled) {
            background-color: #059669;
        }
        .key-disabled-correct {
            background-color: #34d399; /* Verde chiaro */
            cursor: not-allowed;
        }
        .key-disabled-wrong {
            background-color: #f87171; /* Rosso tenue */
            cursor: not-allowed;
        }
        .key-button:disabled {
            opacity: 0.6;
        }

        .loader {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3b82f6;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            animation: spin 1s linear infinite;
            margin-right: 10px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

    </style>
</head>
<body>

    <div class="game-container">
        <h1 class="text-4xl font-bold text-center text-yellow-300 mb-6">L'Impiccato Multiplayer 👻</h1>

        <!-- Stato di Connessione -->
        <div id="statusMessage" class="mb-4 p-3 rounded-lg bg-gray-700 text-center">Connessione in corso...</div>
        
        <!-- SEZIONE LOBBY -->
        <div id="lobby" class="space-y-4 text-center">
            <h2 class="text-2xl mb-4 text-white">Lobby di Gioco</h2>
            <button id="btnCreateRoom" class="w-full py-3 rounded-lg bg-blue-500 hover:bg-blue-700 text-xl font-bold">
                Crea Nuova Stanza (Diventa L'Impostore)
            </button>
            <div id="activeRooms" class="max-h-40 overflow-y-auto p-3 bg-gray-700 rounded-lg my-4 space-y-2">
                <p class="text-gray-400">Nessuna stanza in attesa. Crea la prima!</p>
            </div>
            <p class="text-sm text-gray-400 mt-2">Il tuo ID Utente (Usalo per la stanza privata): <span id="userIdDisplay" class="font-mono text-yellow-300 break-all">In attesa...</span></p>
        </div>

        <!-- SEZIONE GIOCO -->
        <div id="gameArea" class="hidden">
            <h2 id="roomTitle" class="text-3xl font-bold mb-4 text-center">Stanza: </h2>
            <div class="flex flex-col md:flex-row justify-center items-center md:space-x-10">

                <!-- Disegno dell'Impiccato -->
                <div class="hangman-drawing">
                    <div class="head-support" id="part-1"></div>
                    <div class="head-rope" id="part-2"></div>
                    <div class="hangman-part head" id="part-3"></div>
                    <div class="hangman-part body" id="part-4"></div>
                    <div class="hangman-part arm-l" id="part-5"></div>
                    <div class="hangman-part arm-r" id="part-6"></div>
                    <div class="hangman-part leg-l" id="part-7"></div>
                    <div class="hangman-part leg-r" id="part-8"></div>
                </div>

                <!-- Interfaccia Testo e Input -->
                <div class="flex flex-col items-center w-full md:w-1/2">
                    <div class="text-xl font-semibold mb-2 text-gray-400">Impostore: <span id="impostoreName" class="text-yellow-300"></span></div>
                    <div class="text-xl font-semibold mb-4 text-gray-400">Indovino: <span id="indovinoName" class="text-yellow-300"></span></div>
                    
                    <div class="text-2xl font-semibold mb-4 text-gray-400">Categoria: <span id="categoryDisplay" class="text-white"></span></div>
                    
                    <!-- Parola Nascosta -->
                    <div id="wordDisplay" class="text-5xl font-bold tracking-widest my-8 p-4 bg-gray-600 rounded-lg text-white">
                        _ _ _ _ _
                    </div>

                    <!-- Stato del Gioco -->
                    <p class="text-xl mb-4 text-gray-400">Errori Rimanenti: <span id="remainingGuesses" class="font-bold text-red-500">8</span></p>

                    <!-- Messaggio Risultato / Istruzioni -->
                    <div id="messageBox" class="text-xl font-bold mb-6 h-10 flex items-center justify-center text-white"></div>
                    
                    <!-- Form per Impostare la Parola (Visibile solo all'Impostore in attesa) -->
                    <div id="wordSetterForm" class="w-full max-w-sm hidden space-y-4">
                        <input type="text" id="secretWordInput" placeholder="Inserisci la PAROLA SEGRETA (solo maiuscole)" class="w-full p-3 rounded-lg text-gray-900 focus:ring-blue-500 focus:border-blue-500">
                        <input type="text" id="categoryInput" placeholder="Inserisci la Categoria (es. Animale)" class="w-full p-3 rounded-lg text-gray-900 focus:ring-blue-500 focus:border-blue-500">
                        <button id="setWordButton" class="w-full py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-700 disabled:opacity-50">
                            Inizia Partita
                        </button>
                    </div>

                    <!-- Tastiera (Visibile solo all'Indovino) -->
                    <div id="keyboard" class="grid grid-cols-7 gap-2 hidden">
                        <!-- I pulsanti verranno inseriti qui -->
                    </div>

                    <!-- Pulsanti di Controllo -->
                    <div class="flex justify-center space-x-4 mt-8">
                        <button id="btnLeaveRoom" class="py-2 px-4 rounded-lg bg-red-500 hover:bg-red-700 font-bold">
                            Abbandona Stanza
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Moduli Firebase -->
    <script type="module">
        import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
        import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
        import { getFirestore, doc, setDoc, getDoc, onSnapshot, collection, query, where, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
        
        // --- CONFIGURAZIONE FIREBASE ---
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
        const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
        
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        const auth = getAuth(app);
        
        const COLLECTION_PATH = `artifacts/${appId}/public/data/hangman_rooms`;
        const MAX_ERRORS = 8;
        const HANGMAN_PARTS = [
            'part-1', 'part-2', 'part-3', 'part-4', 
            'part-5', 'part-6', 'part-7', 'part-8'
        ];

        // --- STATO LOCALE ---
        let currentUserId = null;
        let currentRoomId = null;
        let isImpostore = false;
        let roomUnsubscribe;

        // --- RIFERIMENTI DOM ---
        const statusMessage = document.getElementById('statusMessage');
        const userIdDisplay = document.getElementById('userIdDisplay');
        const lobbyDiv = document.getElementById('lobby');
        const gameAreaDiv = document.getElementById('gameArea');
        const btnCreateRoom = document.getElementById('btnCreateRoom');
        const activeRoomsDiv = document.getElementById('activeRooms');
        const btnLeaveRoom = document.getElementById('btnLeaveRoom');
        const roomTitle = document.getElementById('roomTitle');
        const impostoreName = document.getElementById('impostoreName');
        const indovinoName = document.getElementById('indovinoName');
        
        const wordDisplay = document.getElementById('wordDisplay');
        const categoryDisplay = document.getElementById('categoryDisplay');
        const remainingGuesses = document.getElementById('remainingGuesses');
        const keyboardDiv = document.getElementById('keyboard');
        const messageBox = document.getElementById('messageBox');
        const wordSetterForm = document.getElementById('wordSetterForm');
        const secretWordInput = document.getElementById('secretWordInput');
        const categoryInput = document.getElementById('categoryInput');
        const setWordButton = document.getElementById('setWordButton');


        // --- FUNZIONI UTILITY ---
        function generateRoomId() {
            return `impiccato-${Math.random().toString(36).substring(2, 8)}`;
        }
        
        function switchView(view) {
            lobbyDiv.classList.toggle('hidden', view !== 'lobby');
            gameAreaDiv.classList.toggle('hidden', view !== 'game');
        }

        function setStatus(message, colorClass = 'bg-gray-700') {
            statusMessage.textContent = message;
            statusMessage.className = `mb-4 p-3 rounded-lg ${colorClass} text-center`;
        }

        /**
         * Genera la stringa iniziale per la parola nascosta.
         * @param {string} word - La parola segreta.
         * @returns {string} Stringa di underscore.
         */
        function initializeHiddenWord(word) {
            return Array(word.length).fill('_').join('');
        }
        
        /**
         * Aggiorna la parola nascosta in base alle lettere indovinate.
         * @param {string} secretWord - La parola segreta.
         * @param {string} hiddenWordStr - La stringa attuale (es. "_O___").
         * @param {string} guess - La lettera appena indovinata.
         * @returns {string} La nuova stringa nascosta.
         */
        function updateHiddenWord(secretWord, hiddenWordStr, guess) {
            let newHidden = hiddenWordStr.split('');
            for (let i = 0; i < secretWord.length; i++) {
                if (secretWord[i] === guess) {
                    newHidden[i] = guess;
                }
            }
            return newHidden.join('');
        }

        // --- GESTIONE FIREBASE E LOBBY ---

        async function authenticate() {
            try {
                if (initialAuthToken) {
                    await signInWithCustomToken(auth, initialAuthToken);
                } else {
                    await signInAnonymously(auth);
                }
            } catch (error) {
                console.error("Errore di autenticazione Firebase:", error);
                setStatus(`Errore di connessione: ${error.message}`, 'bg-red-700');
            }
        }

        async function createRoom() {
            if (!currentUserId) return;
            const roomId = generateRoomId();
            const roomRef = doc(db, COLLECTION_PATH, roomId);

            const newGame = {
                roomId: roomId,
                status: 'setting_word', // Nuovo stato iniziale
                hostId: currentUserId,
                guesserId: null,
                players: [{ id: currentUserId, role: 'Impostore', displayName: `Impostore (${currentUserId.substring(0, 4)})` }],
                secretWord: null,
                category: null,
                hiddenWord: null,
                guessedLetters: [],
                wrongGuesses: 0,
                winner: null
            };

            try {
                await setDoc(roomRef, newGame);
                isImpostore = true;
                currentRoomId = roomId;
                setStatus(`Stanza creata: ${roomId}. Scegli la parola!`, 'bg-yellow-600');
                startListeningToRoom(roomId);
            } catch (e) {
                setStatus(`Errore durante la creazione della stanza: ${e.message}`, 'bg-red-700');
                console.error("Errore aggiungendo il documento:", e);
            }
        }

        async function joinRoom(roomId) {
            if (!currentUserId || currentRoomId) return;
            
            const roomRef = doc(db, COLLECTION_PATH, roomId);
            const roomSnap = await getDoc(roomRef);

            if (!roomSnap.exists()) {
                setStatus('Stanza non trovata.', 'bg-red-700');
                return;
            }

            const room = roomSnap.data();

            if (room.hostId === currentUserId) {
                // Riconnessione come Impostore
                isImpostore = true;
                currentRoomId = roomId;
                setStatus('Riconnesso come Impostore.', 'bg-blue-600');
                startListeningToRoom(roomId);
            } else if (!room.guesserId) {
                // Unione come Indovino
                const player2 = { id: currentUserId, role: 'Indovino', displayName: `Indovino (${currentUserId.substring(0, 4)})` };
                
                await updateDoc(roomRef, {
                    guesserId: currentUserId,
                    players: [...room.players, player2],
                    // Lo stato rimane 'setting_word' se l'Impostore non ha ancora impostato la parola
                    // Oppure diventa 'playing' se l'Impostore l'ha già fatto
                    status: room.secretWord ? 'playing' : 'setting_word'
                });
                
                isImpostore = false;
                currentRoomId = roomId;
                setStatus('Sei entrato! Aspetta che l\'Impostore scelga la parola.', 'bg-green-600');
                startListeningToRoom(roomId);
            } else {
                setStatus('Stanza piena o non disponibile.', 'bg-red-700');
            }
        }

        async function leaveRoom() {
            if (!currentRoomId) return;
            
            const roomRef = doc(db, COLLECTION_PATH, currentRoomId);
            
            try {
                // Semplificazione: elimina la stanza se un giocatore la abbandona
                await deleteDoc(roomRef);
                setStatus('Hai abbandonato la stanza. La partita è stata chiusa.', 'bg-gray-600');
            } catch (e) {
                console.error("Errore abbandonando la stanza:", e);
                setStatus('Errore durante l\'abbandono della stanza.', 'bg-red-700');
            } finally {
                currentRoomId = null;
                isImpostore = false;
                switchView('lobby');
                listenToRooms();
            }
        }

        // --- GESTIONE STATO STANZA E RENDERING ---

        function startListeningToRoom(roomId) {
            const roomRef = doc(db, COLLECTION_PATH, roomId);

            if (typeof roomUnsubscribe === 'function') {
                roomUnsubscribe(); // Ferma l'ascolto della lobby
            }

            roomUnsubscribe = onSnapshot(roomRef, (docSnap) => {
                if (docSnap.exists()) {
                    renderGame(docSnap.data());
                } else {
                    currentRoomId = null;
                    isImpostore = false;
                    setStatus('La stanza è stata chiusa dall\'altro giocatore.', 'bg-gray-600');
                    switchView('lobby');
                    listenToRooms();
                }
            }, (error) => {
                console.error("Errore nell'ascolto della stanza:", error);
                setStatus(`Errore di sincronizzazione: ${error.message}`, 'bg-red-700');
            });

            switchView('game');
        }

        function listenToRooms() {
             const roomsQuery = query(
                collection(db, COLLECTION_PATH),
                where('guesserId', '==', null) // Mostra solo le stanze in attesa dell'Indovino
            );

            // Sottoscrizione
            roomUnsubscribe = onSnapshot(roomsQuery, (querySnapshot) => {
                const rooms = [];
                querySnapshot.forEach((doc) => {
                    rooms.push(doc.data());
                });
                renderLobbyRooms(rooms);
            }, (error) => {
                console.error("Errore nell'ascolto delle stanze:", error);
                setStatus('Errore nel caricamento delle stanze.', 'bg-red-700');
            });
        }

        function renderLobbyRooms(rooms) {
            activeRoomsDiv.innerHTML = '';
            
            if (rooms.length === 0) {
                activeRoomsDiv.innerHTML = '<p class="text-gray-400">Nessuna stanza in attesa. Crea la prima!</p>';
                return;
            }

            rooms.forEach(room => {
                const hostName = room.players[0] ? room.players[0].displayName : 'Sconosciuto';
                const roomDiv = document.createElement('div');
                roomDiv.className = 'flex justify-between items-center p-2 my-2 bg-gray-800 rounded-lg';
                roomDiv.innerHTML = `
                    <span class="text-sm">${room.roomId} (Host: ${hostName})</span>
                    <button data-room-id="${room.roomId}" class="btn-join text-sm py-1 px-3 rounded bg-green-500 hover:bg-green-700 font-bold">
                        Unisciti
                    </button>
                `;
                activeRoomsDiv.appendChild(roomDiv);
            });

            activeRoomsDiv.querySelectorAll('.btn-join').forEach(button => {
                button.addEventListener('click', (e) => joinRoom(e.target.dataset.roomId));
            });
        }

        // --- LOGICA DI GIOCO ---

        /**
         * Disegna lo stato corrente della partita.
         * @param {object} room - Lo stato della stanza ricevuto da Firestore.
         */
        function renderGame(room) {
            roomTitle.textContent = `Stanza: ${room.roomId}`;
            
            const hostPlayer = room.players.find(p => p.role === 'Impostore');
            const guesserPlayer = room.players.find(p => p.role === 'Indovino');
            
            impostoreName.textContent = hostPlayer ? hostPlayer.displayName : 'In attesa...';
            indovinoName.textContent = guesserPlayer ? guesserPlayer.displayName : 'In attesa...';

            // 1. GESTIONE STATI
            keyboardDiv.classList.add('hidden');
            wordSetterForm.classList.add('hidden');
            messageBox.textContent = '';
            messageBox.classList.remove('text-green-600', 'text-red-600');
            
            if (room.status === 'setting_word') {
                wordDisplay.textContent = '...';
                categoryDisplay.textContent = '...';
                remainingGuesses.textContent = MAX_ERRORS;
                
                if (isImpostore) {
                    setStatus('Imposta la parola segreta e la categoria.', 'bg-yellow-600');
                    wordSetterForm.classList.remove('hidden');
                } else {
                    setStatus('In attesa che l\'Impostore scelga la parola...', 'bg-gray-600');
                }
            } else if (room.status === 'playing') {
                // Stato di Gioco Attivo
                setStatus('Partita in corso. Indovina una lettera!', 'bg-blue-600');
                wordDisplay.textContent = room.hiddenWord ? room.hiddenWord.split('').join(' ') : '...';
                categoryDisplay.textContent = room.category || 'Nessuna';
                remainingGuesses.textContent = MAX_ERRORS - room.wrongGuesses;
                
                // Mostra la tastiera solo all'Indovino
                if (!isImpostore) {
                    keyboardDiv.classList.remove('hidden');
                    updateKeyboard(room.guessedLetters);
                } else {
                    messageBox.textContent = `La parola segreta è: ${room.secretWord}`;
                    messageBox.classList.add('text-yellow-300');
                }
            } else if (room.status === 'finished') {
                // Stato di Gioco Finito
                wordDisplay.textContent = room.secretWord.split('').join(' ');
                remainingGuesses.textContent = 0;
                
                const winMessage = room.winner === 'Guesser' ? 
                    'L\'INDOVINO HA VINTO! 🎉' : 
                    'L\'IMPOSTORE HA VINTO! 😢';
                
                messageBox.textContent = winMessage;
                messageBox.classList.add(room.winner === 'Guesser' ? 'text-green-500' : 'text-red-500');
                setStatus('Partita Terminata.', 'bg-gray-700');
            }


            // 2. RENDERING DISEGNO
            HANGMAN_PARTS.forEach((id, index) => {
                const part = document.getElementById(id);
                part.style.visibility = index < room.wrongGuesses ? 'visible' : 'hidden';
            });
        }

        /**
         * Genera la tastiera o aggiorna lo stato dei tasti.
         * @param {Array<string>} guessedLetters - Lettere già tentate.
         */
        function updateKeyboard(guessedLetters) {
            if (keyboardDiv.innerHTML === '' || guessedLetters.length === 0) {
                keyboardDiv.innerHTML = '';
                for (let i = 0; i < 26; i++) {
                    const letter = String.fromCharCode(65 + i);
                    const button = document.createElement('button');
                    button.textContent = letter;
                    button.id = `key-${letter}`;
                    button.className = 'key-button';
                    button.disabled = false;
                    button.classList.remove('key-disabled-correct', 'key-disabled-wrong');
                    button.onclick = () => handleGuess(letter);
                    keyboardDiv.appendChild(button);
                }
            }
            
            // Aggiorna classi per i tasti già usati
            guessedLetters.forEach(letter => {
                const button = document.getElementById(`key-${letter}`);
                if (button) {
                    button.disabled = true;
                    // Determina se il tasto era corretto o sbagliato (non possiamo saperlo solo dalla lista guess, 
                    // ma lo facciamo per semplicità visiva, assumendo che i tasti siano stati aggiornati in-memory)
                    // Per la logica multiplayer, il controllo lo fa la funzione successiva:
                    const isCorrect = updateHiddenWord(roomSnapshot.secretWord, roomSnapshot.hiddenWord, letter) !== roomSnapshot.hiddenWord;
                    button.classList.add(isCorrect ? 'key-disabled-correct' : 'key-disabled-wrong');
                }
            });
        }
        
        let roomSnapshot = {}; // Variabile per tenere traccia dello stato locale più recente

        // Sovrascrive la funzione per aggiornare lo stato di gioco su Firestore
        async function handleGuess(letter) {
            if (!currentRoomId || isImpostore || roomSnapshot.status !== 'playing') return;

            const roomRef = doc(db, COLLECTION_PATH, currentRoomId);
            const { secretWord, hiddenWord, guessedLetters, wrongGuesses } = roomSnapshot;

            if (guessedLetters.includes(letter)) return;
            
            const newGuessedLetters = [...guessedLetters, letter];
            let newWrongGuesses = wrongGuesses;
            let newHiddenWord = hiddenWord;
            let newStatus = 'playing';
            let winner = null;
            let found = false;
            
            if (secretWord.includes(letter)) {
                // Lettera corretta
                newHiddenWord = updateHiddenWord(secretWord, hiddenWord, letter);
                if (newHiddenWord === secretWord) {
                    newStatus = 'finished';
                    winner = 'Guesser';
                }
                found = true;
            } else {
                // Lettera sbagliata
                newWrongGuesses++;
                if (newWrongGuesses >= MAX_ERRORS) {
                    newStatus = 'finished';
                    winner = 'Impostore';
                }
            }

            try {
                await updateDoc(roomRef, {
                    guessedLetters: newGuessedLetters,
                    wrongGuesses: newWrongGuesses,
                    hiddenWord: newHiddenWord,
                    status: newStatus,
                    winner: winner
                });
                
                // Aggiorna lo stato del pulsante (visibile solo a chi indovina)
                const button = document.getElementById(`key-${letter}`);
                if (button) {
                    button.disabled = true;
                    button.classList.add(found ? 'key-disabled-correct' : 'key-disabled-wrong');
                }

            } catch (e) {
                console.error("Errore durante l'aggiornamento della mossa:", e);
                setStatus('Errore nell\'aggiornamento della mossa. Riprova.', 'bg-red-700');
            }
        }
        
        // Logica per l'Impostore per impostare la parola
        setWordButton.addEventListener('click', async () => {
            if (!currentRoomId || !isImpostore) return;

            const secret = secretWordInput.value.trim().toUpperCase();
            const category = categoryInput.value.trim();
            
            if (secret.length < 3 || category.length < 1 || !/^[A-Z]+$/.test(secret)) {
                messageBox.textContent = 'Parola (solo maiuscole) e Categoria sono obbligatorie.';
                messageBox.classList.add('text-red-500');
                return;
            }

            const roomRef = doc(db, COLLECTION_PATH, currentRoomId);
            try {
                await updateDoc(roomRef, {
                    secretWord: secret,
                    category: category,
                    hiddenWord: initializeHiddenWord(secret),
                    status: 'playing' // Inizia la partita
                });
                messageBox.textContent = '';
                setStatus('Partita avviata! L\'Indovino sta giocando...', 'bg-green-600');
            } catch (e) {
                console.error("Errore impostando la parola:", e);
                setStatus('Errore nell\'avvio della partita.', 'bg-red-700');
            }
        });


        // --- INIZIALIZZAZIONE ---

        onAuthStateChanged(auth, (user) => {
            if (user) {
                currentUserId = user.uid;
                userIdDisplay.textContent = currentUserId;
                setStatus('Connesso al server. Scegli o crea una stanza.', 'bg-green-600');
                
                btnCreateRoom.addEventListener('click', createRoom);
                btnLeaveRoom.addEventListener('click', leaveRoom);
                
                listenToRooms();
            } else {
                setStatus('Autenticazione in corso...', 'bg-blue-600');
                authenticate();
            }
        });

    </script>
</body>
</html>
