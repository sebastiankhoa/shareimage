import React, { useEffect, useState } from "react";
import { userCreatedPinsQuery, userQuery, userSavedPinsQuery } from "../../../utils/data";
import { client } from "../../../utils/client";
import MasonryLayout from "../../components/MasonryLayout";
import { Button, Center, Flex, Img, Text } from "@chakra-ui/react";
import { fetchUser } from "../../../utils/fetchData";
import { useRouter } from "next/router";
import { Circles } from "react-loader-spinner";

const UserProfile = () => {
	const randomImg = "https://source.unsplash.com/1600x900/?nature,photography,technology";
	const router = useRouter();
	const userId = router.query.slug;

	const [user, setUser] = useState();
	const [pins, setPins] = useState();
	const [text, setText] = useState("Created");
	console.log({ text });

	useEffect(() => {
		const query = userQuery(userId);

		client.fetch(query).then((data) => {
			setUser(data[0]);
		});
	}, [userId]);

	//fetch data khi bấm Created hoặc Liked
	useEffect(() => {
		if (text == "Created") {
			const query_1 = userCreatedPinsQuery(userId);
			client.fetch(query_1).then((data) => {
				setPins(data);
			});
		} else {
			const query_2 = userSavedPinsQuery(userId);
			client.fetch(query_2).then((data) => {
				setPins(data);
			});
		}
	}, [text, userId]);

	if (!user)
		return (
			<Center>
				<Circles />
			</Center>
		);

	return (
		<Flex direction="column" w="100%" align="center">
			<Flex align="center" justify="center" direction="column" w="full">
				<Img h="400px" w="full" src={randomImg} objectFit="cover" />
				<Img src={user?.image} rounded="full" w="150px" mt="-70px" />
			</Flex>
			<Text textAlign="center" fontFamily="cursive" fontWeight="700" fontSize={{ base: "20pt", lg: "35pt" }}>
				{" "}
				{user?.userName}
			</Text>
			<Flex gap="5" align="center">
				<Button
					colorScheme={text == "Created" ? "red" : "blackAlpha"}
					variant={text == "Created" ? "solid" : "unstyled"}
					rounded="2xl"
					onClick={(e) => setText(e.target.textContent)}
				>
					Created
				</Button>
				<Button
					colorScheme={text == "Liked" ? "red" : "blackAlpha"}
					variant={text == "Liked" ? "solid" : "unstyled"}
					rounded="2xl"
					onClick={(e) => setText(e.target.textContent)}
				>
					Liked
				</Button>
			</Flex>
			{pins?.length ? (
				<Flex mt="5">
					<MasonryLayout pins={pins} />
				</Flex>
			) : (
				<Text fontFamily="serif" fontSize="25pt">
					User chưa tạo hoặc save ảnh nào hết
				</Text>
			)}
		</Flex>
	);
};

export default UserProfile;
