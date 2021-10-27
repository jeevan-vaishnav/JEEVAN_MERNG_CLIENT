import React, { useContext } from "react";
import { useQuery } from "@apollo/react-hooks";
import { AuthContext } from "../context/auth";
import { Grid, Transition } from "semantic-ui-react";
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import { FETCH_POSTS_QUERY } from "../util/graphQL";
import "../App.css";

function Home() {
  const { user } = useContext(AuthContext);

  const { loading, data = {} } = useQuery(FETCH_POSTS_QUERY);
  const posts = data.getPosts;

  return (
    <Grid columns={2} divided>
      <Grid.Row className="page-title">
        <h1>Recent Posts</h1>
      </Grid.Row>
      <Grid.Row>
        {user && (
          <Grid.Column>
            <PostForm />
          </Grid.Column>
        )}

        {loading ? (
          <h1>Loading posts..</h1>
        ) : (
          <Transition.Group>
            {posts &&
              posts.map((post) => (
                <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
                  <PostCard post={post} />
                </Grid.Column>
              ))}
          </Transition.Group>
        )}
      </Grid.Row>
    </Grid>
  );
}

export default Home;
