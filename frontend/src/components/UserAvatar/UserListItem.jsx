import { Avatar } from "@chakra-ui/avatar";
import { Box, Text } from "@chakra-ui/layout";
import { ChatState } from "../../Context/ChatProvider";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      bg="black" // Set background to black
      _hover={{
        background: "green.500", // Neon green on hover
        color: "white",
      }}
      w="100%"
      display="flex"
      alignItems="center"
      color="green.300" // Neon green text
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
      borderWidth="1px" // Optional: add a border
      borderColor="green.400" // Optional: neon green border
    >
      <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={user.name}
        src={user.pic}
      />
      <Box>
        <Text color="white">{user.name}</Text>
        <Text fontSize="xs" color="green.300"> {/* Neon green for email text */}
          <b style={{color:"white"}}>Email : </b>
          {user.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;
