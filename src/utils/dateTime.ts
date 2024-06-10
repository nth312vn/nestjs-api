export const compareTimeStampLater = (fromDate: number, toDate: number) => {
  if (fromDate > toDate) {
    return true;
  }
  return false;
};
