import React from 'react';

const PollingResults = props => (
    <div>
    {props.pollingResults.map(result => {
        return (
            <div key={result.id} className="poll-result row no-gutters">
                <div className="poll-result-item col-4">{result.answer}</div>
                <div className="poll-result-item col-6">
                    <div className="progress">
                        <div className="progress-bar progress-bar-striped bg-danger" style={{width: result.persentase + "%"}} />
                    </div>
                </div>
                <div className="poll-result-item col-2 text-right">
                    <strong>{parseInt(result.persentase)}%</strong>
                </div>
            </div>
        );
    })}
    </div>
);

export default PollingResults;