import { Center, Flex, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { Circles } from "react-loader-spinner";

import { searchState } from "../../atom/state";
import { client } from "../../utils/client";
import { feedQuery, searchQuery } from "../../utils/data";
import MasonryLayout from "../components/MasonryLayout";

const Search = () => {
	const searchTerm = useRecoilValue(searchState);
	console.log(searchTerm);

	const [pins, setPins] = useState();
	const [loading, setLoading] = useState(false);
	// console.log({ pins });

	useEffect(() => {
		if (searchTerm !== "") {
			setLoading(true);
			const query = searchQuery(searchTerm.toLowerCase());
			client.fetch(query).then((data) => {
				setPins(data);
				setLoading(false);
			});
		} else {
			client.fetch(feedQuery).then((data) => {
				setPins(data);
				setLoading(false);
			});
		}
	}, [searchTerm]);

	return (
		<>
			{loading && (
				<Center>
					<Circles />
				</Center>
			)}
			{pins?.length !== 0 && <MasonryLayout pins={pins} />}
			{pins?.length === 0 && searchTerm !== "" && !loading && <Text>Không có ảnh nào được tìm thấy</Text>}
		</>
	);
};

export default Search;
