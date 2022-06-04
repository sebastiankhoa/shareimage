import { Flex, Image, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";

import { categories } from "../../utils/data";
import { useSetRecoilState } from "recoil";
import { SidebarState } from "../../atom/state";

const Categories = () => {
	const router = useRouter();
	const setMiniSidebar = useSetRecoilState(SidebarState);

	return (
		<Flex direction="column" gap="5">
			{categories.map((cat, _i) => (
				<Flex
					key={_i}
					w="100%"
					gap="2"
					align="center"
					cursor="pointer"
					onClick={() => {
						router.push(`/category/${cat.name}`);
						setMiniSidebar(false);
					}}
					role="group"
				>
					<Image
						src={cat.image}
						alt=""
						rounded="full"
						w={["7", "10"]}
						h={["7", "10"]}
						objectFit="cover"
						_groupHover={{ transform: "rotate(180deg)" }}
						transition="2s ease"
					/>
					<Text
						fontSize={["8pt", "13pt"]}
						textTransform="capitalize"
						fontWeight="700"
						fontFamily="serif"
						_groupHover={{ transform: "translateX(5px)" }}
						transition="0.5s ease"
					>
						{cat.name}
					</Text>
				</Flex>
			))}
		</Flex>
	);
};

export default Categories;
