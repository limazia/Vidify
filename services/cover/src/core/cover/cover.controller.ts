import { Request, Response } from "express";

import { coverService } from "./cover.service";

class CoverController {
  async store(request: Request, response: Response) {
    const { id, title, image: background } = request.body;

    if (!id || !title || !background) {
      return response
        .status(400)
        .json({ error: "Título e imagem são obrigatórios" });
    }

    const { image } = await coverService.generate({
      id,
      title,
      image: background,
    });

    return response.json({ image });
  }

  async preview(request: Request, response: Response) {
    return response.render("cover", {
      title: "pre visualização",
      image:
        "https://plus.unsplash.com/premium_photo-1739095638086-f86a16d1a076?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    });
  }
}

export const coverController = new CoverController();
