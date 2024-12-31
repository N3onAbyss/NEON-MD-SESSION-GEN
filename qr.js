const PastebinAPI = require('pastebin-js'),
pastebin = new PastebinAPI('EMWTMkQAVfJa9kM-MRUrxd5Oku1U7pgL')
const {makeid} = require('./id');
const QRCode = require('qrcode');
const express = require('express');
const path = require('path');
const fs = require('fs');
let router = express.Router()
const pino = require("pino");
const {
	default: Neon_Abyss,
	useMultiFileAuthState,
	jidNormalizedUser,
	Browsers,
	delay,
	makeInMemoryStore,
} = require("@whiskeysockets/baileys");

function removeFile(FilePath) {
	if (!fs.existsSync(FilePath)) return false;
	fs.rmSync(FilePath, {
		recursive: true,
		force: true
	})
};
const {
	readFile
} = require("node:fs/promises")
router.get('/', async (req, res) => {
	const id = makeid();
	async function NEON_MD_QR_CODE() {
		const {
			state,
			saveCreds
		} = await useMultiFileAuthState('./temp/' + id)
		try {
			let Qr_Code_By_Neon_Abyss = Neon_Abyss({
				auth: state,
				printQRInTerminal: false,
				logger: pino({
					level: "silent"
				}),
				browser: Browsers.macOS("Desktop"),
			});

			Qr_Code_By_Neon_Abyss.ev.on('creds.update', saveCreds)
			Qr_Code_By_Neon_Abyss.ev.on("connection.update", async (s) => {
				const {
					connection,
					lastDisconnect,
					qr
				} = s;
				if (qr) await res.end(await QRCode.toBuffer(qr));
				if (connection == "open") {
					await delay(5000);
					let data = fs.readFileSync(__dirname + `/temp/${id}/creds.json`);
					await delay(800);
				   let b64data = Buffer.from(data).toString('base64');
				   let session = await Qr_Code_By_Neon_Abyss.sendMessage(Qr_Code_By_Neon_Abyss.user.id, { text: '' + b64data });
	
				   let NEON_MD_TEXT = `
*_Qr Code By Neon Abyss_*
*_Made With 🤍_*
______________________________________
*_Pair Code Connected by Neon Abyss_*
*_Made With 🤍_*
______________________________________
╔════◇
║ *『 WOW YOU CHOOSEN NEON-MD 』*
║ _You Have Completed the First Step to Deploy a Whatsapp Bot._
╚══════════════════════╝
╔═════◇
║  『••• 𝗩𝗶𝘀𝗶𝘁 𝗙𝗼𝗿 𝗛𝗲𝗹𝗽 •••』
║❒ *Ytube:* _ComingSoon_
║❒ *Owner:* _https://wa.me/263713431767_
║❒ *Repo:* _https://github.com/N3onAbyss/NEON-MD_
║❒ *WaGroup:* _https://whatsapp.com/channel/0029Vb0mA2i3QxS2C1kvFp3p_
║❒ *WaChannel:* _https://whatsapp.com/channel/0029Vb0mA2i3QxS2C1kvFp3p_
║❒ *Plugins:* _https://github.com/N3onAbyss/neon-md-plugins_
╚══════════════════════╝ 
_____________________________________
	
_Don't Forget To Give Star To My Repo_`
	 await Qr_Code_By_Neon_Abyss.sendMessage(Qr_Code_By_Neon_Abyss.user.id,{text:Neon_MD_TEXT},{quoted:session})



					await delay(100);
					await Qr_Code_By_Neon_Abyss.ws.close();
					return await removeFile("temp/" + id);
				} else if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401) {
					await delay(10000);
					NEON_MD_QR_CODE();
				}
			});
		} catch (err) {
			if (!res.headersSent) {
				await res.json({
					code: "Service is Currently Unavailable"
				});
			}
			console.log(err);
			await removeFile("temp/" + id);
		}
	}
	return await NEON_MD_QR_CODE()
});
module.exports = router
