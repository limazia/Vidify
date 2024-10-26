import { motion } from "framer-motion";
import { useParams } from "react-router-dom";

import { Logo } from "@/components/logo";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TypingAnimation } from "@/components/ui/typing-animation";

export function Chat() {
  const { id } = useParams();
  const searchTerm = localStorage.getItem(`chat-${id}`);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full space-y-8"
    >
      <Card>
        <CardContent>
          <ScrollArea className="h-[500px] flex-grow mb-4 p-4">
            <div className="flex justify-end mb-4">
              <div className="flex flex-row-reverse items-start space-x-2">
                <div className="max-w-[80%] p-2 rounded-lg bg-primary text-primary-foreground break-words">
                  <p className="text-sm font-semibold mb-1">Você</p>
                  <p className="sm">{searchTerm}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-start mb-4">
              <div className="flex flex-row items-start space-x-2">
                <Logo />
                <div className="max-w-[80%] p-2 rounded-lg bg-primary text-primary-foreground break-words">
                  <p className="text-sm font-semibold mb-1">Vidify</p>
                  <TypingAnimation
                    className="text-sm text-white"
                    text="Typing Animation"
                  />
                </div>
              </div>
            </div>
          </ScrollArea>
          <div className="flex gap-2"></div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
