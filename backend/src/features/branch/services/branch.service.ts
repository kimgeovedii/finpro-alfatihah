import { BranchRepository } from "../repositories/branch.repository";
import { isWithinDeliveryRange } from "../../../utils/location";

export class BranchService {
  private branchRepository: BranchRepository;

  constructor() {
    this.branchRepository = new BranchRepository();
  }

  public getAllBranches = async (page: number = 1, limit: number = 10) => {
    const skip = (page - 1) * limit;
    const { data, total } = await this.branchRepository.findAllActivePaginated(skip, limit);
    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  };

  public findNearestBranch = async (
    lat: number | undefined,
    lng: number | undefined,
    page: number,
    limit: number
  ) => {
    try {
      const branches = await this.branchRepository.findAllActive();
      if (!branches || branches.length === 0) {
        throw new Error("No active branches found");
      }

      // Determine the default branch (isDefault=true, or fallback to first)
      const defaultBranch = branches.find(b => b.isDefault) || branches[0];

      let targetBranch = defaultBranch;
      let minDistance: number | null = null;
      let isInRange = false;

      if (lat !== undefined && lng !== undefined) {
        // Find all branches within delivery range
        const inRangeBranches: { branch: typeof branches[0]; distance: number }[] = [];

        for (const branch of branches) {
          if (!branch.latitude || !branch.longitude) continue;

          const { isInsideRange, distance } = isWithinDeliveryRange(
            lat,
            lng,
            branch.latitude,
            branch.longitude,
            branch.maxDeliveryDistance
          );

          if (isInsideRange) {
            inRangeBranches.push({ branch, distance });
          }
        }

        if (inRangeBranches.length > 0) {
          // Sort by distance, pick the nearest in-range branch
          inRangeBranches.sort((a, b) => a.distance - b.distance);
          targetBranch = inRangeBranches[0].branch;
          minDistance = inRangeBranches[0].distance;
          isInRange = true;
        } else {
          // No branch in range — use default branch
          // Calculate distance to default branch for info
          if (defaultBranch.latitude && defaultBranch.longitude) {
            const { distance } = isWithinDeliveryRange(
              lat,
              lng,
              defaultBranch.latitude,
              defaultBranch.longitude,
              defaultBranch.maxDeliveryDistance
            );
            minDistance = distance;
          }
          targetBranch = defaultBranch;
          isInRange = false;
        }
      }

      // Fetch products for the target branch
      const skip = (page - 1) * limit;
      let { data: productsData, total } = await this.branchRepository.findProductsByBranch(
        targetBranch.id,
        skip,
        limit
      );

      // Fallback: if target branch has no products, use default branch
      if (productsData.length === 0 && targetBranch.id !== defaultBranch.id) {
        const fallback = await this.branchRepository.findProductsByBranch(
          defaultBranch.id,
          skip,
          limit
        );
        productsData = fallback.data;
        total = fallback.total;
        targetBranch = defaultBranch;
        isInRange = false;
      }

      return {
        branch: targetBranch,
        distance: minDistance,
        isInRange,
        products: {
          data: productsData,
          meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        },
      };
    } catch (error) {
      console.error("Error in findNearestBranch:", error);
      throw error;
    }
  };
  public getBranchWithProducts = async (slug: string, page: number = 1, limit: number = 12) => {
    const branch = await this.branchRepository.findBySlug(slug);
    if (!branch) throw new Error("Branch not found");

    const skip = (page - 1) * limit;
    const { data: productsData, total } = await this.branchRepository.findProductsByBranch(
      branch.id,
      skip,
      limit
    );

    return {
      branch,
      products: {
        data: productsData,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  };
}
