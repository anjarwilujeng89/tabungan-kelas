import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { memberApi } from "@/lib/api/memberApi";
import { Member, CreateMemberInput, UpdateMemberInput } from "@/types/models";

export const MEMBERS_QUERY_KEY = ["members"];

export const useMembersQuery = () => {
  return useQuery({
    queryKey: MEMBERS_QUERY_KEY,
    queryFn: async () => {
      const response = await memberApi.getMembers();
      if (!response.success) throw new Error(response.error);
      return response.data || [];
    },
  });
};

export const useMemberQuery = (memberId: string | undefined) => {
  return useQuery({
    queryKey: ["member", memberId],
    queryFn: async () => {
      if (!memberId) return null;
      const response = await memberApi.getMemberById(memberId);
      if (!response.success) throw new Error(response.error);
      return response.data || null;
    },
    enabled: !!memberId,
  });
};

export const useMemberSearchQuery = (query: string) => {
  return useQuery({
    queryKey: ["members", "search", query],
    queryFn: async () => {
      if (!query) return [];
      const response = await memberApi.searchMembers(query);
      if (!response.success) throw new Error(response.error);
      return response.data || [];
    },
    enabled: query.length > 0,
  });
};

export const useCreateMemberMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateMemberInput) => async () => {
      const response = await memberApi.createMember(input);
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEMBERS_QUERY_KEY });
    },
  });
};

export const useUpdateMemberMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn:
      ({ id, input }: { id: string; input: UpdateMemberInput }) =>
      async () => {
        const response = await memberApi.updateMember(id, input);
        if (!response.success) throw new Error(response.error);
        return response.data;
      },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEMBERS_QUERY_KEY });
    },
  });
};

export const useDeleteMemberMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => async () => {
      const response = await memberApi.deleteMember(id);
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEMBERS_QUERY_KEY });
    },
  });
};
