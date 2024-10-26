const technologies = {
  Tecnologias: [
    "React",
    "TypeScript",
    "Node",
    "Express",
    "PostgreSQL",
    "Redis",
    "Docker",
  ],
  "Serviços em Nuvem & IA": ["AWS Polly", "AWS S3", "OpenAI"],
  "Bibliotecas Frontend": [
    "Tailwind CSS",
    "shadcn/ui",
    "@radix-ui",
    "@tanstack/react-query",
    "framer-motion",
    "lucide-react",
    "react-hook-form",
    "react-router-dom",
    "react-toastify",
    "styled-components",
  ],
  "Ferramentas de Build": [
    "Vite",
    "tailwind-merge",
    "tailwindcss-animate",
    "clsx",
    "class-variance-authority",
  ],
  "Bibliotecas Backend": [
    "Socket.IO",
    "BullMQ",
    "@aws-sdk/client-polly",
    "@aws-sdk/client-s3",
    "ass-compiler",
    "express-async-errors",
    "fs-extra",
    "ioredis",
    "jimp",
    "knex",
    "node-cron",
    "swagger-autogen",
    "swagger-jsdoc",
    "swagger-ui-express",
  ],
  "Bibliotecas Utilitárias": [
    "axios",
    "dayjs",
    "date-fns",
    "js-file-downloader",
    "@hookform/resolvers",
    "zod",
    "chalk",
    "cors",
    "uuid",
  ],
};

export function Acknowledgements() {
  return (
    <div className="w-full space-y-6">
      <h1 className="text-4xl font-bold">Reconhecimentos</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(technologies).map(([category, items]) => (
          <div key={category} className="space-y-3">
            <h2 className="text-xl font-semibold text-primary">{category}</h2>
            <div className="space-y-2">
              {items.map((tech) => (
                <p
                  key={tech}
                  className="text-sm text-gray-600 dark:text-gray-300"
                >
                  {tech}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
