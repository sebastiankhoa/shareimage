import { atom } from "recoil";

export const SidebarState = atom({
	key: "sidebar",
	default: false,
});

export const searchState = atom({
	key: "searchState",
	default: "",
});
