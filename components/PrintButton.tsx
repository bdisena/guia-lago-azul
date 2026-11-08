"use client";
export function PrintButton() {
  return <button className="btn btn-primary shrink-0 text-sm" onClick={() => window.print()}>Imprimir</button>;
}
