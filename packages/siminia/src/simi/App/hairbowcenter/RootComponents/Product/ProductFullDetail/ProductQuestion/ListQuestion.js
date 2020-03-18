import React, { useState } from 'react';
import {getQuestions} from 'src/simi/Model/Product';
import Loading from 'src/simi/BaseComponents/Loading';
import Identify from 'src/simi/Helper/Identify';
import Pagination from 'src/simi/App/hairbowcenter/BaseComponents/Pagination';
const $ = window.$;
require('./productQuestion.scss')
require('./listQuestion.scss')

const ListQuestion = props => {
    const { productId } = props; 
    const [data, setData] = useState(null);
    const [limit, setLimit] = useState(10);

    const questionCallBack = (data) => {
        if(data.question) {
            setData(data.question)
        }
    }

    const handleHideAnswers = (e, id) => {
        $(`#answer-${id}`).slideToggle()
    }

    const handleChangeLimit = (e) => {
        const value = e.target.value;
        setLimit(value);
    }

    const formatDate = (currentDate, format = ('Y-m-d')) => {
        const arr = currentDate.split(/[- :]/);
        const date = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);
        let m = date.getMonth() + 1;
        m = m < 10 ? "0" + m : m;
        let d = date.getDate();
        d = d < 10 ? '0' + d : d
        const y = date.getFullYear()
        return format.replace('d',d).replace('m',m).replace('Y',y);
    }

    const renderAnswers = (answers) => {
        return answers.map((answer, index) => (
            <li className="item askit-item askit-item-answer" key={index}>
                <h3 className="askit-item-author">{answer.customer_name}</h3>
                <h4 className="askit-item-timestamp">{formatDate(answer.created_time)}</h4>
                <p className="askit-item-body">{answer.text}</p>
            </li>
        ))
    }

    const renderQuestions = (question, index) => {
        return (
            <li className="item askit-item askit-item--commenting" key={index}>
                <div className="askit-item-author" style={{ textAlign: 'right'}}>
                    <b>posted by <span style={{textTransform: 'uppercase'}}>{question.customer_name}</span> on {formatDate(question.created_time)}</b>
                </div>
                <p className="askit-item-body">{question.text}</p>
                <div className="askit-item-actions">
                    <div className="askit-item-trigger" onClick={(e) => handleHideAnswers(e, question.id)}>
                        {question.answers && question.answers.length > 0 ? question.answers.length + ' answer' : null}
                    </div>
                    <ol id={`answer-${question.id}`} className="items askit-item-answers" style={{display: 'none'}}>
                        {question.answers && renderAnswers(question.answers)}
                    </ol>
                </div>
            </li>
        )
    }

    useState(() => {
        getQuestions(questionCallBack, productId)
    }, [])

    if(!data) return <Loading />

    if(data.items.length === 0) return null

    return (
        <div className="block">
            <div className="title block-title">
                <strong>{Identify.__('Questions')}</strong>
            </div>
            <div className="block-content">
                <div className="toolbar askit-toolbar">
                    <div className="pager">
                        <div className="limiter">
                            <strong className="limiter-label">{Identify.__('Show')}</strong>
                            <select name="limiter-options" id="limiter" onChange={handleChangeLimit}>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>
                        </div>
                        <div className="clearfix"></div>
                    </div>
                </div>
                
                <ol className="items askit-items no-avatar">
                    <Pagination 
                        renderItem={renderQuestions} 
                        data={data.items} 
                        showPageNumber={false} 
                        showInfoItem={false} 
                        showPerPageOptions={false} 
                        limit={limit} 
                    />
                </ol>
            </div>
        </div>
    );
    
}

export default ListQuestion;