import { BranchRepository } from "../repositories/branch.repository";
import { isWithinDeliveryRange } from "../../../utils/location";

export class BranchService {
  private branchRepository: BranchRepository;

  constructor() {
    this.branchRepository = new BranchRepository();
  }

  public getAllBranches = async () => {
    const branches = await this.branchRepository.findAllActive();
    return branches; // findAllActive already returns all necessary fields
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

      // Fetch products for the nearest (or default) branch
      const skip = (page - 1) * limit;
      const { data: productsData, total } = await this.branchRepository.findProductsByBranch(
        nearestBranch.id,
        skip,
        limit
      );

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
}
