import React, {useState, useCallback} from 'react';
import { Card, Button, Avatar, Popover, List, Comment } from 'antd';
import PropTypes from 'prop-types';
import { RetweetOutlined, HeartTwoTone, HeartOutlined, MessageOutlined, EllipsisOutlined } from '@ant-design/icons';
import {useDispatch, useSelector} from 'react-redux';
import Link from 'next/link';
import moment from 'moment';
moment.locale('ko');

import CommentForm from './CommentForm';
import PostCardContent from './PostCardContent';
import PostImages from './PostImages';
import {
    LIKE_POST_REQUEST,
    REMOVE_COMMENT_REQUEST,
    REMOVE_POST_REQUEST,
    RETWEET_REQUEST,
    UNLIKE_POST_REQUEST
} from '../reducers/post';
import FollowButton from "./FollowButton";

const PostCard = ({ post }) => {
    const dispatch = useDispatch();
    const [commentFormOpened, setCommentFormOpened] = useState(false);
    const { removePostLoading } = useSelector((state) => state.post);
    const id = useSelector((state) => state.user.me?.id);


    const onLike = useCallback(() => {
        if (!id) {
            return alert('로그인이 필요합니다.');
        }
        return dispatch({
            type: LIKE_POST_REQUEST,
            data: post.id,
        });
    }, [id]);
    const onUnlike = useCallback(() => {
        if (!id) {
            return alert('로그인이 필요합니다.');
        }
        return dispatch({
            type: UNLIKE_POST_REQUEST,
            data: post.id,
        });
    }, [id]);

    const onToggleComment = useCallback(() => {
        setCommentFormOpened((prev) => !prev);
    }, []);


    const onRemovePost = useCallback(() => {
        if (!id) {
            return alert('로그인이 필요합니다.');
        }
        dispatch({
            type: REMOVE_POST_REQUEST,
            data: post.id,
        });
    }, []);


    const onRemoveComment = (id) => () => {
        dispatch({
            type: REMOVE_COMMENT_REQUEST,
            data: id,
        });
    }

    const onRetweet = useCallback(() => {
        if (!id) {
            return alert('로그인이 필요합니다.');
        }
        return dispatch({
            type: RETWEET_REQUEST,
            data: post.id,
        });
    }, [id]);

    const liked = post.Likers.find((v) => v.id === id);
  return (
    <div  style={{ border:50, marginBottom: 20, padding: "7px", background: "#e0e4e4"}}>
      <Card
        cover={post.Images[0] && <PostImages images={post.Images} />}
        actions={[
            <RetweetOutlined key="retweet" onClick={onRetweet} />,
          liked
            ? <HeartTwoTone twoToneColor="#eb2f96" key="heart" onClick={onUnlike} />
            : <HeartOutlined key="heart" onClick={onLike} />,
          <MessageOutlined key="comment" onClick={onToggleComment} />,
              <Button.Group>
                {id && post.User.id === id
                  ? (
                    <>
                      <Button type="danger" loading={removePostLoading} onClick={onRemovePost}>삭제</Button>
                    </>
                  )
                  : null}
              </Button.Group>,
        ]}
        title={post.RetweetId ? `${post.User.nickname}님이 리트윗하셨습니다.` : null}
        extra={id && <FollowButton post={post} />}
      >
          {post.RetweetId && post.Retweet
              ? (
                  <Card
                      cover={post.Retweet.Images[0] && <PostImages images={post.Retweet.Images} />}
                  >
                      <span style={{ float: 'right' }}>{moment(post.createdAt).format('YYYY.MM.DD.')}</span>
                      <Card.Meta
                          avatar={(
                              <Link href={`/user/${post.Retweet.User.id}`}>
                                  <a><Avatar>{post.Retweet.User.nickname[0]}</Avatar></a>
                              </Link>)}
                          title={post.Retweet.User.nickname}
                          description={<PostCardContent postData={post.Retweet.content} />}
                      />
                  </Card>
              )
              : (
                  <>
                      <span style={{ float: 'right' }}>{moment(post.createdAt).format('YYYY.MM.DD.')}</span>
                      <Card.Meta
                          avatar={(
                              <Link href={`/user/${post.User.id}`}>
                                  <a><Avatar>{post.User.nickname[0]}</Avatar></a>
                              </Link>)}
                          title={post.User.nickname}
                          description={<PostCardContent postData={post.content} />}
                      />
                  </>
              )}
        </Card>
      {commentFormOpened && (
        <div>
          <CommentForm post={post} />
          <List
            header={`${post.Comments.length} 댓글`}
            itemLayout="horizontal"
            dataSource={post.Comments}
            renderItem={(item) => (
                <li style={{position:"relative"}}>
                    <Comment
                        author={item.User.nickname}
                        avatar={(
                            <Link href={`/user/${item.User.id}`}>
                                <a><Avatar>{item.User.nickname[0]}</Avatar></a>
                            </Link>
                        )}
                        content={item.content}
                    >
                    {item.User.id === id
                    ? (<Button style={{position:"absolute", top:"50%", right:"30px", transform:"translateY(-50%)"}}
                               onClick={onRemoveComment(item.id)}>삭제</Button>
                        ) : null
                    }
                    </Comment>
                </li>
            )}
          />
        </div>
      )}
    </div>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number,
    User: PropTypes.object,
    content: PropTypes.string,
    createdAt: PropTypes.string,
    Comments: PropTypes.arrayOf(PropTypes.object),
    Images: PropTypes.arrayOf(PropTypes.object),
    Likers: PropTypes.arrayOf(PropTypes.object),
    RetweetId: PropTypes.number,
    Retweet: PropTypes.objectOf(PropTypes.any),
  }).isRequired,
};

export default PostCard;
