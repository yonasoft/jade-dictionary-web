import { Timestamp } from "firebase/firestore";

export const timestampToDate = (timestamp: any) => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  return new Date();
};
