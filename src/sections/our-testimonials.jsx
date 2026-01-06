import SectionTitle from "../components/section-title";
import { motion } from "framer-motion";

export default function OurTestimonials() {
    const testimonials = [
        { quote: "Planificamos, coordinamos y hacemos seguimiento de los proyectos, conectando al equipo técnico con las áreas de negocio de forma clara.", name: "Gestión de proyectos tecnológicos", role: "Hitos, riesgos y avances visibles para todos", image: "https://www.quantaratechs.com/assets/images/quantaratechs_logo_white.webp", },
        { quote: "Levantamos y documentamos procesos clave para que tu operación sea repetible, auditable y fácil de entrenar a nuevos equipos.", name: "Estandarización y documentación", role: "Procedimientos claros y fáciles de mantener", image: "https://www.quantaratechs.com/assets/images/quantaratechs_logo_white.webp", },
        { quote: "Desarrollamos aplicaciones personalizadas y las desplegamos en Azure, con seguridad, monitoreo y capacidad de crecer cuando tu negocio lo necesite.", name: "Software a medida y nube", role: "Arquitectura moderna y observabilidad desde el inicio", image: "https://www.quantaratechs.com/assets/images/quantaratechs_logo_white.webp", },
        { quote: "Analizamos tus flujos críticos y los convertimos en procesos digitales medibles, reduciendo tiempos, retrabajos y errores operativos.", name: "Automatización de procesos", role: "Menos tareas manuales, más control del negocio", image: "https://www.quantaratechs.com/assets/images/quantaratechs_logo_white.webp", },
        { quote: "Construimos bots que consultan portales externos, resuelven captchas y extraen datos clave para integrarlos de forma segura a tus sistemas internos.", name: "Bots y webscraping especializados", role: "Integración con APIs, archivos y bases de datos", image: "https://www.quantaratechs.com/assets/images/quantaratechs_logo_white.webp", },
        { quote: "Diseñamos apps con Power Apps y flujos con Power Automate para digitalizar formularios, aprobaciones y notificaciones sin perder gobierno ni seguridad.", name: "Soluciones con Power Platform", role: "Low-code alineado a tus políticas de TI", image: "https://www.quantaratechs.com/assets/images/quantaratechs_logo_white.webp", },
    ];

    return (
        <section className="flex flex-col items-center" id="testimonials">
            <SectionTitle title="Servicios estratégicos" description="Soluciones diseñadas para ordenar la operación, integrar sistemas y automatizar tareas críticas." />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-18 max-w-6xl mx-auto">
                {testimonials.map((testimonial, index) => (
                    <motion.div key={testimonial.name} className="group border border-slate-800 p-6 rounded-xl"
                        initial={{ y: 150, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: `${index * 0.15}`, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                    >
                        <p className="text-slate-100 text-base">{testimonial.quote}</p>
                        <div className="flex items-center gap-3 mt-8 group-hover:-translate-y-1 duration-300">
                            <img className="size-10 rounded-full" src={testimonial.image} alt="user image" />
                            <div>
                                <h2 className="text-gray-200 font-medium">
                                    {testimonial.name}
                                </h2>
                                <p className="text-indigo-500">{testimonial.role}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
