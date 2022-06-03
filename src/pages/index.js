import { Flex } from "@chakra-ui/react";
import { useState, useEffect } from "react";

import { feedQuery } from "../../utils/data";
import { client } from "../../utils/client";
import MasonryLayout from "../components/MasonryLayout";
import { fetchToken, fetchUser } from "../../utils/fetchData";

export default function Home({ pins }) {
	return (
		<>
			<MasonryLayout pins={pins} />
		</>
	);
}

export const getServerSideProps = async () => {
	const data = await client.fetch(feedQuery);
	return {
		props: {
			pins: data,
		},
	};
};
