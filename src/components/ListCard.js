import React from 'react';
import { Link } from 'react-router-dom';

const ListCard = (props) => {
    const { userName, userId, postCount } = props;

    const setUserID = (userId) => {
        localStorage.setItem('userId', userId)
    }
    return (
        <>
            <Link to={`/profile/${userName.replaceAll(' ', '')}`} onClick={() => { setUserID(userId) }}>
                <div className="card border-3 pointer pointer my-2">
                    <div className="card-body">
                        <div className="info-wrapper align-items-center d-flex info-wrapper justify-content-between px-2">
                            <h2 className="fs-5">{userName ? userName : '-'}</h2>
                            <h3 className="fs-5">
                                Posts : {postCount ? postCount : '-'}
                            </h3>
                        </div>
                    </div>
                </div>
            </Link>
        </>
    );
};

export default ListCard;