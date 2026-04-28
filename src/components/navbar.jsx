import { useState } from "react";
import { MenuIcon, XIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navlinks = [
        {
            href: "#hero",
            text: "Inicio",
        },
        {
            href: "#services",
            text: "Servicios",
        },
        {
            href: "#projects",
            text: "Proyectos",
        },
        {
            href: "#contact",
            text: "Contáctanos",
        },
    ];
    return (
        <>
            <motion.nav className="sticky top-0 z-50 flex items-center justify-between w-full h-18 px-6 md:px-16 lg:px-24 xl:px-32 bg-white/85 border-b border-brand-line backdrop-blur"
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1 }}
            >
                <a href="/">
                    <img className="h-10 w-auto" src="/assets/logo.png" width={139} height={40} alt="Quantara Tech" />
                </a>

                <div className="hidden lg:flex items-center gap-8 transition duration-500">
                    {navlinks.map((link) => (
                        <Link key={link.href} to={link.href} className="hover:text-brand-accent transition">
                            {link.text}
                        </Link>
                    ))}
                </div>

                <div className="hidden lg:block space-x-3">
                    <a href="#contact" className="inline-flex px-6 py-2 bg-brand-primary hover:bg-[#132C49] transition text-white font-medium rounded-md active:scale-95">
                        Agendar una reunión
                    </a>
                    <a href="#projects" className="inline-flex hover:bg-brand-deep transition px-6 py-2 border border-brand-line rounded-md active:scale-95">
                        Ver proyectos
                    </a>
                </div>
                <button onClick={() => setIsMenuOpen(true)} className="lg:hidden active:scale-90 transition">
                    <MenuIcon className="size-6.5" />
                </button>
            </motion.nav>
            <div className={`fixed inset-0 z-[100] bg-white/95 backdrop-blur flex flex-col items-center justify-center text-lg gap-8 lg:hidden transition-transform duration-400 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
                {navlinks.map((link) => (
                    <Link key={link.href} to={link.href} onClick={() => setIsMenuOpen(false)}>
                        {link.text}
                    </Link>
                ))}
                <button onClick={() => setIsMenuOpen(false)} className="active:ring-3 active:ring-brand-accent aspect-square size-10 p-1 items-center justify-center bg-brand-primary hover:bg-[#132C49] transition text-white rounded-md flex">
                    <XIcon />
                </button>
            </div>
        </>
    );
}
