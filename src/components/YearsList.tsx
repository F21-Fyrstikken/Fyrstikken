import React, { useEffect, useState } from "react";
import { getAllYears, type IYear } from "../lib/sanity-client";

interface IYearListProps {
  basePath?: string;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function YearsList({ basePath = "" }: IYearListProps) {
  const [years, setYears] = useState<IYear[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchYears(): Promise<void> {
      try {
        const data = await getAllYears();
        setYears(data);
      } catch (error) {
        console.error("Error fetching years:", error);
      } finally {
        setLoading(false);
      }
    }
    void fetchYears();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="years-grid">
      {years.map((year) => (
        <a key={year._id} href={`${basePath}/years/${String(year.year)}/`} className="year-card">
          <h2>{year.year}</h2>
          {year.description !== undefined && <p>{year.description}</p>}
        </a>
      ))}
    </div>
  );
}
