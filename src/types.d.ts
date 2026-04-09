interface Profile {
  id?: number;
  name: string;
  proxy: string;
  canvasSeed: string;
}

interface Window {
  api: {
    getProfiles: () => Promise<Profile[]>;
    createProfile: (profile: Profile) => Promise<number>;
    launchProfile: (id: number) => Promise<boolean>;
    runAgent: (id: number, task: string) => Promise<{success: boolean, message: string}>;
  };
}