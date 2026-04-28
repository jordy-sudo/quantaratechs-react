import SectionTitle from "../components/section-title";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function GetInTouch() {
    const [status, setStatus] = useState("idle");
    const [feedback, setFeedback] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const payload = {
            name: formData.get("name"),
            email: formData.get("email"),
            message: formData.get("message"),
        };

        setStatus("sending");
        setFeedback("");

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "No se pudo enviar el mensaje.");
            }

            form.reset();
            setStatus("success");
            setFeedback(data.message || "Mensaje enviado correctamente.");
        } catch (error) {
            setStatus("error");
            setFeedback(error.message || "No se pudo enviar el mensaje.");
        }
    }

    return (
        <section className="flex flex-col items-center" id="contact">
            <SectionTitle title="Contacto directo" description="Cuéntanos qué necesitas y te proponemos una solución tecnológica alineada a tu negocio." />
            <form onSubmit={handleSubmit} className='grid sm:grid-cols-2 gap-3 sm:gap-5 max-w-3xl mx-auto text-brand-muted mt-16 w-full' >
                <motion.div
                    initial={{ y: 150, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                >
                    <label className='font-medium text-brand-ink'>Nombre</label>
                    <input name='name' type="text" placeholder='Ingresa tu nombre' required className='w-full mt-2 p-3 outline-none border border-brand-line bg-white rounded-lg focus-within:ring-1 transition focus:ring-brand-accent' />
                </motion.div>

                <motion.div
                    initial={{ y: 150, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 280, damping: 70, mass: 1 }}
                >
                    <label className='font-medium text-brand-ink'>Correo electrónico</label>
                    <input name='email' type="email" placeholder='Ingresa tu correo' required className='w-full mt-2 p-3 outline-none border border-brand-line bg-white rounded-lg focus-within:ring-1 transition focus:ring-brand-accent' />
                </motion.div>

                <motion.div className='sm:col-span-2'
                    initial={{ y: 150, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 240, damping: 70, mass: 1 }}
                >
                    <label className='font-medium text-brand-ink'>Mensaje</label>
                    <textarea name='message' rows={8} placeholder='Cuéntanos sobre tu proyecto' required className='resize-none w-full mt-2 p-3 outline-none rounded-lg focus-within:ring-1 transition focus:ring-brand-accent border border-brand-line bg-white' />
                </motion.div>

                {feedback && (
                    <motion.p
                        className={`sm:col-span-2 flex items-center gap-2 rounded-lg border px-4 py-3 ${status === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {status === "success" && <CheckCircle2 className="size-4" />}
                        {feedback}
                    </motion.p>
                )}

                <motion.button type='submit' disabled={status === "sending"} className='w-max flex items-center gap-2 bg-brand-primary hover:bg-[#132C49] text-white font-medium px-8 py-3 rounded-full disabled:cursor-not-allowed disabled:opacity-70'
                    initial={{ y: 150, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 280, damping: 70, mass: 1 }}
                >
                    {status === "sending" ? "Enviando..." : "Enviar mensaje"}
                    <ArrowUpRight className="size-4.5" />
                </motion.button>
            </form>
        </section>
    );
}
