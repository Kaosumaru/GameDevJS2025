const baseUrl = import.meta.env.BASE_URL || '/';

export function apath(path: string): string {
  return baseUrl + path;
}
