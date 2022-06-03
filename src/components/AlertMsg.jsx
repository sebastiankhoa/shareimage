import { Alert, AlertTitle, Flex } from "@chakra-ui/react";
import React from "react";

const AlertMsg = ({ status, title, icon }) => {
	return (
		<Flex pos="absolute" top="0" left="20%" zIndex={99} className="slide-bottom_2">
			<Alert status={`${status ? status : "info"}`}>
				{icon}
				<AlertTitle ml={5}>{title}</AlertTitle>
			</Alert>
		</Flex>
	);
};

export default AlertMsg;
