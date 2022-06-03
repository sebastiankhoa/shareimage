import { Box, Button, Flex, Image, Input, Text, useColorMode } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { AiFillCamera, AiOutlineSearch, AiFillCheckCircle, AiFillWarning } from "react-icons/ai";
import { BsMoon, BsPlusSquareFill, BsSun } from "react-icons/bs";
import { GoSignOut } from "react-icons/go";
import { GiHamburgerMenu } from "react-icons/gi";
import { BiLogIn } from "react-icons/bi";
import { FcGoogle } from "react-icons/fc";
import { FaUserTie } from "react-icons/fa";
import { useRecoilState, useSetRecoilState } from "recoil";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

import { searchState, SidebarState } from "../../atom/state";
import app from "../../firebaseconfig";
import { fetchToken, fetchUser } from "../../utils/fetchData";
import { client } from "../../utils/client";
import AlertMsg from "./AlertMsg";

const Navbar = ({ userSanity }) => {
	// console.log({ userSanity });
	const router = useRouter();
	const { colorMode, toggleColorMode } = useColorMode();

	const [showLogin, setShowLogin] = useState(false);
	const [showLogout, setShowLogout] = useState(false);

	const [tokens, setTokens] = useState(null);

	//Recoil State
	const setSidebar = useSetRecoilState(SidebarState);
	const [searchTerm, setSearchTerm] = useRecoilState(searchState);
	// console.log({ searchTerm });

	//Danh cho Alert component
	const [isAlert, setIsAlert] = useState(false);
	const [alertMsg, setAlertMsg] = useState("");
	const [icon, setIcon] = useState(null);
	const [alertStatus, setAlertStatus] = useState(null);
	//Check scroll
	const [scroll, setScroll] = useState(false);

	useEffect(() => {
		const isScroll = () => {
			if (window.scrollY > 0) {
				setScroll(true);
			} else {
				setScroll(false);
			}
		};
		window.addEventListener("scroll", isScroll);

		return () => {
			window.removeEventListener("scroll", isScroll);
		};
	}, []);

	//Fetchuser
	useEffect(() => {
		const token = fetchToken();
		setTokens(token);
		if (tokens) {
			const [user] = fetchUser();
			client.createIfNotExists({
				_id: user.uid,
				_type: "user",
				userName: user.displayName,
				image: user.photoURL,
			});
		}
	}, [tokens]);

	//Login with google
	const auth = getAuth(app);
	const provider = new GoogleAuthProvider();

	const handleLogin = async () => {
		const { user } = await signInWithPopup(auth, provider);
		const { refreshToken, providerData } = user;
		localStorage.setItem("user", JSON.stringify(providerData));
		localStorage.setItem("accessToken", JSON.stringify(refreshToken));
		setIsAlert(true);
		setAlertMsg("Bạn đã đăng nhập thành công,đang chuyển bạn đến trang chủ");
		setAlertStatus("success");
		setIcon(<AiFillCheckCircle size="2rem" />);
		setTimeout(() => {
			setIsAlert(false);
			router.push("/");
		}, 1000);
		setTimeout(() => {
			window.location.reload();
		}, 3000);
	};

	const handleLogout = () => {
		signOut(auth)
			.then(() => {
				setIsAlert(true);
				setAlertMsg("Bạn đã đăng xuất thành công");
				setAlertStatus("warning");
				setIcon(<AiFillWarning size="2rem" />);
				setTimeout(() => {
					setIsAlert(false);
					router.reload();
				}, 1500);
				localStorage.clear();
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<>
			{isAlert && <AlertMsg title={alertMsg} status={alertStatus} icon={icon} />}
			<Flex
				align="center"
				justify="space-between"
				gap="2"
				p="5"
				bg={scroll ? "blackAlpha.600" : "unset"}
				position="fixed"
				zIndex={180}
				w="100vw"
			>
				<Box display={{ base: "flex", md: "none" }}>
					<GiHamburgerMenu size="2rem" cursor="pointer" onClick={() => setSidebar((prev) => !prev)} />
				</Box>
				<Flex align="center" cursor="pointer" gap="1" onClick={() => router.replace("/")}>
					<AiFillCamera size="2rem" color="red" />
					<Text
						fontFamily="cursive"
						fontWeight="900"
						fontSize={["9pt", "20pt"]}
						bgGradient="linear(to-r,green,pink)"
						bgClip="text"
					>
						Share Photo
					</Text>
				</Flex>
				<Flex
					align="center"
					shadow="lg"
					bg="gray.50"
					flexGrow={1}
					rounded="lg"
					mx={["0", "2"]}
					display={{ base: "none", md: "flex" }}
				>
					<AiOutlineSearch size="1.5rem" color="black" />
					<Input
						color="black"
						type="text"
						border="none"
						placeholder="Search"
						_placeholder={{ color: "black" }}
						_focus={{ border: "none" }}
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						onFocus={() => router.replace("/search")}
					/>
				</Flex>
				<Flex onClick={() => toggleColorMode((prev) => !prev)} cursor="pointer">
					{colorMode == "light" ? (
						<BsMoon color={scroll ? "white" : "unset"} size="1.5rem" className="slide-bottom" />
					) : (
						<BsSun color={scroll ? "white" : "unset"} size="1.5rem" className="slide-top" />
					)}
				</Flex>
				<Flex align="center" gap="2">
					{!userSanity ? (
						<Flex align="center" cursor="pointer" onClick={() => setShowLogin(true)} gap="1">
							<Text fontFamily="Pacifico">Login</Text>
							<BiLogIn size="2rem" />
						</Flex>
					) : (
						<Image
							alt="avatar"
							src={userSanity?.image}
							rounded="full"
							w={["8", "10"]}
							cursor="pointer"
							onClick={() => setShowLogout((prev) => !prev)}
						/>
					)}
					{/* Nút tạo bài mới */}
					<BsPlusSquareFill
						color={scroll ? "white" : "unset"}
						size="2.1rem"
						cursor="pointer"
						onClick={() =>
							router.push(
								{
									pathname: "/create",
									query: userSanity,
								},
								"create"
							)
						}
					/>
				</Flex>
				{showLogin && (
					<Box position="absolute" right="10px" top="80px" className="rotate-center" zIndex={19}>
						<Button colorScheme="facebook" leftIcon={<FcGoogle />} rounded="xl" onClick={() => handleLogin()}>
							Login with Google
						</Button>
					</Box>
				)}
				{showLogout && (
					<Flex gap="2" direction="column" position="absolute" right="10px" top="80px" className="rotate-center" zIndex={99}>
						<Button
							colorScheme="facebook"
							leftIcon={<FaUserTie />}
							rounded="xl"
							onClick={() => router.push(`/user-profile/${userSanity._id}`)}
						>
							User Info
						</Button>
						<Button colorScheme="red" leftIcon={<GoSignOut />} rounded="xl" onClick={() => handleLogout()}>
							Logout
						</Button>
					</Flex>
				)}
			</Flex>
		</>
	);
};

export default Navbar;
