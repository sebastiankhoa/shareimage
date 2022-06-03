import { Flex, Image, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";

import { categories } from "../../utils/data";

const Categories = () => {
	const router = useRouter();

	return (
		<Flex direction="column" gap="5">
			{categories.map((cat, _i) => (
				<Flex
					key={_i}
					w="100%"
					gap="2"
					align="center"
					cursor="pointer"
					onClick={() => router.replace(`/category/${cat.name}`)}
					role="group"
				>
					<Image
						src={cat.image}
						alt=""
						rounded="full"
						w="10"
						h="10"
						objectFit="cover"
						_groupHover={{ transform: "rotate(180deg)" }}
						transition="2s ease"
					/>
					<Text
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
