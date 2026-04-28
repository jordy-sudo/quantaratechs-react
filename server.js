import "dotenv/config";
import express from "express";
import nodemailer from "nodemailer";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const port = Number(process.env.PORT || 3001);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json({ limit: "32kb" }));

const requiredMailVars = [
    "MAIL_HOST",
    "MAIL_PORT",
    "MAIL_USERNAME",
    "MAIL_PASSWORD",
];

function getMissingMailVars() {
    return requiredMailVars.filter((key) => !process.env[key]);
}

function createTransporter() {
    const encryption = process.env.MAIL_ENCRYPTION?.toLowerCase();

    return nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT || 465),
        secure: encryption === "ssl" || Number(process.env.MAIL_PORT) === 465,
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
        },
    });
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

app.post("/api/contact", async (req, res) => {
    const { name = "", email = "", message = "" } = req.body || {};
    const cleanName = String(name).trim();
    const cleanEmail = String(email).trim();
    const cleanMessage = String(message).trim();

    if (!cleanName || !cleanEmail || !cleanMessage) {
        return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }

    if (!isValidEmail(cleanEmail)) {
        return res.status(400).json({ message: "Ingresa un correo electrónico válido." });
    }

    const missingVars = getMissingMailVars();
    if (missingVars.length > 0) {
        return res.status(500).json({
            message: `Faltan variables SMTP: ${missingVars.join(", ")}.`,
        });
    }

    try {
        const transporter = createTransporter();
        const to = process.env.MAIL_TO || process.env.MAIL_USERNAME;
        const fromName = process.env.MAIL_FROM_NAME || "QuantaraTechs";

        await transporter.sendMail({
            from: `"${fromName}" <${process.env.MAIL_USERNAME}>`,
            to,
            replyTo: cleanEmail,
            subject: `Nuevo contacto de ${cleanName}`,
            text: [
                "Nuevo mensaje desde el formulario de contacto.",
                "",
                `Nombre: ${cleanName}`,
                `Correo: ${cleanEmail}`,
                "",
                "Mensaje:",
                cleanMessage,
            ].join("\n"),
            html: `
                <h2>Nuevo mensaje desde el formulario de contacto</h2>
                <p><strong>Nombre:</strong> ${escapeHtml(cleanName)}</p>
                <p><strong>Correo:</strong> ${escapeHtml(cleanEmail)}</p>
                <p><strong>Mensaje:</strong></p>
                <p>${escapeHtml(cleanMessage).replaceAll("\n", "<br>")}</p>
            `,
        });

        return res.json({ message: "Mensaje enviado correctamente." });
    } catch (error) {
        console.error("Error sending contact email:", error);
        return res.status(500).json({
            message: "No se pudo enviar el mensaje. Intenta nuevamente.",
        });
    }
});

app.post("/api/lead", async (req, res) => {
    const { email = "", source = "Formulario de correo" } = req.body || {};
    const cleanEmail = String(email).trim();
    const cleanSource = String(source).trim() || "Formulario de correo";

    if (!cleanEmail) {
        return res.status(400).json({ message: "Ingresa tu correo electrónico." });
    }

    if (!isValidEmail(cleanEmail)) {
        return res.status(400).json({ message: "Ingresa un correo electrónico válido." });
    }

    const missingVars = getMissingMailVars();
    if (missingVars.length > 0) {
        return res.status(500).json({
            message: `Faltan variables SMTP: ${missingVars.join(", ")}.`,
        });
    }

    try {
        const transporter = createTransporter();
        const to = process.env.MAIL_TO || process.env.MAIL_USERNAME;
        const fromName = process.env.MAIL_FROM_NAME || "QuantaraTechs";

        await transporter.sendMail({
            from: `"${fromName}" <${process.env.MAIL_USERNAME}>`,
            to,
            replyTo: cleanEmail,
            subject: `Nuevo correo recibido - ${cleanSource}`,
            text: [
                "Nuevo correo recibido desde la pagina web.",
                "",
                `Origen: ${cleanSource}`,
                `Correo: ${cleanEmail}`,
            ].join("\n"),
            html: `
                <h2>Nuevo correo recibido desde la pagina web</h2>
                <p><strong>Origen:</strong> ${escapeHtml(cleanSource)}</p>
                <p><strong>Correo:</strong> ${escapeHtml(cleanEmail)}</p>
            `,
        });

        return res.json({ message: "Correo enviado correctamente." });
    } catch (error) {
        console.error("Error sending lead email:", error);
        return res.status(500).json({
            message: "No se pudo enviar el correo. Intenta nuevamente.",
        });
    }
});

app.use(express.static(path.join(__dirname, "dist")));

app.get(/.*/, (_req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(port, () => {
    console.log(`API server running on http://127.0.0.1:${port}`);
});
