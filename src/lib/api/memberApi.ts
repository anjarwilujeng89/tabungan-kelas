import {
  Member,
  CreateMemberInput,
  UpdateMemberInput,
  ApiResponse,
} from "@/types/models";

const delay = (ms: number = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Mock database with initial data
let members: Member[] = [
  {
    id: "1",
    name: "Andi Wijaya",
    bookNumber: "001",
    className: "X-A",
    totalSaving: 500000,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "Siti Nurhaliza",
    bookNumber: "002",
    className: "X-A",
    totalSaving: 750000,
    createdAt: new Date("2024-01-16"),
    updatedAt: new Date("2024-01-16"),
  },
  {
    id: "3",
    name: "Budi Santoso",
    bookNumber: "003",
    className: "X-B",
    totalSaving: 600000,
    createdAt: new Date("2024-01-17"),
    updatedAt: new Date("2024-01-17"),
  },
];

export const memberApi = {
  async getMembers(): Promise<ApiResponse<Member[]>> {
    await delay();
    return {
      success: true,
      data: [...members],
    };
  },

  async getMemberById(id: string): Promise<ApiResponse<Member>> {
    await delay();
    const member = members.find((m) => m.id === id);

    if (!member) {
      return {
        success: false,
        error: "Member not found",
      };
    }

    return {
      success: true,
      data: member,
    };
  },

  async createMember(input: CreateMemberInput): Promise<ApiResponse<Member>> {
    await delay();

    // Validate unique book number
    if (members.some((m) => m.bookNumber === input.bookNumber)) {
      return {
        success: false,
        error: "Book number already exists",
      };
    }

    const newMember: Member = {
      id: "member-" + Date.now(),
      ...input,
      totalSaving: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    members.push(newMember);
    return {
      success: true,
      data: newMember,
    };
  },

  async updateMember(
    id: string,
    input: UpdateMemberInput,
  ): Promise<ApiResponse<Member>> {
    await delay();

    const memberIndex = members.findIndex((m) => m.id === id);
    if (memberIndex === -1) {
      return {
        success: false,
        error: "Member not found",
      };
    }

    // Check book number uniqueness if updating
    if (
      input.bookNumber &&
      input.bookNumber !== members[memberIndex].bookNumber
    ) {
      if (
        members.some((m) => m.id !== id && m.bookNumber === input.bookNumber)
      ) {
        return {
          success: false,
          error: "Book number already exists",
        };
      }
    }

    members[memberIndex] = {
      ...members[memberIndex],
      ...input,
      updatedAt: new Date(),
    };

    return {
      success: true,
      data: members[memberIndex],
    };
  },

  async deleteMember(id: string): Promise<ApiResponse<void>> {
    await delay();

    const index = members.findIndex((m) => m.id === id);
    if (index === -1) {
      return {
        success: false,
        error: "Member not found",
      };
    }

    members.splice(index, 1);
    return {
      success: true,
    };
  },

  async searchMembers(query: string): Promise<ApiResponse<Member[]>> {
    await delay();

    const lowerQuery = query.toLowerCase();
    const results = members.filter(
      (m) =>
        m.name.toLowerCase().includes(lowerQuery) ||
        m.bookNumber.includes(lowerQuery),
    );

    return {
      success: true,
      data: results,
    };
  },
};
