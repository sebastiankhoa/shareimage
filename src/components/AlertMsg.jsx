import { Alert, AlertTitle, Flex } from "@chakra-ui/react";
import React from "react";

const AlertMsg = ({ status, title, icon }) => {
	return (
		<Flex pos="absolute" top="25px" left="30%" zIndex={299} className="slide-bottom_2">
			<Alert status={`${status ? status : "info"}`}>
				{icon}
				<AlertTitle fontSize={["8pt", "12pt"]} ml={5}>
					{title}
				</AlertTitle>
			</Alert>
		</Flex>
	);
};

export default AlertMsg;
