export function buildYearPath(basePath: string, year: string | number): string {
  return `${basePath}/years/${String(year)}`;
}

export function buildCategoryPath(basePath: string, year: string | number, category: string): string {
  return `${basePath}/years/${String(year)}/${category}`;
}

export function buildProjectPath(basePath: string, year: string | number, category: string, project: string): string {
  return `${basePath}/years/${String(year)}/${category}/${project}`;
}

export function getBasePath(): string {
  const baseUrl = import.meta.env.BASE_URL;
  if (typeof baseUrl === "string") {
    return baseUrl.replace(/\/$/, "");
  }
  return "";
}
