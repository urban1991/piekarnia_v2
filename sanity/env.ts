function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Brak zmiennej środowiskowej ${name}. Skopiuj .env.example do .env.local i uzupełnij.`);
  }
  return value;
}

export const env = {
  projectId: required('NEXT_PUBLIC_SANITY_PROJECT_ID', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID),
  dataset: required('NEXT_PUBLIC_SANITY_DATASET', process.env.NEXT_PUBLIC_SANITY_DATASET),
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2026-09-01',
};
