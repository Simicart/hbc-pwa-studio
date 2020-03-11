import React from 'react';
import amBlogPost from 'src/simi/App/hairbowcenter/queries/blog/amBlogPost';
import { Simiquery } from 'src/simi/Network/Query';
import Loading from 'src/simi/BaseComponents/Loading';
import ReactHTMLParser from 'react-html-parser';

const Post = (props) => {
    const { post_id } = props;

    if (!post_id) return null;

    const variables = { id: post_id }

    return <div className="blog-detail">
        <Simiquery query={amBlogPost} variables={variables} fetchPolicy="no-cache" >
            {({ loading, error, data }) => {
                if (error) return <div>{Identify.__('Data Fetch Error')}</div>;

                let blogData = null;
                if (data && data.amBlogPost) {
                    blogData = data.amBlogPost;
                }
                if (blogData) {
                    // return renderBlogData(blogData)
                    console.log(blogData);
                    return <div className="blog-post-content">
                        <header className="entry-header">
                            <h1 className="entry-title">{blogData.title}</h1>
                        </header>
                        <div className="entry-content">
                            {ReactHTMLParser(blogData.full_content)}
                        </div>
                    </div>
                }
                if (loading)
                    return <Loading />
            }}
        </Simiquery >
    </div>
}

export default Post;
