import { useCallback, type JSX } from "react";
import { getProject, getProjectsForCategory } from "../lib/sanity-client";
import { useSanityData } from "../hooks/useSanityData";
import { LoadingSpinner } from "./ui/LoadingSpinner";
import { ErrorMessage } from "./ui/ErrorMessage";
import { Breadcrumb } from "./ui/Breadcrumb";
import { getImageUrl, getImageAlt } from "../utils/sanity";

interface IProjectContentProps {
  year: string;
  category: string;
  project: string;
  basePath?: string;
}

export default function ProjectContent({ year, category, project, basePath = "" }: IProjectContentProps): JSX.Element {
  const fetchProjectData = useCallback(() => getProject(project), [project]);
  const fetchAllProjects = useCallback(() => getProjectsForCategory(category), [category]);

  const {
    data: projectData,
    loading: projectLoading,
    error: projectError,
  } = useSanityData(fetchProjectData, [project]);
  const {
    data: allProjects,
    loading: projectsLoading,
    error: projectsError,
  } = useSanityData(fetchAllProjects, [category]);

  const loading = projectLoading || projectsLoading;
  const error = projectError ?? projectsError;

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error !== null) {
    return <ErrorMessage message="Kunne ikke laste inn prosjekt" />;
  }

  if (projectData === null) {
    return <p>Prosjekt ikke funnet.</p>;
  }

  const breadcrumbItems = [
    { label: "Års", href: "/years" },
    { label: year, href: `/years/${year}` },
    { label: projectData.category.title, href: `/years/${year}/${category}` },
  ];

  const projectImageUrl = getImageUrl(projectData.image);
  const projectImageAlt = getImageAlt(projectData.image, projectData.title);

  return (
    <div>
      <div className="page-header-content">
        <Breadcrumb items={breadcrumbItems} basePath={basePath} />
      </div>

      <div className="project-layout">
        <aside className="project-sidebar">
          <h2 className="sidebar-title">Fyrstikken {year}</h2>
          <nav className="project-list">
            {allProjects?.map((proj) => {
              const imageUrl = getImageUrl(proj.image);
              const imageAlt = getImageAlt(proj.image, proj.title);
              const isActive = proj.slug.current === project;

              return (
                <a
                  key={proj._id}
                  href={`${basePath}/years/${year}/${category}/${proj.slug.current}/`}
                  className={`project-list-item ${isActive ? "active" : ""}`}>
                  {imageUrl !== undefined && imageUrl.length > 0 && (
                    <img src={imageUrl} alt={imageAlt} className="project-thumb" />
                  )}
                  <span className="project-name">{proj.title}</span>
                </a>
              );
            })}
          </nav>
        </aside>

        <article className="project-detail">
          <h1 className="project-title">{projectData.title}</h1>

          {projectImageUrl !== undefined && projectImageUrl.length > 0 && (
            <img src={projectImageUrl} alt={projectImageAlt} className="project-hero-image" />
          )}

          {projectData.description !== undefined && projectData.description.length > 0 && (
            <p className="project-description">{projectData.description}</p>
          )}

          {projectData.content !== undefined && projectData.content !== null && (
            <div className="project-content">
              <pre>{JSON.stringify(projectData.content, null, 2)}</pre>
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
