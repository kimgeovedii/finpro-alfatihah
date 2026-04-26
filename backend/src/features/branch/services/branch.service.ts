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

      let nearestBranch = branches[0];
      let minDistance: number | null = null;
      let isInRange = true;

      if (lat !== undefined && lng !== undefined) {
        // Find nearest
        let nearestDist = Infinity;
        for (const branch of branches) {
          if (!branch.latitude || !branch.longitude) continue;
          
          const { distance } = isWithinDeliveryRange(
            lat,
            lng,
            branch.latitude,
            branch.longitude,
            branch.maxDeliveryDistance
          );

          if (distance < nearestDist) {
            nearestDist = distance;
            nearestBranch = branch;
          }
        }
        
        minDistance = nearestDist;
        
        if (nearestBranch.latitude && nearestBranch.longitude) {
          const checkRange = isWithinDeliveryRange(
            lat,
            lng,
            nearestBranch.latitude,
            nearestBranch.longitude,
            nearestBranch.maxDeliveryDistance
          );
          isInRange = checkRange.isInsideRange;
        }
      }

      // Fetch products for the nearest branch
      const skip = (page - 1) * limit;
      let { data: productsData, total } = await this.branchRepository.findProductsByBranch(
        nearestBranch.id,
        skip,
        limit
      );

      // Fallback: If nearest branch has no products, fetch from the default (first) branch
      if (productsData.length === 0 && branches.length > 1) {
        const defaultBranch = branches[0];
        if (defaultBranch.id !== nearestBranch.id) {
          const fallback = await this.branchRepository.findProductsByBranch(
            defaultBranch.id,
            skip,
            limit
          );
          if (fallback.data.length > 0) {
            productsData = fallback.data;
            total = fallback.total;
          }
        }
      }

      return {
        branch: nearestBranch,
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
  public getBranchWithProducts = async (branchId: string, page: number = 1, limit: number = 12) => {
    const branch = await this.branchRepository.findById(branchId);
    if (!branch) throw new Error("Branch not found");

    const skip = (page - 1) * limit;
    const { data: productsData, total } = await this.branchRepository.findProductsByBranch(
      branchId,
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
