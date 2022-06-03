import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { MdDownloadForOffline } from "react-icons/md";
import { AiOutlineSend } from "react-icons/ai";
import { v4 as uuidv4 } from "uuid";
import { Circles, FallingLines } from "react-loader-spinner";

import { pinDetailQuery, pinDetailMorePinQuery } from "../../../utils/data";
import { client, urlFor } from "../../../utils/client";
import { Box, Center, Divider, Flex, Img, Input, Link, Text } from "@chakra-ui/react";
import MasonryLayout from "../../components/MasonryLayout";

const PinDetail = ({ pins, pinsMore, pinId }) => {
	const router = useRouter();

	const [comment, setComment] = useState("");
	const [addingComment, setAddingComment] = useState(false);
	const [users, setUsers] = useState(null);

	// console.log({ users });
	// console.log({ pins });
	// console.log({ pinId });
	useEffect(() => {
		const user = router.query;
		setUsers(user);
	}, [users]);
	console.log({ users });

	if (!pins)
		return (
			<Center>
				<Circles />
			</Center>
		);
	//Function add comment
	const addCommentHandle = () => {
		if (comment) {
			setAddingComment(true);

			client
				.patch(pinId)
				.setIfMissing({ comments: [] })
				.insert("after", "comments[-1]", [
					{
						comment,
						_key: uuidv4(),
						postedBy: {
							_type: "postedBy",
							_ref: users.uid,
						},
					},
				])
				.commit()
				.then(() => {
					setComment("");
					setAddingComment(false);
					router.replace(`/pin-detail/${pinId}`);
				});
		}
	};

	return (
		<Flex direction="column" align={{ base: "center", lg: "unset" }}>
			<Flex direction={{ base: "column", xl: "row" }} gap="5" align="center" justify="center">
				<Flex w={{ base: "100%", xl: "60%" }} px="2" shadow={{ base: "lg", lg: "none" }}>
					<Img
						src={pins?.image && urlFor(pins?.image)}
						width="full"
						h="800px"
						roundedTop="3xl"
						roundedBottom="lg"
						objectFit="contain"
					/>
				</Flex>
				<Flex direction="column" w={{ base: "100%", xl: "40%" }} px="5" gap="10">
					<Flex align="center" justify="space-between">
						<Link download href={`${pins.image.asset.url}?dl=`}>
							<Flex align="center" _hover={{ color: "green" }}>
								<MdDownloadForOffline size="2rem" />
								<Text fontFamily="serif" textDecoration="underline" fontWeight="600">
									Download
								</Text>
							</Flex>
						</Link>
						<Text fontFamily="serif" fontWeight="700" fontSize={{ base: "9pt", xl: "17pt" }}>
							Tác giả: {users?.displayName}
						</Text>
					</Flex>
					<Text fontFamily="Pacifico" fontWeight="900" fontSize={{ base: "14pt", xl: "20pt" }} textAlign="center">
						{pins?.title}
					</Text>
					<Text fontFamily="serif" fontSize={{ md: "15pt", lg: "16pt" }}>
						{pins.about}
					</Text>
					<Flex direction="column">
						<Text fontFamily="serif" textAlign="center" fontSize={{ base: "12pt", xl: "20pt" }} fontWeight="extrabold">
							Bình luận
						</Text>
						<Flex direction="column" shadow="lg" w="100%" h="450px" overflowY="scroll" border="1px" borderColor="gray.300">
							{pins?.comments?.map((item) => (
								<>
									<Flex key={item.key} align="center" gap="2" p="2">
										<Img src={item?.postedBy?.image} rounded="full" w="8" h="8" />
										<Text fontFamily="fantasy">{item?.comment}</Text>
									</Flex>
									<Divider w="60%" alignSelf="center" />
								</>
							))}
						</Flex>
					</Flex>
				</Flex>
			</Flex>
			{users?.uid ? (
				<Flex gap="2" align="center" my="5" w={{ base: "80%", lg: "60%" }} border="1px" p="2" rounded="xl" shadow="lg" mx="auto">
					<Img src={users?.photoURL} w="8" h="8" rounded="full" />
					<Input
						type="text"
						placeholder="Nhập bình luận của bạn"
						border="none"
						_focus={{ border: "none" }}
						value={comment}
						onChange={(e) => setComment(e.target.value)}
					/>
					<Box className="rotate-center" cursor="pointer" _hover={{ color: "green" }} onClick={() => addCommentHandle()}>
						<AiOutlineSend size="2rem" />
					</Box>
				</Flex>
			) : (
				<Flex mt="10" mx="auto">
					<Text fontFamily="Tahoma" fontSize="3xl" fontWeight="700">
						Hãy đăng nhập để bình luận về ảnh
					</Text>
				</Flex>
			)}
			<Flex justify="center">{addingComment && <FallingLines width="50" color="#c8553d" />}</Flex>
			<Text fontFamily="serif" fontSize="18pt" textAlign="center" fontWeight="700">
				Ảnh tương tự
			</Text>
			<MasonryLayout pins={pinsMore} />
		</Flex>
	);
};

export default PinDetail;

export const getServerSideProps = async ({ params: { slug } }) => {
	// console.log({ slug });
	const query = pinDetailQuery(slug);
	const [data] = await client.fetch(query);

	const query1 = pinDetailMorePinQuery(data);
	const data2 = await client.fetch(query1);

	// console.log({ data });
	return {
		props: {
			pins: data,
			pinsMore: data2,
			pinId: slug,
		},
	};
};
