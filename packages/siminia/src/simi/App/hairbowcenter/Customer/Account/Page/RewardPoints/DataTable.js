import React, { useState } from 'react';
import PaginationTable from './../../Components/Orders/PaginationTable';
import Identify from 'src/simi/Helper/Identify';

const DataTable = (props) => {

    const { data } = props;
    const [limit, setLimit] = useState(10);
    const currentPage = 1;

    const cols = [
        { title: Identify.__("ID") },
        { title: Identify.__("Comment") },
        { title: Identify.__("Points") },
        { title: Identify.__("Created") },
        { title: Identify.__("Status Description") },
    ];

    function timeToWords(time, lang) {
        lang = lang || {
            postfixes: {
                '<': ' ago',
                '>': ''
            },
            1000: {
                singular: 'a few moments',
                plural: 'a few moments'
            },
            60000: {
                singular: 'about a minute',
                plural: '# minutes'
            },
            3600000: {
                singular: 'about an hour',
                plural: '# hours'
            },
            86400000: {
                singular: 'a day',
                plural: '# days'
            },
            31540000000: {
                singular: 'a year',
                plural: '# years'
            }
        };

        var timespans = [1000, 60000, 3600000, 86400000, 31540000000];
        var parsedTime = Date.parse(time.replace(/\-00:?00$/, ''));

        if (parsedTime && Date.now) {
            var timeAgo = parsedTime - Date.now();
            var diff = Math.abs(timeAgo);
            var postfix = lang.postfixes[(timeAgo < 0) ? '<' : '>'];
            var timespan = timespans[0];

            for (var i = 1; i < timespans.length; i++) {
                if (diff > timespans[i]) {
                    timespan = timespans[i];
                }
            }

            var n = Math.round(diff / timespan);

            return lang[timespan][n > 1 ? 'plural' : 'singular']
                .replace('#', n) + postfix;
        }
    }

    const renderItem = (item, index) => {
        let date = item.created_at ? timeToWords(item.created_at, null) : '';

        return (
            <tr key={index}>
                <td data-title={Identify.__("ID")}>
                    {Identify.__(item.transaction_id)}
                </td>
                <td data-title={Identify.__("Comment")}>
                    {item.comment}
                </td>
                <td data-title={Identify.__("Points")}>
                    <span className={`${item.amount ? (Number(item.amount) > 0 ? 'green' : 'red') : ''}`}>{Number(item.amount) > 0 ? '+' + item.amount : item.amount}</span>
                </td>
                <td data-title={Identify.__("Created")}>
                    {date}
                </td>
                <td data-title={Identify.__("Status Description")}>
                    {item.expires_at ? Identify.__("Will expire in ") + timeToWords(item.expires_at, null) : ''}
                </td>
            </tr>
        )
    }

    return <div className="table-wrapper orders-recent">
        {!data || !data.hasOwnProperty('rewards') || data.rewards.length === 0
            ? (
                <div className="text-center">
                    {Identify.__("You have no transaction")}
                </div>
            ) : (
                <PaginationTable
                    renderItem={renderItem}
                    data={data.rewards}
                    cols={cols}
                    showPageNumber={false}
                    limit={typeof (limit) === 'string' ? parseInt(limit) : limit}
                    setLimit={setLimit}
                    currentPage={currentPage}

                />
            )
        }
    </div>
}

export default DataTable;
