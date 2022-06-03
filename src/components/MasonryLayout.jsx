import { Flex } from "@chakra-ui/react";
import React from "react";
import Masonry from "react-masonry-css";

import Pin from "../components/Pin";

const breakpoint = {
	default: 4,
	3000: 6,
	2000: 4,
	1200: 4,
	1000: 3,
	500: 2,
};

const MasonryLayout = ({ pins }) => {
	// console.log({ pins });
	return (
		<>
			<Masonry className="my-masonry-grid" breakpointCols={breakpoint}>
				{pins && pins?.map((pin) => <Pin key={pin._id} pin={pin} />)}
			</Masonry>
		</>
	);
};

export default MasonryLayout;
