import { useCallback, type JSX } from "react";
import { getCategory, getProjectsForCategory } from "../lib/sanity-client";
import { useSanityData } from "../hooks/useSanityData";
import { LoadingSpinner } from "./ui/LoadingSpinner";
import { ErrorMessage } from "./ui/ErrorMessage";
import { Breadcrumb } from "./ui/Breadcrumb";
import { ProjectCard } from "./ui/ProjectCard";

interface ICategoryContentProps {
  year: string;
  category: string;
  basePath?: string;
}

export default function CategoryContent({ year, category, basePath = "" }: ICategoryContentProps): JSX.Element {
  const fetchCategoryData = useCallback(() => getCategory(category), [category]);
  const fetchProjects = useCallback(() => getProjectsForCategory(category), [category]);

  const {
    data: categoryData,
    loading: categoryLoading,
    error: categoryError,
  } = useSanityData(fetchCategoryData, [category]);
  const { data: projects, loading: projectsLoading, error: projectsError } = useSanityData(fetchProjects, [category]);

  const loading = categoryLoading || projectsLoading;
  const error = categoryError ?? projectsError;

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error !== null) {
    return <ErrorMessage message="Kunne ikke laste inn kategori" />;
  }

  if (categoryData === null) {
    return <p>Kategori ikke funnet.</p>;
  }

  const breadcrumbItems = [
    { label: "Års", href: "/years" },
    { label: year, href: `/years/${year}` },
  ];

  return (
    <div>
      <div className="page-header-content">
        <Breadcrumb items={breadcrumbItems} basePath={basePath} />
        <h1>{categoryData.title}</h1>
        {categoryData.description !== undefined && categoryData.description.length > 0 && (
          <p className="category-description">{categoryData.description}</p>
        )}
      </div>

      {projects !== null && projects.length > 0 ? (
        <div className="projects-grid">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              href={`${basePath}/years/${year}/${category}/${project.slug.current}/`}
            />
          ))}
        </div>
      ) : (
        <p>Ingen prosjekter funnet i denne kategorien.</p>
      )}
    </div>
  );
}
