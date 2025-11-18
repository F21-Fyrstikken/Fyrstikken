import { getAllYears } from "../lib/sanity-client";
import { useSanityData } from "../hooks/useSanityData";
import { LoadingSpinner } from "./ui/LoadingSpinner";
import { ErrorMessage } from "./ui/ErrorMessage";
import type { JSX } from "react";

interface IYearListProps {
  basePath?: string;
}

export default function YearsList({ basePath = "" }: IYearListProps): JSX.Element {
  const { data: years, loading, error } = useSanityData(() => getAllYears(), []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error !== null) {
    return <ErrorMessage message="Kunne ikke laste inn år" />;
  }

  if (years === null || years.length === 0) {
    return <div>Ingen år funnet.</div>;
  }

  return (
    <div className="years-grid">
      {years.map((year) => (
        <a key={year._id} href={`${basePath}/years/${String(year.year)}/`} className="year-card">
          <h2>{year.year}</h2>
          {year.description !== undefined && year.description.length > 0 && <p>{year.description}</p>}
        </a>
      ))}
    </div>
  );
}
