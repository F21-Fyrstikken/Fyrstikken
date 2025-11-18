import type { JSX } from "react";
import type { IProject } from "../../types/sanity";
import { getImageUrl, getImageAlt } from "../../utils/sanity";

interface IProjectCardProps {
  project: IProject;
  href: string;
}

export function ProjectCard({ project, href }: IProjectCardProps): JSX.Element {
  const imageUrl = getImageUrl(project.image);
  const imageAlt = getImageAlt(project.image, project.title);

  return (
    <a href={href} className="project-card">
      {imageUrl !== undefined && imageUrl.length > 0 && <img src={imageUrl} alt={imageAlt} className="project-image" />}
      <div className="project-content">
        <h2>{project.title}</h2>
        {project.description !== undefined && project.description.length > 0 && <p>{project.description}</p>}
      </div>
    </a>
  );
}
