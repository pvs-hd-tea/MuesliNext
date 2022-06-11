// only placeholders for now!
export interface UserMetaData {
  id: string;
  name: string;
}

export interface PageMetaData {
  visible: boolean;
  userData: UserMetaData;
  showDebugInformation: boolean;
}
