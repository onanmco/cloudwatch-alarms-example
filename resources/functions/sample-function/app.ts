class CustomError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CustomError";
  }
}

export const lambdaHandler = () => {
  throw new CustomError("Application failed due to some reason.");
};