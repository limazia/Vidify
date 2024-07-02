import { Request, Response } from "express";

import { buildCover } from "@/services/BuildCover";

class CoverController {
  async generate(request: Request, response: Response) {
    const paramsDefault = {
      id: "213912-215-1242421=213123-3dsa",
      title: "useState",
      //tags: ["tag1", "tag2"],
    };

    const params = { ...paramsDefault, ...request.query };

    console.log("params", params);

    const png = await buildCover(params);

    response.setHeader("Content-Type", "image/png");
    response.statusCode = 200;
    response.end(png);
  }
}

export const coverController = new CoverController();
