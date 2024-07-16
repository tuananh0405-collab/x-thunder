import { Avatar, Divider, Flex, Text, Image } from "@chakra-ui/react";

const Comment = ({ reply, lastReply }) => {
  return (
    <>
      <Flex gap={4} py={2} my={2} w={"full"}>
        <Avatar src={reply.userProfilePic} size={"sm"} />
        <Flex gap={1} w={"full"} flexDirection={"column"}>
          <Flex
            w={"full"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Text fontSize="sm" fontWeight="bold">
              {reply.username}
            </Text>
          </Flex>
          <Text>{reply.text}</Text>
          {reply.image && <Image src={reply.image} alt={reply.text} />}
        </Flex>
      </Flex>
      {!lastReply ? <Divider /> : null}
    </>
  );
};

export default Comment;
