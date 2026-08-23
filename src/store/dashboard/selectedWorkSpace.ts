import type { WorkSpaceRole } from "../../types/WorkSpaceRole";
import type WorkSpaceDto from "../../dtos/workspace/WorkSpaceDto";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface SelectedWorkSpaceState {
  workSpaceId: number;
  workSpace: WorkSpaceDto;
  workSpaceRole: WorkSpaceRole;
}

const initialState: SelectedWorkSpaceState = {
  workSpaceId: 0,
  workSpace: null,
  workSpaceRole: null,
};

const selectedWorkSpaceSlice = createSlice({
  name: "selectedWorkSpace",
  initialState,
  reducers: {
    setSelectedWorkSpace: (
      state,
      action: PayloadAction<SelectedWorkSpaceState>,
    ) => {
      state.workSpaceId = action.payload.workSpaceId;
      state.workSpace = action.payload.workSpace;
      state.workSpaceRole = action.payload.workSpaceRole;
    },
    clearSelectedWorkSpace: (state) => {
      state.workSpace = null;
      state.workSpaceRole = null;
    },
  },
});

export const { setSelectedWorkSpace, clearSelectedWorkSpace } =
  selectedWorkSpaceSlice.actions;

export default selectedWorkSpaceSlice.reducer;
