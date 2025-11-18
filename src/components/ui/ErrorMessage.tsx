import type { JSX } from "react";

interface IErrorMessageProps {
  message?: string;
}

export function ErrorMessage({ message = "Noe gikk galt" }: IErrorMessageProps): JSX.Element {
  return <div className="error">{message}</div>;
}
