import React, { useContext, useRef, useState } from "react";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";
import {
  Button,
  Card,
  Grid,
  Icon,
  Label,
  Image,
  CardContent,
  CardHeader,
  CardMeta,
  CardDescription,
  Form,
} from "semantic-ui-react";
import moment from "moment";
import LikeButton from "../components/LikeButton";
import { AuthContext } from "../context/auth";
import DeleteButton from "./../components/DeleteButton";
import MyPopup from "../util/MyPopup";

function SinglePost(props) {
  const postId = props.match.params.postId;
  const { user } = useContext(AuthContext);
  const commentInputRef = useRef(null);
  const [comment, setComment] = useState("");
  const { data: { getPost } = {} } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postId,
    },
  });

  const [submitComment] = useMutation(SUBMIT_COMMMENT_MUTATION, {
    update() {
      setComment("");
      commentInputRef.current.blur();
    },
    variables: {
      postId,
      body: comment,
    },
  });

  function deletePostCallBack() {
    props.history.push("/");
  }

  let postMarkup;
  if (!getPost) {
    postMarkup = <p>Loading post..</p>;
  } else {
    const {
      id,
      username,
      body,
      createdAt,
      likes,
      comments,
      likeCount,
      commentCount,
    } = getPost;

    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image
              floated="right"
              size="small"
              src="https://react.semantic-ui.com/images/avatar/large/molly.png"
            />
          </Grid.Column>
          {/* another grid  */}
          <Grid.Column width={10}>
            <Card fluid>
              <CardContent>
                <CardHeader>{username}</CardHeader>
                <CardMeta>{moment(createdAt).fromNow()}</CardMeta>
                <CardDescription>{body}</CardDescription>
              </CardContent>
              <hr />
              <CardContent>
                <LikeButton user={user} post={{ id, likeCount, likes }} />

                <MyPopup content="Comment on post">
                  <Button
                    as="div"
                    labelPosition="right"
                    onClick={() => console.log("Comment on post")}
                  >
                    <Button basic color="blue">
                      <Icon name="comments" />
                      <Label basic color="blue" pointing="left">
                        {commentCount}
                      </Label>
                    </Button>
                  </Button>
                </MyPopup>

                {user && user.username === username && (
                  <DeleteButton postId={id} callBack={deletePostCallBack} />
                )}
              </CardContent>
            </Card>

            {/* creating new comments         */}

            {user && (
              <Card fluid>
                <CardContent>
                  <p>Post a comment</p>
                  <Form>
                    <div className="ui action input fluid">
                      <input
                        type="text"
                        placeholder="Comment.."
                        name="comment"
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                        ref={commentInputRef}
                      />
                      <button
                        type="submit"
                        className="ui button teal"
                        disabled={comment.trim() === ""}
                        onClick={submitComment}
                      >
                        Submit
                      </button>
                    </div>
                  </Form>
                </CardContent>
              </Card>
            )}

            {comments.map((comment) => (
              <Card fluid key={Comment.id}>
                <CardContent>
                  {user && user.username === comment.username && (
                    <DeleteButton postId={id} commentId={comment.id} />
                  )}

                  <CardHeader>{comment.username}</CardHeader>
                  <CardMeta>{moment(comment.createdAt).fromNow()}</CardMeta>
                  <CardDescription>{comment.body}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  } // end else

  return postMarkup;
}

const SUBMIT_COMMMENT_MUTATION = gql`
  mutation ($postId: String!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id
        body
        createdAt
        username
      }
      commentCount
    }
  }
`;

const FETCH_POST_QUERY = gql`
  query ($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

export default SinglePost;
