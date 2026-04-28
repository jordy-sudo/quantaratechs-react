import { motion } from "framer-motion";
import { useState } from "react";

export default function Footer() {
    const [status, setStatus] = useState("idle");
    const [feedback, setFeedback] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);

        setStatus("sending");
        setFeedback("");

        try {
            const response = await fetch("/api/lead", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: formData.get("email"),
                    source: "Hablemos de tu proyecto",
                }),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "No se pudo enviar el correo.");
            }

            form.reset();
            setStatus("success");
            setFeedback(data.message || "Correo enviado correctamente.");
        } catch (error) {
            setStatus("error");
            setFeedback(error.message || "No se pudo enviar el correo.");
        }
    }

    return (
        <motion.footer className="px-6 md:px-16 lg:px-24 xl:px-32 w-full text-sm text-brand-muted mt-40"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-14">
                <div className="sm:col-span-2 lg:col-span-1">
                    <a href="https://www.quantaratechs.com/">
                        <img className="h-10 w-auto" src="/assets/logo.png" width={139} height={40} alt="Quantara Tech" />
                    </a>
                    <p className="text-sm/7 mt-6">QuantaraTechs desarrolla software, integraciones y automatizaciones a la medida para ordenar y escalar operaciones con datos confiables.</p>
                </div>
                <div className="flex flex-col lg:items-center lg:justify-center">
                    <div className="flex flex-col text-sm space-y-2.5">
                        <h2 className="font-semibold mb-5 text-brand-ink">QuantaraTechs</h2>
                        <a className="hover:text-brand-accent transition" href="#hero">Inicio</a>
                        <a className="hover:text-brand-accent transition" href="#services">Servicios</a>
                        <a className="hover:text-brand-accent transition" href="#projects">Proyectos</a>
                        <a className="hover:text-brand-accent transition" href="#contact">Contacto</a>
                    </div>
                </div>
                <div>
                    <h2 className="font-semibold text-brand-ink mb-5">Hablemos de tu proyecto</h2>
                    <div className="text-sm space-y-6 max-w-sm">
                        <p>Déjanos tu correo y te contactamos para revisar requerimientos y definir el siguiente paso.</p>
                        <form onSubmit={handleSubmit}>
                            <div className="flex items-center justify-center gap-2 p-2 rounded-md bg-white border border-brand-line shadow-sm">
                                <input name="email" className="outline-none w-full max-w-64 py-2 rounded px-2" type="email" required placeholder="Ingresa tu correo" />
                                <button disabled={status === "sending"} className="bg-brand-primary px-4 py-2 text-white font-medium rounded disabled:cursor-not-allowed disabled:opacity-70">
                                    {status === "sending" ? "Enviando..." : "Enviar"}
                                </button>
                            </div>
                            {feedback && (
                                <p className={`mt-3 ${status === "success" ? "text-emerald-700" : "text-red-700"}`}>
                                    {feedback}
                                </p>
                            )}
                        </form>
                    </div>
                </div>
            </div>
            <p className="py-4 text-center border-t mt-6 border-brand-line">
                © 2026 Quantara. Todos los derechos reservados.
            </p>
        </motion.footer>
    );
};
