export type VersionInfo = {
  commitSha: string;
};

export function getVersionInfo(params: { commitSha: string }): VersionInfo {
  return { commitSha: params.commitSha };
}
