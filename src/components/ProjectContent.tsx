/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { getProject, getProjectsForCategory } from "../lib/sanity-client";

interface IProjectContentProps {
  year: string;
  category: string;
  project: string;
  basePath?: string;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function ProjectContent({ year, category, project, basePath = "" }: IProjectContentProps) {
  const [projectData, setProjectData] = useState<any>(null);
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData(): Promise<void> {
      try {
        const projectResult = await getProject(project);
        const projectsResult = await getProjectsForCategory(category);
        setProjectData(projectResult);
        setAllProjects(projectsResult);
      } catch (error) {
        console.error("Error fetching project data:", error);
      } finally {
        setLoading(false);
      }
    }
    void fetchData();
  }, [project, category]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (projectData === null) {
    return <p>Project not found.</p>;
  }

  return (
    <div>
      <div className="page-header-content">
        <a href={`${basePath}/years`} className="breadcrumb">
          Års
        </a>
        <span className="breadcrumb-separator">/</span>
        <a href={`${basePath}/years/${year}`} className="breadcrumb">
          {year}
        </a>
        <span className="breadcrumb-separator">/</span>
        <a href={`${basePath}/years/${year}/${category}`} className="breadcrumb">
          {projectData.category.title}
        </a>
      </div>

      <div className="project-layout">
        <aside className="project-sidebar">
          <h2 className="sidebar-title">Fyrstikken {year}</h2>
          <nav className="project-list">
            {allProjects.map((proj) => (
              <a
                key={proj._id}
                href={`${basePath}/years/${year}/${category}/${String(proj.slug.current)}`}
                className={`project-list-item ${proj.slug.current === project ? "active" : ""}`}>
                {proj.image?.asset?.url !== null && proj.image?.asset?.url !== undefined && (
                  <img src={proj.image.asset.url} alt={proj.image.alt ?? proj.title} className="project-thumb" />
                )}
                <span className="project-name">{proj.title}</span>
              </a>
            ))}
          </nav>
        </aside>

        <article className="project-detail">
          <h1 className="project-title">{projectData.title}</h1>

          {projectData.image?.asset?.url !== null && projectData.image?.asset?.url !== undefined && (
            <img
              src={projectData.image.asset.url}
              alt={projectData.image.alt ?? projectData.title}
              className="project-hero-image"
            />
          )}

          {projectData.description !== null && projectData.description !== undefined && (
            <p className="project-description">{projectData.description}</p>
          )}

          {projectData.content !== null && projectData.content !== undefined && (
            <div className="project-content">
              {/* PortableText rendering would go here - you might need to use a client-side PortableText renderer */}
              <pre>{JSON.stringify(projectData.content, null, 2)}</pre>
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
