import { useCallback, type JSX } from "react";
import { getYear, getCategoriesWithProjectsForYear } from "../lib/sanity-client";
import { useSanityData } from "../hooks/useSanityData";
import { LoadingSpinner } from "./ui/LoadingSpinner";
import { ErrorMessage } from "./ui/ErrorMessage";
import { ProjectCard } from "./ui/ProjectCard";

interface IYearContentProps {
  year: string;
  basePath?: string;
}

export default function YearContent({ year, basePath = "" }: IYearContentProps): JSX.Element {
  const fetchYearData = useCallback(() => getYear(year), [year]);
  const fetchCategories = useCallback(() => getCategoriesWithProjectsForYear(year), [year]);

  const { data: yearData, loading: yearLoading, error: yearError } = useSanityData(fetchYearData, [year]);
  const {
    data: categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useSanityData(fetchCategories, [year]);

  const loading = yearLoading || categoriesLoading;
  const error = yearError ?? categoriesError;

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error !== null) {
    return <ErrorMessage message="Kunne ikke laste inn år" />;
  }

  if (yearData === null) {
    return <p>År ikke funnet.</p>;
  }

  return (
    <div>
      <div className="page-header-content">
        <a href={`${basePath}/years/`} className="breadcrumb">
          ← Tilbake til års
        </a>
        <h1>Fyrstikken {yearData.year}</h1>
        {yearData.description !== undefined && yearData.description.length > 0 && (
          <p className="year-description">{yearData.description}</p>
        )}
      </div>

      {categories !== null && categories.length > 0 ? (
        <div className="year-content">
          {categories.map((category) => (
            <section key={category._id} className="category-section" id={category.slug.current}>
              <div className="category-header">
                <h2 className="category-title">{category.title}</h2>
                {category.description !== undefined && category.description.length > 0 && (
                  <p className="category-description">{category.description}</p>
                )}
              </div>

              {category.projects !== undefined && category.projects.length > 0 && (
                <div className="projects-grid">
                  {category.projects.map((project) => (
                    <ProjectCard
                      key={project._id}
                      project={project}
                      href={`${basePath}/years/${year}/${category.slug.current}/${project.slug.current}/`}
                    />
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      ) : (
        <p>Ingen kategorier funnet for dette året.</p>
      )}
    </div>
  );
}
