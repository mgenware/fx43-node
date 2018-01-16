import listAsyncInternal from 'fx58-node';

export default async function listAsync(
  directory: string,
  fileFilter?: ((name: string) => boolean) | null,
  dirFilter?: ((name: string) => boolean) | null,
): Promise<string[]> {
  return await listAsyncInternal(directory, true, fileFilter, dirFilter);
}
