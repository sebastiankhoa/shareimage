import { Flex, Image, Text } from "@chakra-ui/react";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { AiFillHome } from "react-icons/ai";
import { GoSignOut } from "react-icons/go";
import app from "../../firebaseconfig";

import { fetchToken, fetchUser } from "../../utils/fetchData";
import Categories from "./Categories";

const Sidebar = ({ userSanity }) => {
	const router = useRouter();

	const [isAlert, setIsAlert] = useState(false);
	const [alertMsg, setAlertMsg] = useState("");
	const [alertStatus, setAlertStatus] = useState(null);

	//Sign out handle
	const auth = getAuth(app);
	const handleLogout = () => {
		signOut(auth)
			.then(() => {
				localStorage.clear();
				router.reload();
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<Flex direction="column" h="100vh" w="200px" display={{ base: "none", md: "flex" }} pos="fixed" mt="80px">
			<Flex direction="column" gap="4" p="4" pos="relative" h="90%">
				<Flex align="center" gap="1" onClick={() => router.replace("/")} cursor="pointer">
					<AiFillHome size="1.5rem" />
					<Text fontWeight="700">Home</Text>
				</Flex>
				<Text fontSize="xl" fontFamily="Pacifico">
					Discover categories
				</Text>
				<Categories />
				{userSanity ? (
					<Flex
						align="center"
						gap="2"
						shadow="lg"
						p="2"
						rounded="lg"
						position="absolute"
						bottom="0"
						cursor="pointer"
						onClick={() => router.push(`/user-profile/${userSanity?._id}`)}
					>
						<Image alt="avatar" src={userSanity.image} rounded="full" w="10" />
						<Text fontSize="9pt">{userSanity.userName}</Text>
						<GoSignOut size="1.5rem" />
					</Flex>
				) : (
					<Flex align="center" gap="2" shadow="lg" p="2" rounded="lg" position="absolute" bottom="0">
						<Text fontSize="8pt">Đăng nhập để đăng ảnh của bạn</Text>
					</Flex>
				)}
			</Flex>
		</Flex>
	);
};

export default Sidebar;
