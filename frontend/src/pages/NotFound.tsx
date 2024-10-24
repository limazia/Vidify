import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-8xl font-medium">404</h1>
          <p className="text-4xl text-black font-bold">
            Essa página não existe.
          </p>
        </div>

        <p className="text-accent-foreground">
          Voltar para a{" "}
          <Link className="text-sky-500 dark:text-sky-400" to="/">
            página inicial
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
