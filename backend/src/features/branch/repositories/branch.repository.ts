import { prisma } from "../../../config/prisma";

export class BranchRepository {
  async findRandomBranch() {
    const count = await prisma.branch.count()
    if (count === 0) return null

    const skip = Math.floor(Math.random() * count)

    return await prisma.branch.findFirst({ 
      skip, 
      select: { id: true }
    })
  }
}
