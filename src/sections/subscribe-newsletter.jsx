import SectionTitle from "../components/section-title";
import { motion } from "framer-motion";
import { useState } from "react";

export default function SubscribeNewsletter() {
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
                    source: "Déjanos tus datos",
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
        <section className="flex flex-col items-center">
            <SectionTitle title="Déjanos tus datos" description="Te contactamos pronto para revisar tu necesidad y definir el siguiente paso." />
            <motion.form
                onSubmit={handleSubmit}
                className="mt-10 max-w-xl w-full"
                initial={{ y: 150, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
            >
                <div className="flex items-center justify-center border border-brand-line bg-white focus-within:outline focus-within:outline-brand-accent text-sm rounded-full h-14 w-full shadow-sm">
                    <input name="email" type="email" required className="bg-transparent outline-none rounded-full px-4 h-full flex-1 placeholder:text-brand-muted" placeholder="Ingresa tu correo de contacto" />
                    <button disabled={status === "sending"} className="bg-brand-primary text-white font-medium rounded-full h-11 mr-1 px-10 flex items-center justify-center hover:bg-[#132C49] active:scale-95 transition disabled:cursor-not-allowed disabled:opacity-70">
                        {status === "sending" ? "Enviando..." : "Enviar"}
                    </button>
                </div>
                {feedback && (
                    <p className={`mt-3 text-center text-sm ${status === "success" ? "text-emerald-700" : "text-red-700"}`}>
                        {feedback}
                    </p>
                )}
            </motion.form>
        </section>
    );
}
