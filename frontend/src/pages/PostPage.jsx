import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Image as ChakraImage,
  Spinner,
  Text,
} from "@chakra-ui/react";
import Actions from "../components/Actions";
import { useEffect } from "react";
import Comment from "../components/Comment";
import useGetUserProfile from "../hooks/useGetUserProfile";
import useShowToast from "../hooks/useShowToast";
import { useNavigate, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { DeleteIcon } from "@chakra-ui/icons";
import postsAtom from "../atoms/postsAtom";

const PostPage = () => {
  const { user, loading } = useGetUserProfile();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const showToast = useShowToast();
  const { pid } = useParams();
  const currentUser = useRecoilValue(userAtom);
  const navigate = useNavigate();

  const currentPost = posts[0];

  useEffect(() => {
    const getPost = async () => {
      setPosts([]);
      try {
        const res = await fetch(`/api/posts/${pid}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setPosts([data]);
      } catch (error) {
        showToast("Error", error.message, "error");
      }
    };
    getPost();
  }, [showToast, pid, setPosts]);

  const handleDeletePost = async () => {
    try {
      if (!window.confirm("Are you sure you want to delete this post?")) return;

      const res = await fetch(`/api/posts/${currentPost._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Post deleted", "success");
      navigate(`/${user.username}`);
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  if (!currentPost) return null;

  return (
    <Flex flexDirection="column" gap={4}>
      {/* USER */}
      <Flex justifyContent="space-between" alignItems="center">
        <Flex alignItems="center" gap={4}>
          <Avatar src={user.profilePic} size="md" name="Mark Zuckerberg" />
          <Text fontWeight="medium">
            {user.name && user.surname
              ? `${user.name} ${user.surname}`
              : user.username}
          </Text>
        </Flex>
        {currentUser?._id === user._id && (
          <DeleteIcon size={20} cursor="pointer" onClick={handleDeletePost} />
        )}
      </Flex>

      {/* DESCRIPTION */}
      <Flex flexDirection="column" gap={4}>
        {currentPost.img && (
          <Box w="full" minH="96" position="relative">
            <ChakraImage
              src={currentPost.img}
              alt="Post image"
              w="full"
              objectFit="cover"
              borderRadius="md"
            />
          </Box>
        )}
        <Text>{currentPost.text}</Text>
      </Flex>

      {/* INTERACTION */}
      <Actions post={currentPost} />

      {/* COMMENTS */}
      <Divider my={4} />
      {currentPost.replies.map((reply) => (
        <Comment
          key={reply._id}
          reply={reply}
          lastReply={
            reply._id ===
            currentPost.replies[currentPost.replies.length - 1]._id
          }
        />
      ))}

      {/* DOWNLOAD APP PROMO */}
      <Divider my={4} />
      <Flex justifyContent="space-between" alignItems="center">
        <Flex alignItems="center" gap={2}>
          <Text fontSize="2xl">👋</Text>
          <Text color="gray.500">Get the app to like, reply and post.</Text>
        </Flex>
        <Button>Get</Button>
      </Flex>
    </Flex>
  );
};

export default PostPage;
