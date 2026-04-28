import { motion } from "framer-motion";

export default function Footer() {
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
                        <h2 className="font-semibold mb-5 text-white">QuantaraTechs</h2>
                        <a className="hover:text-brand-accent transition" href="#hero">Inicio</a>
                        <a className="hover:text-brand-accent transition" href="#services">Servicios</a>
                        <a className="hover:text-brand-accent transition" href="#projects">Proyectos</a>
                        <a className="hover:text-brand-accent transition" href="#contact">Contacto</a>
                    </div>
                </div>
                <div>
                    <h2 className="font-semibold text-white mb-5">Hablemos de tu proyecto</h2>
                    <div className="text-sm space-y-6 max-w-sm">
                        <p>Déjanos tu correo y te contactamos para revisar requerimientos y definir el siguiente paso.</p>
                        <div className="flex items-center justify-center gap-2 p-2 rounded-md bg-brand-deep border border-brand-primary/40">
                            <input className="outline-none w-full max-w-64 py-2 rounded px-2" type="email" placeholder="Ingresa tu correo" />
                            <button className="bg-brand-accent px-4 py-2 text-brand-ink font-medium rounded">Enviar</button>
                        </div>
                    </div>
                </div>
            </div>
            <p className="py-4 text-center border-t mt-6 border-brand-primary/50">
                © 2026 Quantara. Todos los derechos reservados.
            </p>
        </motion.footer>
    );
};
