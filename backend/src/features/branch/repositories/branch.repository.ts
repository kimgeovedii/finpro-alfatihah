import { prisma } from "../../../config/prisma";

export class BranchRepository {
  async findRandomBranch() {
    const count = await prisma.branch.count()
    if (count === 0) return null

    const skip = Math.floor(Math.random() * count)

    return prisma.branch.findFirst({ 
      skip, 
      select: { id: true }
    })
  }
}
