import { Flex } from "@chakra-ui/react";
import React from "react";
import { client } from "../../../utils/client";
import { searchQuery } from "../../../utils/data";
import MasonryLayout from "../../components/MasonryLayout";

const Category = ({ pins }) => {
	// console.log({ pins });
	return (
		<>
			<MasonryLayout pins={pins} />
		</>
	);
};

export default Category;

export const getServerSideProps = async ({ params: { slug } }) => {
	const query = searchQuery(slug);
	const data = await client.fetch(query);

	return {
		props: {
			pins: data,
		},
	};
};
