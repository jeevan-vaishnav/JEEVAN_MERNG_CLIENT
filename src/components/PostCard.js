import React, { useContext } from "react";
import { Card, Image, Button, Icon, Label } from "semantic-ui-react";
import { AuthContext } from "../context/auth";
import moment from "moment";
import { Link } from "react-router-dom";
import LikeButton from "./LikeButton";
import DeleteButton from "./DeleteButton";
import MyPopup from "../util/MyPopup";
function PostCard({
  post: { id, body, createdAt, username, likeCount, commentCount, likes },
}) {
  const { user } = useContext(AuthContext);

  return (
    <Card fluid>
      <Card.Content>
        <Image
          floated="right"
          size="mini"
          src="https://react.semantic-ui.com/images/avatar/large/elliot.jpg"
        />
        <Card.Header>{username}</Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`}>
          {moment(createdAt).fromNow(true)}
        </Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        {/* <Button as="div" labelPosition="right" onClick={likePost}>
          <Button color="teal" basic>
            <Icon name="heart" />
            Like
          </Button>
          <Label basic color="teal" pointing="left">
            {likeCount}
          </Label>
        </Button> */}

        <LikeButton user={user} post={{ id, likes, likeCount }} />

        <MyPopup content="Comment on post">
          <Button as={Link} to={`/posts/${id}`} labelPosition="right">
            <Button color="blue" basic>
              <Icon name="comments" />
              Comment
            </Button>
            <Label basic color="blue" pointing="left">
              {commentCount}
            </Label>
          </Button>
        </MyPopup>

        {user && user.username === username && <DeleteButton postId={id} />}
      </Card.Content>
    </Card>
  );
}

export default PostCard;
