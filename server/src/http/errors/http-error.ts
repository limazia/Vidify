export class HttpError {
  public readonly message: string;
  public readonly type: string;
  public readonly code: string;
  public readonly statusCode: number;

  constructor(message: string, statusCode = 400, type = "error", code = "unknow") {
    this.message = message;
    this.type = type;
    this.code = code;
    this.statusCode = statusCode;
  }
}