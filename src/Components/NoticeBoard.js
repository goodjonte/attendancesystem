import '../App.css';
import { useState } from 'react';
import * as Operations from '../Operations/Operations';
import * as ApiOperations from '../Operations/ApiOperations';

function NoticeBoard() {

    const [notices, setNotices] = useState([]);

    ApiOperations.GetNotices().then(notes => setNotices(notes));
    

    return (
      <div className="NoticeBoard">
        <div className="NoticesHeader">
            <h1>Notices</h1>
            <h3>Date: {Operations.GetDateString()}</h3>
        </div>
        <div className='Notices'>
            {
                notices.map(note => {
                    return (
                        <div className='Note' key={note.id}>
                            <h2>{note.title}</h2>
                            <p>{note.noticeCreator}</p>
                            <p>
                                {note.noticeText}
                            </p>
                        </div>
                    )
                })
            }
        </div>
      </div>
    );
  }
  
  export default NoticeBoard;
  