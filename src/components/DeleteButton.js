import React, { useState } from "react";
import { gql } from "graphql-tag";
import { Button, Icon, Confirm } from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";
import { FETCH_POSTS_QUERY } from "./../util/graphQL";
import MyPopup from "../util/MyPopup";
function DeleteButton({ postId, commentId, callBack }) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

  const [deletePostORMutation] = useMutation(mutation, {
    update(proxy) {
      setConfirmOpen(false);
      //TODO : remove post from cache

      if (!commentId) {
        const data = proxy.readQuery({
          query: FETCH_POSTS_QUERY,
        });
        data.getPosts = data.getPosts.filter((p) => p.id !== postId);
        proxy.writeQuery({ query: FETCH_POSTS_QUERY, data });
      }

      if (callBack) callBack();
    },
    variables: {
      postId,
      commentId,
    },
  });

  return (
    <>
      <MyPopup content={commentId ? "Delete comment" : "Delete post"}>
        <Button
          as="div"
          color="red"
          floated="right"
          onClick={() => {
            setConfirmOpen(true);
          }}
        >
          <Icon name="trash" style={{ margin: 0 }} />
        </Button>
      </MyPopup>

      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deletePostORMutation}
      />
    </>
  );
}

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id
        username
        createdAt
        body
      }
      commentCount
    }
  }
`;
export default DeleteButton;
