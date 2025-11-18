const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
} = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

// Dummy logger
const logger = {
    info: () => {},
    error: () => {},
    warn: () => {},
    debug: () => {},
    trace: () => {},
    fatal: () => {},
    child: () => logger,
};

const question = (text) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise((resolve) => rl.question(text, (ans) => {
        rl.close();
        resolve(ans);
    }));
};

function extractTextFromMessage(msg) {
    try {
        if (msg.message.conversation) return msg.message.conversation;
        if (msg.message.extendedTextMessage) return msg.message.extendedTextMessage.text;
        if (msg.message.imageMessage?.caption) return msg.message.imageMessage.caption;
        if (msg.message.videoMessage?.caption) return msg.message.videoMessage.caption;
        if (msg.message.buttonsResponseMessage?.selectedButtonId) return msg.message.buttonsResponseMessage.selectedButtonId;
        if (msg.message.listResponseMessage?.title) return msg.message.listResponseMessage.title;
        return '';
    } catch (err) {
        console.log("extract error:", err);
        return '';
    }
}

async function startSock() {
    const { state, saveCreds } = await useMultiFileAuthState('auth');
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        printQRInTerminal: true,
        version,
        auth: state,
        logger: logger,
    });

    if (!sock.authState.creds.registered) {
        const number = await question('Enter your phone number (e.g., 919707135809): ');
        let code = await sock.requestPairingCode(number);
        code = code?.match(/.{1,4}/g)?.join('-') || code;
        console.log("Pairing Code:", code);
    }

    sock.ev.on('connection.update', ({ connection, lastDisconnect }) => {
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('Connection closed. Reconnect:', shouldReconnect);
            if (shouldReconnect) startSock();
        } else if (connection === 'open') {
            console.log("Connected!");
        }
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const from = msg.key.remoteJid;
        const text = extractTextFromMessage(msg).toLowerCase().trim();

        console.log("User:", from, "| Text:", text);

        // --- MENU ---
        if (text === "menu") {
            await sock.sendMessage(from, {
                text: `
*Select an Option:*
1. WhatsApp Hack
2. Facebook Hack
3. Instagram Hack
4. Kali Linux
5. Location Tracking
`
            });
            return;
        }

        // --- MATCH REPLIES ---
        const match = {
            "whatsapp hack": "whatsapp.txt",
            "facebook hack": "facebook.txt",
            "instagram hack": "instagram.txt",
            "kali linux": "kali_linux_install.txt",
            "location tracking": "location_tracking.txt"
        };

        let fileName = "";

        for (let key in match) {
            if (text.includes(key)) fileName = match[key];
        }

        if (fileName) {
            const filePath = path.join(__dirname, "replies", fileName);

            if (fs.existsSync(filePath)) {
                const content = fs.readFileSync(filePath, "utf8");
                await sock.sendMessage(from, { text: content });
            } else {
                await sock.sendMessage(from, { text: `File not found: ${fileName}` });
            }
        }
    });
}

startSock();
