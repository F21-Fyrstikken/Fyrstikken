/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { getCategory, getProjectsForCategory } from "../lib/sanity-client";

interface ICategoryContentProps {
  year: string;
  category: string;
  basePath?: string;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function CategoryContent({ year, category, basePath = "" }: ICategoryContentProps) {
  const [categoryData, setCategoryData] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData(): Promise<void> {
      try {
        const categoryResult = await getCategory(category);
        const projectsResult = await getProjectsForCategory(category);
        setCategoryData(categoryResult);
        setProjects(projectsResult);
      } catch (error) {
        console.error("Error fetching category data:", error);
      } finally {
        setLoading(false);
      }
    }
    void fetchData();
  }, [category]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (categoryData === null) {
    return <p>Category not found.</p>;
  }

  return (
    <div>
      <div className="page-header-content">
        <a href={`${basePath}/years/`} className="breadcrumb">
          Års
        </a>
        <span className="breadcrumb-separator">/</span>
        <a href={`${basePath}/years/${year}/`} className="breadcrumb">
          {year}
        </a>
        <h1>{categoryData.title}</h1>
        {categoryData.description !== null && categoryData.description !== undefined && (
          <p className="category-description">{categoryData.description}</p>
        )}
      </div>

      {projects.length > 0 ? (
        <div className="projects-grid">
          {projects.map((project) => (
            <a
              key={project._id}
              href={`${basePath}/years/${year}/${category}/${String(project.slug.current)}/`}
              className="project-card">
              {project.image?.asset?.url !== null && project.image?.asset?.url !== undefined && (
                <img src={project.image.asset.url} alt={project.image.alt ?? project.title} className="project-image" />
              )}
              <div className="project-content">
                <h2>{project.title}</h2>
                {project.description !== null && project.description !== undefined && <p>{project.description}</p>}
              </div>
            </a>
          ))}
        </div>
      ) : (
        <p>Ingen prosjekter funnet i denne kategorien.</p>
      )}
    </div>
  );
}
