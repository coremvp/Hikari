export class AppError extends Error {
  constructor(
    public status: 400 | 401 | 403 | 409 | 503,
    message: string,
  ) {
    super(message);
  }
}
