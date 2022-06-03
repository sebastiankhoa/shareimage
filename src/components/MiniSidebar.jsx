import { Button, Flex, Image, Slide, Text } from "@chakra-ui/react";
import React from "react";
import { AiFillHome } from "react-icons/ai";
import { useRecoilState } from "recoil";
import { SidebarState } from "../../atom/state";
import { AiFillCloseCircle } from "react-icons/ai";

import Categories from "./Categories";

const MiniSidebar = () => {
	const [sidebar, toggleSidebar] = useRecoilState(SidebarState);
	return (
		<Slide direction="left" in={sidebar} unmountOnExit="true">
			<Flex
				direction="column"
				h="100vh"
				w="150px"
				p="2"
				gap="1"
				display={{ base: "flex", md: "none" }}
				className="scale-up-left"
				pos="relative"
				bgGradient="linear(to-b,red.300,blue.300)"
			>
				<Flex onClick={() => toggleSidebar(false)} cursor="pointer" pos="absolute" right="0" top="0">
					<AiFillCloseCircle size="1.5rem" />
				</Flex>
				<Categories />
			</Flex>
		</Slide>
	);
};

export default MiniSidebar;
