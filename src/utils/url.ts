
export const generateURL = (base: string, searchParams?: Record<string, any>) => {
  const url = new URL(base);
  if (!searchParams) return url;

  for (const key in searchParams){
    url.searchParams.append(key, `${searchParams[key]}`)
  }

  return url;
}
