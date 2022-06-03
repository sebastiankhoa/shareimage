import React, { useState, useEffect } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { useRouter } from "next/router";
import { MdDelete } from "react-icons/md";

import { categories } from "../../utils/data";
import { client } from "../../utils/client";
import { Box, Button, Flex, Image, Input, Select, Stack, Text } from "@chakra-ui/react";
import { useMediaQuery } from "@chakra-ui/react";
import { Circles, MutatingDots } from "react-loader-spinner";
import { fetchToken, fetchUser } from "../../utils/fetchData";
import { Radio, RadioGroup } from "@chakra-ui/react";

const CreatePin = () => {
	const [title, setTitle] = useState("");
	const [about, setAbout] = useState("");
	const [fields, setFields] = useState(false);
	const [category, setCategory] = useState(null);
	const [imageAsset, setImageAsset] = useState();
	const [wrongImageType, setWrongImageType] = useState(false);
	const [loading, setLoading] = useState(false);
	const [posting, setPosting] = useState(false);

	console.log({ category });

	//Nhận props đc chuyển từ navbar sang bằng router :D
	const router = useRouter();
	const userInfo = router.query;
	// console.log(userInfo);

	//Function để upload image
	const uploadImage = (e) => {
		const selectedFile = e.target.files[0];
		const { type, name } = selectedFile;
		if (
			type === "image/png" ||
			type === "image/svg" ||
			type === "image/jpeg" ||
			type === "image/gif" ||
			type === "image/tiff" ||
			type === "image/webp"
		) {
			setWrongImageType(false);
			setLoading(true);
			client.assets
				.upload("image", selectedFile, { contentType: type, filename: name })
				.then((document) => {
					setImageAsset(document);
					setLoading(false);
				})
				.catch((err) => {
					console.log("Upload fail", err.message);
				});
		} else {
			setWrongImageType(true);
			setLoading(false);
		}
	};
	// function create doc sanity
	const finishHandler = () => {
		if (title && about && imageAsset?._id && category) {
			setPosting(true);
			const doc = {
				_type: "pin",
				title,
				about,
				image: {
					_type: "image",
					asset: {
						_type: "reference",
						_ref: imageAsset?._id,
					},
				},
				userId: userInfo?._id,
				postedBy: {
					_type: "postedBy",
					_ref: userInfo?._id,
				},
				category,
			};

			client.create(doc).then(() => {
				router.replace("/");
				setPosting(false);
			});
		} else {
			setFields(true);
			setTimeout(() => {
				setFields(false);
			}, 2000);
		}
	};

	//=========================================================================

	return (
		<Flex direction="column" w="100%" align="center">
			{fields && <Text textAlign="center">Xin điền đầy đủ thong tin</Text>}
			<Flex direction="column" w={["90%", "70%"]} h="550px" bg="red.50" shadow="xl" align="center" justify="center">
				<Flex direction="column" w="95%" h="95%" align="center" justify="center" border="2px" borderStyle="dashed" color="black">
					{loading && <Circles ariaLabel="loading-indicator" />}
					{wrongImageType && <Text fontFamily="Pacifico">Không hỗ trợ định dạng ảnh này !</Text>}
					{!imageAsset ? (
						<label>
							<Flex direction="column" justify="center" align="center" cursor="pointer">
								<AiOutlineCloudUpload size="2rem" />
								<Text fontFamily="Pacifico" fontSize={["10pt", "20pt"]}>
									Click to upload
								</Text>
								<input type="file" name="upload-image" onChange={uploadImage} style={{ width: 0, hieght: 0 }} />
								<Text fontSize={{ base: "10pt", md: "12pt", lg: "15pt" }}>Sử dụng ảnh nhỏ hơn 20MB, JPG,SVG,PNG,GIF</Text>
							</Flex>
						</label>
					) : (
						<Flex position="relative">
							<Image src={imageAsset?.url} alt="image" w="full" h="490px" objectFit="contain" />
							<Button
								w="fit-content"
								colorScheme="facebook"
								pos="absolute"
								bottom="3"
								right="3"
								onClick={() => {
									setImageAsset(null);
									setLoading(false);
								}}
							>
								<MdDelete size="1.5rem" />
							</Button>
						</Flex>
					)}
				</Flex>
			</Flex>
			<Flex w={["90%", "70%"]} mt="5" direction="column" gap="5" h="350px">
				{userInfo && (
					<Flex align="center" gap="2">
						<Image alt="" src={userInfo.image} w="10" h="10" rounded="full" />
						<Text fontFamily="Pacifico">{userInfo.userName}</Text>
					</Flex>
				)}
				<Input type="text" placeholder="Nhập tiêu đề của ảnh" border="none" onChange={(e) => setTitle(e.target.value)} />
				<Input type="text" placeholder="Nội dung của ảnh" border="none" onChange={(e) => setAbout(e.target.value)} />
				<Text fontFamily="Pacifico">Chọn chủ đề của ảnh</Text>
				<Flex direction="column">
					<Select
						display={{ base: "none", lg: "flex" }}
						placeholder="Category"
						size="md"
						textTransform="capitalize"
						fontWeight="600"
						fontSize={["12pt", "13pt"]}
						w={["90%", "50%"]}
						onChange={(e) => setCategory(e.target.value)}
					>
						{categories.map((cat, _i) => (
							<option key={_i} value={cat.name}>
								{cat.name}
							</option>
						))}
					</Select>
					<RadioGroup display={{ base: "flex", lg: "none" }} onChange={setCategory} value={category}>
						<Flex direction="row" flexWrap="wrap" gap="2" w="100%" align="center" justify="center" textTransform="capitalize">
							{categories.map((cat, _index) => (
								<Radio value={cat.name} key={_index}>
									{cat.name}
								</Radio>
							))}
						</Flex>
					</RadioGroup>
				</Flex>
			</Flex>
			<Flex mb="10" direction="column" gap="5" align="center">
				<Button size="lg" colorScheme="facebook" rounded="xl" shadow="xl" loading={loading} onClick={() => finishHandler()}>
					Hoàn thành & Đăng ảnh
				</Button>
				<Box>{posting && <MutatingDots />}</Box>
			</Flex>
		</Flex>
	);
};

export default CreatePin;
