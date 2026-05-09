import { MutationJournalRepository } from "../repositories/mutationJournal.repository";
import { MutationStatus } from "@prisma/client";
import { prisma } from "../../../config/prisma";

export class MutationJournalService {
  private mutationJournalRepository: MutationJournalRepository;

  constructor() {
    this.mutationJournalRepository = new MutationJournalRepository();
  }

  public findAllMutations = async (filters: any, page: number, limit: number) => {
    const skip = (page - 1) * limit;
    const take = limit;
    const { data, total } = await this.mutationJournalRepository.findAllMutations(filters, skip, take);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  };

  public findMutationById = async (id: string) => {
    return this.mutationJournalRepository.findMutationById(id);
  };

  private async getEmployeeId(userId: string) {
    const employee = await prisma.employee.findUnique({ where: { userId } });
    if (!employee) throw new Error("Employee record not found for this user");
    return employee.id;
  }

  public createMutation = async (data: any, userId: string) => {
    const employeeId = await this.getEmployeeId(userId);
    return this.mutationJournalRepository.createMutation({ ...data, employeeId });
  };

  public updateMutationStatus = async (id: string, status: MutationStatus, userId: string, notes?: string) => {
    const employeeId = await this.getEmployeeId(userId);
    return this.mutationJournalRepository.updateMutationStatus(id, status, employeeId, notes);
  };
}
