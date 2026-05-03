export enum DiscountStatus {
  ACTIVE = "ACTIVE",
  SCHEDULED = "SCHEDULED",
  EXPIRED = "EXPIRED",
}

export const getDiscountStatus = (
  startDate: Date,
  endDate: Date,
): DiscountStatus => {
  const now = new Date();

  if (now < new Date(startDate)) {
    return DiscountStatus.SCHEDULED;
  }

  if (now >= new Date(startDate) && now <= new Date(endDate)) {
    return DiscountStatus.ACTIVE;
  }

  return DiscountStatus.EXPIRED;
};

export const getDiscountStatusFilter = (status: string) => {
  const now = new Date();

  switch (status.toUpperCase()) {
    case DiscountStatus.ACTIVE:
      return {
        startDate: { lte: now },
        endDate: { gte: now },
      };
    case DiscountStatus.SCHEDULED:
      return {
        startDate: { gt: now },
      };
    case DiscountStatus.EXPIRED:
      return {
        endDate: { lt: now },
      };
    default:
      return {};
  }
};
