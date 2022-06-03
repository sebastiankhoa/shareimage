import { Box, Button, Flex, Image, Link, Text } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { MdDownloadForOffline } from "react-icons/md";
import { AiTwotoneDelete } from "react-icons/ai";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";

import { client, urlFor } from "../../utils/client";
import { useRouter } from "next/router";
import { fetchToken, fetchUser } from "../../utils/fetchData";

const Pin = ({ pin: { postedBy, image, _id, destination, save } }) => {
	// console.log({ save });
	const router = useRouter();

	const [hovered, setHovered] = useState(false);
	const [savingPost, setSavingPost] = useState(false);
	const [userInfo, setUserInfo] = useState(null);
	const [tokens, setTokens] = useState(null);
	const [alreadySave, setAlreadySave] = useState();

	// console.log({ alreadySave });

	useEffect(() => {
		const t = fetchToken();
		setTokens(t);
		if (tokens) {
			const [user] = fetchUser();
			setUserInfo(user);
		}
		// prettier-ignore
		const saveState = !!(save?.filter((item) => item._id === userInfo?.uid))?.length;
		setAlreadySave(saveState);
	}, [save, tokens, alreadySave]);

	// useEffect(() => {
	// 	// prettier-ignore
	// 	const saveState = !!(save?.filter((item) => item._id === userInfo?.uid))?.length;
	// 	setAlreadySave(saveState);
	// }, [save]);

	//Function để đếm số lượng đã save, liên kết với sanity
	const savePin = (id) => {
		if (!alreadySave) {
			setSavingPost(true); //Tuong tu nhu isLoading

			client
				.patch(id)
				.setIfMissing({ save: [] })
				.insert("after", "save[-1]", [
					{
						_key: uuidv4(),
						userId: userInfo?.uid,
						postedBy: {
							_type: "postedBy",
							_ref: userInfo?.uid,
						},
					},
				])
				.commit()
				.then(() => {
					router.reload();
					setSavingPost(false);
				});
		}
	};

	const deletePin = (id) => {
		client.delete(id).then(() => {
			router.reload();
		});
	};

	return (
		<Flex direction="column" shadow="lg" pb="2" pos="relative">
			<Box
				onMouseEnter={() => setHovered(true)}
				onMouseLeave={() => setHovered(false)}
				onClick={() =>
					router.push(
						{
							pathname: `/pin-detail/${_id}`,
							query: userInfo,
						},
						`/pin-detail/${_id}`
					)
				}
				pos="relative"
				cursor="zoom-in"
				w="auto"
				_hover={{ shadow: "lg" }}
				rounded="lg"
				overflow="hidden"
				transition="500ms ease"
			>
				<Image alt="user-post" src={urlFor(image)} rounded="lg" w="full" />
				{hovered && (
					<Flex direction="column" pos="absolute" top="0" w="100%" h="100%" bg="blackAlpha.200" justify="space-between">
						{/* Nut download goc tren ben trai */}
						<Flex justify="space-between">
							<Link
								download
								href={`${image.asset?.url}?dl=`}
								display="flex"
								justifyContent="center"
								alignItems="center"
								bg="white"
								w="9"
								h="9"
								rounded="full"
								opacity="75%"
								outline="none"
								_hover={{ opacity: "100%", shadow: "lg" }}
								onClick={(e) => e.stopPropagation()}
							>
								<MdDownloadForOffline size="1.3rem" color="black" />
							</Link>
							{/* Nut save goc tren phai */}
							{alreadySave && userInfo ? (
								<Button
									colorScheme="green"
									fontSize="8pt"
									w="8"
									h="8"
									rounded="full"
									onClick={(e) => {
										e.stopPropagation();
									}}
								>
									{save?.length} Liked
								</Button>
							) : (
								<Button
									colorScheme="orange"
									fontSize="8pt"
									w="8"
									h="8"
									rounded="full"
									opacity="75%"
									outline="none"
									_hover={{ opacity: "100%", shadow: "lg" }}
									onClick={(e) => {
										e.stopPropagation();
										savePin(_id);
									}}
								>
									{save?.length} {savingPost ? "Saving..." : "Like"}
								</Button>
							)}
						</Flex>
						{postedBy?._id === userInfo?.uid && (
							<Button
								colorScheme="facebook"
								w="fit-content"
								fontSize="8pt"
								rounded="full"
								opacity="75%"
								outline="none"
								_hover={{ opacity: "100%", shadow: "lg" }}
								onClick={(e) => {
									e.stopPropagation();
									deletePin(_id);
								}}
							>
								<AiTwotoneDelete size="1.5rem" />
							</Button>
						)}
					</Flex>
				)}
			</Box>
			<Flex
				w="full"
				bg="blackAlpha.300"
				pos="absolute"
				bottom="2"
				align="center"
				gap="2"
				cursor="pointer"
				onClick={() => router.push(`/user-profile/${postedBy?._id}`)}
			>
				<Image src={postedBy.image} alt="" rounded="full" w="8" h="8" />
				<Text color="white" fontFamily="Pacifico">
					{postedBy.userName}
				</Text>
			</Flex>
		</Flex>
	);
};

export default Pin;
