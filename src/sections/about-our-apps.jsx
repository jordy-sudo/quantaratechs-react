import SectionTitle from "../components/section-title";
import { motion } from "framer-motion";

export default function AboutOurApps() {
    const sectionData = [
        {
            title: "Automatización de procesos",
            description: "Analizamos tus flujos críticos y los convertimos en procesos digitales medibles, reduciendo tiempos, retrabajos y errores operativos.",
            image: "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/aboutSection/flashEmoji.png",
            className: "py-10 border-b border-brand-primary/50 md:py-0 md:border-r md:border-b-0 md:px-10"
        },
        {
            title: "Bots y webscraping especializados",
            description: "Construimos bots que consultan portales externos, resuelven captchas y extraen datos clave para integrarlos de forma segura a tus sistemas internos.",
            image: "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/aboutSection/colorsEmoji.png",
            className: "py-10 border-b border-brand-primary/50 md:py-0 lg:border-r md:border-b-0 md:px-10"
        },
        {
            title: "Soluciones con Power Platform",
            description: "Diseñamos apps con Power Apps y flujos con Power Automate para digitalizar formularios, aprobaciones y notificaciones sin perder gobierno ni seguridad.",
            image: "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/aboutSection/puzzelEmoji.png",
            className: "py-10 border-b border-brand-primary/50 md:py-0 md:border-b-0 md:px-10"
        },
    ];
    return (
        <section className="flex flex-col items-center" id="services">
            <SectionTitle title="Servicios clave" description="Tecnología para ordenar y escalar tu operación con soluciones diseñadas para procesos, datos y control." />
            <div className="relative max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-8 md:px-0 mt-18">
                {sectionData.map((data, index) => (
                    <motion.div key={data.title} className={data.className}
                        initial={{ y: 150, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: `${index * 0.15}`, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                    >
                        <div className="size-10 p-2 bg-brand-accent/15 border border-brand-accent/40 rounded">
                            <img src={data.image} alt="" />
                        </div>
                        <div className="mt-5 space-y-2">
                            <h3 className="text-base font-medium text-white">{data.title}</h3>
                            <p className="text-sm text-brand-muted">{data.description}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
