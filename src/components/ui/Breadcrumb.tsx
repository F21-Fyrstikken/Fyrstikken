import type { JSX } from "react";

interface IBreadcrumbItem {
  label: string;
  href: string;
}

interface IBreadcrumbProps {
  items: IBreadcrumbItem[];
  basePath?: string;
}

export function Breadcrumb({ items, basePath = "" }: IBreadcrumbProps): JSX.Element {
  return (
    <nav className="breadcrumb-nav">
      {items.map((item, index) => (
        <span key={item.href}>
          <a href={`${basePath}${item.href}`} className="breadcrumb">
            {item.label}
          </a>
          {index < items.length - 1 && <span className="breadcrumb-separator">/</span>}
        </span>
      ))}
    </nav>
  );
}
