import React, { useEffect, useState } from "react";
import { getYear, getCategoriesWithProjectsForYear, type ICategoryWithProjects } from "../lib/sanity-client";

interface IYearContentProps {
  year: string;
  basePath?: string;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function YearContent({ year, basePath = "" }: IYearContentProps) {
  const [yearData, setYearData] = useState<{ year: number; description?: string } | null>(null);
  const [categories, setCategories] = useState<ICategoryWithProjects[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData(): Promise<void> {
      try {
        const yearResult = await getYear(year);
        const categoriesResult = await getCategoriesWithProjectsForYear(year);
        setYearData(yearResult !== null ? { year: yearResult.year, description: yearResult.description } : null);
        setCategories(categoriesResult);
      } catch (error) {
        console.error("Error fetching year data:", error);
      } finally {
        setLoading(false);
      }
    }
    void fetchData();
  }, [year]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (yearData === null) {
    return <p>Year not found.</p>;
  }

  return (
    <div>
      <div className="page-header-content">
        <a href={`${basePath}/years`} className="breadcrumb">
          ← Tilbake til års
        </a>
        <h1>Fyrstikken {yearData.year}</h1>
        {yearData.description !== undefined && <p className="year-description">{yearData.description}</p>}
      </div>

      {categories.length > 0 ? (
        <div className="year-content">
          {categories.map((category) => (
            <section key={category._id} className="category-section" id={category.slug.current}>
              <div className="category-header">
                <h2 className="category-title">{category.title}</h2>
                {category.description !== undefined && <p className="category-description">{category.description}</p>}
              </div>

              {category.projects !== undefined && category.projects.length > 0 && (
                <div className="projects-grid">
                  {category.projects.map((project) => (
                    <a
                      key={project._id}
                      href={`${basePath}/years/${year}/${category.slug.current}/${project.slug.current}`}
                      className="project-card">
                      {project.image?.asset?.url !== undefined && (
                        <img
                          src={project.image.asset.url}
                          alt={project.image.alt ?? project.title}
                          className="project-image"
                        />
                      )}
                      <div className="project-content">
                        <h3>{project.title}</h3>
                        {project.description !== undefined && <p>{project.description}</p>}
                      </div>
                    </a>
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
