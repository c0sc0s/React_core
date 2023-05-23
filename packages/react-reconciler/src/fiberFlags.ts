export const NoFlags = 0b000000;
export const Placement = 0b000001;
export const Update = 0b0000010;
export const PlacementAndUpdate = 0b000011;
export const ChildDeletion = 0b000100;

export const MutationMask = Placement | Update | ChildDeletion;
