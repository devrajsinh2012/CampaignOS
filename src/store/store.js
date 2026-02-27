import { create } from 'zustand';

const useStore = create((set, get) => ({
  // ── Auth State ──
  user: null,
  session: null,
  loading: true,
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setLoading: (loading) => set({ loading }),

  // ── Campaign Context (cross-feature) ──
  currentCampaign: null,
  setCurrentCampaign: (campaign) => set({ currentCampaign: campaign }),
  clearCampaign: () => set({ currentCampaign: null }),

  // ── Analyzer State ──
  analyzerResult: null,
  setAnalyzerResult: (result) => set({ analyzerResult: result }),

  // ── Planner State ──
  plannerResult: null,
  setPlannerResult: (result) => set({ plannerResult: result }),

  // ── Chat State ──
  chatMessages: [],
  addChatMessage: (msg) =>
    set((s) => ({ chatMessages: [...s.chatMessages, msg] })),
  clearChat: () => set({ chatMessages: [] }),

  // ── Learning Progress ──
  completedTopics: [],
  markTopicComplete: (topicId) =>
    set((s) => ({
      completedTopics: s.completedTopics.includes(topicId)
        ? s.completedTopics
        : [...s.completedTopics, topicId],
    })),

  // ── Saved Items ──
  savedAnalyses: [],
  savedPlans: [],
  pinnedNotes: [],
  addSavedAnalysis: (item) =>
    set((s) => ({ savedAnalyses: [item, ...s.savedAnalyses] })),
  addSavedPlan: (item) =>
    set((s) => ({ savedPlans: [item, ...s.savedPlans] })),
  addPinnedNote: (note) =>
    set((s) => ({ pinnedNotes: [note, ...s.pinnedNotes] })),

  // ── UI State ──
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  // ── AI Usage Tracking ──
  aiCallsToday: 0,
  incrementAICalls: () =>
    set((s) => ({ aiCallsToday: s.aiCallsToday + 1 })),
  resetAICalls: () => set({ aiCallsToday: 0 }),
}));

export default useStore;
