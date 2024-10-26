import { Logo } from "@/components/logo";
import { ScrollArea } from "@/components/ui/scroll-area";

export function Chat() {
  return (
    <div className="w-full flex flex-col mx-auto p-4 bg-background rounded-lg shadow-lg">
      <ScrollArea className="flex-grow mb-4 p-4 bg-muted rounded-lg">
        <div className="flex justify-end mb-4">
          <div className="flex flex-row-reverse items-start space-x-2">
            <div className="max-w-[80%] p-2 rounded-lg bg-primary text-primary-foreground break-words">
              <p>bbbbbbbbbbbbbbbbbbbasdsadsadsab</p>
            </div>
          </div>
        </div>

        <div className="flex justify-start mb-4">
          <div className="flex flex-row items-start space-x-2">
            <Logo background="bg-muted" />
            <div className="max-w-[80%] p-2 rounded-lg bg-primary text-primary-foreground break-words">
              <p className="text-sm font-semibold mb-1">Vidify</p>
              <p>That's an interesting point. Let me elaborate on how to handle long text in a way that ensures it wraps correctly and doesn't overflow the container...</p>
            </div>
          </div>
        </div>
      </ScrollArea>
      <div className="flex gap-2"></div>
    </div>
  );
}
