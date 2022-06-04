import { Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay } from "@chakra-ui/react";
import React from "react";
import { useRecoilState } from "recoil";
import { SidebarState } from "../../atom/state";
import Categories from "./Categories";

const MiniSidebar = () => {
	const [sidebar, toggleSidebar] = useRecoilState(SidebarState);
	return (
		<Drawer isOpen={sidebar} placement="left" onClose={() => toggleSidebar(false)}>
			<DrawerOverlay />
			<DrawerContent>
				<DrawerCloseButton />
				<DrawerHeader>All Categories</DrawerHeader>
				<DrawerBody>
					<Categories />
				</DrawerBody>
			</DrawerContent>
		</Drawer>
	);
};

export default MiniSidebar;
