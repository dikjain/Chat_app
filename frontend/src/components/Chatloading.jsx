import { Stack } from "@chakra-ui/layout";
import { Skeleton } from "@chakra-ui/skeleton";

const ChatLoading = () => {
  return (
    <Stack>
      <Skeleton borderRadius={"8px"} height="45px" />
      <Skeleton borderRadius={"8px"} height="45px" />
      <Skeleton borderRadius={"8px"} height="45px" />
      <Skeleton borderRadius={"8px"} height="45px" />
      <Skeleton borderRadius={"8px"} height="45px" />
      <Skeleton borderRadius={"8px"} height="45px" />
      <Skeleton borderRadius={"8px"} height="45px" />
      <Skeleton borderRadius={"8px"} height="45px" />
      <Skeleton borderRadius={"8px"} height="45px" />
      <Skeleton borderRadius={"8px"} height="45px" />
      <Skeleton borderRadius={"8px"} height="45px" />
      <Skeleton borderRadius={"8px"} height="45px" />
    </Stack> 
  );
};

export default ChatLoading;