import { Headphones, MessageSquare, Mic, Users } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "./ui/card";
import { Link } from 'react-router-dom';

export function Home() {

    const services = [
        {
        title: "Mantén una charla en inglés con nuestro avatar",
        description: "Practica conversaciones naturales con nuestro avatar AI.",
        icon: <MessageSquare className="h-6 w-6" />,
        image: "images/chat.jpg",
        route: "/chat"
    },
    {
        title: "Encarna diferentes situaciones mediante role-plays",
        description: "Mejora tus habilidades con situaciones de la vida real.",
        icon: <Users className="h-6 w-6" />,
        image: "images/role_play.jpg",
        route: "/role-play"
    },
    {
        title: "Practica tu escucha",
        description: "Mejora tu comprensión auditiva con diversos acentos y velocidades.",
        icon: <Headphones className="h-6 w-6" />,
        image: "images/listening.jpg",
        route: "/listening"
    },
    {
        title: "Practica la descripción de objetos y personas",
        description: "Mejora la descripción de objetos y personas con imágenes generadas por IA.",
        icon: <Mic className="h-6 w-6" />,
        image: "images/description.jpg",
        route: "/description"
    }
    ]

    return (
        <main className="flex-grow container mx-auto px-4 py-8">
            <section className="mb-12">
            <div className="flex flex-col md:flex-row items-center bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                <div className="md:w-1/2">
                <img 
                    src="/images/academy.jpg" 
                    alt="English learning illustration" 
                    className="w-full h-full object-cover"
                />
                </div>
                <div className="md:w-1/2 p-8">
                <h2 className="text-3xl font-bold mb-4 text-center md:text-left dark:text-white">
                    Aprende inglés de forma natural y efectiva
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                    Descubre una nueva forma de aprender inglés con nuestra plataforma de IA interactiva.
                    Practica conversación, mejora tu pronunciación y amplía tu vocabulario de manera divertida y eficaz.
                </p>
                </div>
            </div>
            </section>

            <section>
            <h2 className="text-2xl font-bold mb-6 dark:text-white">Nuestros Servicios</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {services.map((service, index) => (
                <Link to={service.route} key={index} className="flex flex-col dark:bg-gray-700">
                    <Card>
                        <CardHeader>
                        <CardTitle className="flex items-center gap-2 dark:text-white">
                            {service.icon}
                            <span>{service.title}</span>
                        </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow flex flex-col">
                        <CardDescription className="mb-4 dark:text-gray-300">{service.description}</CardDescription>
                        <img 
                            src={service.image} 
                            alt={service.title} 
                            className="w-full h-40 object-cover rounded-md mt-auto"
                        />
                        </CardContent>
                    </Card>
                </Link>
                ))}
            </div>
            </section>

            <section className="mt-12 text-center">
            <Button asChild size="lg">
                <Link to="/chat">Comienza a practicar ahora</Link>
            </Button>
            </section>
        </main>
    )
}