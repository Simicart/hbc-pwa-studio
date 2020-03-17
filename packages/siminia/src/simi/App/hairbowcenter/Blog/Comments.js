import React, { Fragment } from 'react';
import Identify from 'src/simi/Helper/Identify';
import { showFogLoading, hideFogLoading } from 'src/simi/BaseComponents/Loading/GlobalLoading';
import { submitComment } from 'src/simi/app/hairbowcenter/Model/Blogcomments';
import { showToastMessage } from 'src/simi/Helper/Message';
import amBlogComments from 'src/simi/App/hairbowcenter/queries/blog/amBlogComments';
import { Simiquery } from 'src/simi/Network/Query';
import Loading from 'src/simi/BaseComponents/Loading';
import { getFormattedDate } from './../Helper';
import ReactHTMLParser from 'react-html-parser';
import { connect } from 'src/drivers';
import CommentForm from './CommentForm';

const $ = window.$;

const Comments = (props) => {
    const { post_id, isSignedIn } = props;

    const handleSubmitProp = (dtValid) => {
        if (dtValid.isAllow) {
            showFogLoading();
            const params = { post_id, ...dtValid.data };
            submitComment(proceedData, params)
        }
    }

    function proceedData(data) {
        hideFogLoading();
        if (data.message) {
            showToastMessage(data.message);
        }
    }

    const onClickReply = (e) => {
        const target = $(e.target);
        target.closest('.amblog-comment').find('.amblog-replies').show();
    }

    const renderCommentLists = (cmtList) => {
        let html = null;
        if (cmtList && cmtList.items && cmtList.items.length) {
            html = cmtList.items.map((cmtItem, idx) => {
                return <div className="amblog-comment" key={idx} id={`am-blog-comment-${cmtItem.comment_id}`}>
                    <div className="amblog-comment-content">
                        <div className="amblog-header">
                            <div className="amblog-author">
                                <svg xmlns="http://www.w3.org/2000/svg" >
                                    <path fillRule="evenodd" clipRule="evenodd" d="M12.5 0C19.079 0 25 5.921 25 12.5S19.079 25 12.5 25 0 19.079 0 12.5 5.921 0 12.5 0zm0 6.579c1.974 0 3.947 1.974 3.947 3.947 0 2.632-1.973 4.606-3.947 4.606s-3.947-1.974-3.947-4.606c0-1.973 1.973-3.947 3.947-3.947zM3.947 19.737c4.606 5.263 12.5 5.263 17.106 0-4.606-5.263-12.5-5.263-17.106 0z" />
                                </svg>
                                {cmtItem.name}
                            </div>
                            <div className="amblog-date">
                                {getFormattedDate(cmtItem.created_at)}
                            </div>
                            <div className="amblog-thesis">
                                {ReactHTMLParser(cmtItem.message)}
                            </div>
                            {(!isSignedIn || (isSignedIn && props.email !== cmtItem.email)) && <div className="amblog-reply">
                                <span className="reply" onClick={(e) => onClickReply(e)}>{Identify.__("Reply")}</span>
                            </div>}
                        </div>
                    </div>
                    <div className="amblog-replies">
                        <CommentForm handleSubmitProp={handleSubmitProp} type="reply" id={cmtItem.comment_id} email={props.email} fullName={(props.firstname && props.lastname) ? props.firstname + ' ' + props.lastname : ''} />
                    </div>
                </div>
            })
        }
        return html;
    }

    const variables = {
        postId: post_id,
        type: "list"
    }

    return <div className="amblog-comments-wrapper">
        <div className="amblog-title">{Identify.__("Comments")}</div>
        <Simiquery query={amBlogComments} variables={variables} fetchPolicy="no-cache" >
            {({ loading, error, data }) => {
                if (error) return <div>{Identify.__('Data Fetch Error')}</div>;

                let commentData = null;
                if (data && data.amBlogComments) {
                    commentData = data.amBlogComments;
                }
                if (commentData) {
                    return <div className="amblog-comments-container">{renderCommentLists(commentData)}</div>
                }
                if (loading)
                    return <Loading />
            }}
        </Simiquery>
        <CommentForm handleSubmitProp={handleSubmitProp} type="comment" id={post_id} email={props.email} fullName={(props.firstname && props.lastname) ? props.firstname + ' ' + props.lastname : ''} />
    </div>
}

const mapStateToProps = ({ user }) => {
    const { currentUser, isSignedIn, forgotPassword } = user;
    const { firstname, email, lastname } = currentUser;

    return {
        email,
        firstname,
        forgotPassword,
        isSignedIn,
        lastname,
    };
};

export default connect(mapStateToProps, null)(Comments);
