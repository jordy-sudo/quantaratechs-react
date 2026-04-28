import SectionTitle from "../components/section-title";
import { motion } from "framer-motion";
export default function SubscribeNewsletter() {
    return (
        <section className="flex flex-col items-center">
            <SectionTitle title="Déjanos tus datos" description="Te contactamos pronto para revisar tu necesidad y definir el siguiente paso." />
            <motion.div className="flex items-center justify-center mt-10 border border-brand-primary/60 bg-brand-deep/35 focus-within:outline focus-within:outline-brand-accent text-sm rounded-full h-14 max-w-xl w-full"
            initial={{ y: 150, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
        >
                <input type="text" className="bg-transparent outline-none rounded-full px-4 h-full flex-1 placeholder:text-brand-muted" placeholder="Ingresa tu correo de contacto" />
                <button className="bg-brand-accent text-brand-ink font-medium rounded-full h-11 mr-1 px-10 flex items-center justify-center hover:bg-[#1E8FE2] active:scale-95 transition">
                    Enviar
                </button>
            </motion.div>
        </section>
    );
}
