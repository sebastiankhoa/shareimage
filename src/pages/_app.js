import "../styles/globals.css";
import "@fontsource/lato";
import "@fontsource/pacifico";
import { ChakraProvider } from "@chakra-ui/react";
import { RecoilRoot } from "recoil";
import { useRouter } from "next/router";
import NextNProgress from "nextjs-progressbar";

import { theme } from "../../chakra/theme";
import Layout from "../components/Layout";

function MyApp({ Component, pageProps }) {
	const router = useRouter();
	return (
		<ChakraProvider theme={theme}>
			<NextNProgress color="red" showOnShallow={true} />
			<RecoilRoot>
				<Layout>
					<Component key={router.asPath} {...pageProps} />
				</Layout>
			</RecoilRoot>
		</ChakraProvider>
	);
}

export default MyApp;
