import { useEffect } from 'react';
import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    HStack,
    InputRightElement,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
    Link,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useSetRecoilState } from "recoil";
import authScreenAtom from "../atoms/authAtom";
import useShowToast from "../hooks/useShowToast";
import userAtom from "../atoms/userAtom";
import { motion } from "framer-motion";

export default function SignupCard() {
    useEffect(() => {
        // Add styles to the body element to remove scrolling
        document.body.style.overflow = 'hidden';

        // Clean up the effect when the component unmounts
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const [showPassword, setShowPassword] = useState(false);
    const setAuthScreen = useSetRecoilState(authScreenAtom);
    const [inputs, setInputs] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
    });

    const showToast = useShowToast();
    const setUser = useSetRecoilState(userAtom);

    const handleSignup = async () => {
        try {
            const res = await fetch("/api/users/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(inputs),
            });
            const data = await res.json();

            if (data.error) {
                showToast("Error", data.error, "error");
                return;
            }

            localStorage.setItem("user-threads", JSON.stringify(data));
            setUser(data);
        } catch (error) {
            showToast("Error", error, "error");
        }
    };

    return (
        <Flex align={"center"} justify={"center"} minHeight="100vh" overflowX="hidden" overflowY="hidden">
            <Box
                bgImage="url('/assets/share.gif')"
                bgSize="cover"
                bgPosition="center"
                bgRepeat="no-repeat"
                w="100vw"
                h="100vh"
                position="absolute"
                top="0"
                left="0"
                zIndex="-1"
                opacity="0.5"
            />
            <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6} bg="rgba(255, 255, 255, 0.2)" borderRadius="xl">
                    <Stack align={"center"}>
                        <Heading fontSize={"4xl"} textAlign={"center"}>
                            Sign up
                        </Heading>
                    </Stack>
                    <Box rounded={"lg"} bg={useColorModeValue("rgba(255, 255, 255, 0.8)", "rgba(0, 0, 0, 0.8)")} boxShadow={"lg"} p={8}>
                        <Stack spacing={4}>
                            <HStack>
                                <Box>
                                    <FormControl isRequired>
                                        <FormLabel>Full name</FormLabel>
                                        <Input
                                            type='text'
                                            onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
                                            value={inputs.name}
                                        />
                                    </FormControl>
                                </Box>
                                <Box>
                                    <FormControl isRequired>
                                        <FormLabel>Username</FormLabel>
                                        <Input
                                            type='text'
                                            onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
                                            value={inputs.username}
                                        />
                                    </FormControl>
                                </Box>
                            </HStack>
                            <FormControl isRequired>
                                <FormLabel>Email address</FormLabel>
                                <Input
                                    type='email'
                                    onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
                                    value={inputs.email}
                                />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>Password</FormLabel>
                                <InputGroup>
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
                                        value={inputs.password}
                                    />
                                    <InputRightElement h={"full"}>
                                        <Button
                                            variant={"ghost"}
                                            onClick={() => setShowPassword((showPassword) => !showPassword)}
                                        >
                                            {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>
                            </FormControl>
                            <Stack spacing={10} pt={2}>
                                <Button
                                    loadingText='Submitting'
                                    size='lg'
                                    bg={useColorModeValue("gray.600", "gray.700")}
                                    color={"white"}
                                    _hover={{
                                        bg: useColorModeValue("gray.700", "gray.800"),
                                    }}
                                    onClick={handleSignup}
                                >
                                    Sign up
                                </Button>
                            </Stack>
                            <Stack pt={6}>
                                <Text align={"center"}>
                                    Already a user?{" "}
                                    <Link color={"blue.400"} onClick={() => setAuthScreen("login")}>
                                        Login
                                    </Link>
                                </Text>
                            </Stack>
                        </Stack>
                    </Box>
                </Stack>
            </motion.div>
        </Flex>
    );
}
