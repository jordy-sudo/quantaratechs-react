import SectionTitle from "../components/section-title";
import { ArrowUpRight, SendIcon } from "lucide-react";
import { motion } from "framer-motion";

export default function GetInTouch() {
    return (
        <section className="flex flex-col items-center" id="contact">
            <SectionTitle title="Contacto directo" description="Cuéntanos qué necesitas y te proponemos una solución tecnológica alineada a tu negocio." />
            <form onSubmit={(e) => e.preventDefault()} className='grid sm:grid-cols-2 gap-3 sm:gap-5 max-w-3xl mx-auto text-brand-muted mt-16 w-full' >
                <motion.div
                    initial={{ y: 150, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                >
                    <label className='font-medium text-white'>Nombre</label>
                    <input name='name' type="text" placeholder='Ingresa tu nombre' className='w-full mt-2 p-3 outline-none border border-brand-primary/60 bg-brand-deep/40 rounded-lg focus-within:ring-1 transition focus:ring-brand-accent' />
                </motion.div>

                <motion.div
                    initial={{ y: 150, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 280, damping: 70, mass: 1 }}
                >
                    <label className='font-medium text-white'>Correo electrónico</label>
                    <input name='email' type="email" placeholder='Ingresa tu correo' className='w-full mt-2 p-3 outline-none border border-brand-primary/60 bg-brand-deep/40 rounded-lg focus-within:ring-1 transition focus:ring-brand-accent' />
                </motion.div>

                <motion.div className='sm:col-span-2'
                    initial={{ y: 150, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 240, damping: 70, mass: 1 }}
                >
                    <label className='font-medium text-white'>Mensaje</label>
                    <textarea name='message' rows={8} placeholder='Cuéntanos sobre tu proyecto' className='resize-none w-full mt-2 p-3 outline-none rounded-lg focus-within:ring-1 transition focus:ring-brand-accent border border-brand-primary/60 bg-brand-deep/40' />
                </motion.div>

                <motion.button type='submit' className='w-max flex items-center gap-2 bg-brand-accent hover:bg-[#1E8FE2] text-brand-ink font-medium px-8 py-3 rounded-full'
                    initial={{ y: 150, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 280, damping: 70, mass: 1 }}
                >
                    Enviar mensaje
                    <ArrowUpRight className="size-4.5" />
                </motion.button>
            </form>
        </section>
    );
}
