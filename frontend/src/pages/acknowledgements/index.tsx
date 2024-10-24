export function Acknowledgements() {
  return (
    <div className="w-full space-y-4">
      <h1 className="text-4xl font-bold">Reconhecimentos</h1>
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Frontend</h2>
          <p>React</p>
          <p>Tailwind CSS</p>
          <p>TypeScript</p>
          <p>Vite</p>
          <p>shadcn/ui</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold">Backend</h2>
          <p>Node</p>
          <p>Express</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold">Database</h2>

          <p>PostgreSQL</p>
          <p>Redis</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold">Cloud Services</h2>
          <p>AWS Polly</p>
          <p>AWS S3</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold">Infra & Real-time</h2>
          <p>Socket.IO</p>
          <p>BullMQ</p>
          <p>Docker</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold">AI</h2>
          <p>OpenAI</p>
        </div>
      </div>
    </div>
  );
}
