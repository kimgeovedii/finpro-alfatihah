import { prisma } from "../../../config/prisma";

export class BranchController {
  async getAllBranches(req: any, res: any) {
    try {
      const branches = await prisma.branch.findMany({
        select: {
          id: true,
          storeName: true,
          city: true,
        },
      });
      return res.status(200).json({ success: true, data: branches });
    } catch (error) {
      console.error("Get Branches Error:", error);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }
}
