import '../App.css';
import { useState, useEffect } from 'react';
import * as Operations from '../Operations/Operations';
import * as ApiOperations from '../Operations/ApiOperations';
import Cookies from 'universal-cookie';
import Loading from './Loading';

function NoticeBoard(props) {

    const [notices, setNotices] = useState([]);
    const [CreatingNoticeBool, setCreatingNoticeBool] = useState(false);
    const [validationMessage, setValidationMessage] = useState(null);
    const [loading, setLoading] = useState(true);

    const displayAsPage = props.displayAsPage; //If true, display as page, if false, display as component

    //UseEffect to get notices from database upon first render
    useEffect(() => {
        ApiOperations.GetNotices().then(notes => setNotices(notes));
        setLoading(false);
    }, []);

    //Function to handle form submission of new notice    
    function NewNotice(e){
        e.preventDefault();
        if(e.target.btnradio.value === "" || e.target.title.value === "" || e.target.noticeText.value === "") {
            setValidationMessage("Please enter all fields including what day to post notice!");
            return;
        }else {
            setValidationMessage(null);
        }
        const cookies = new Cookies();
        var currentToken = cookies.get('JWT_Token');
        let tokenClaims = Operations.GetJWTPayload(currentToken);
        var UsersName = tokenClaims["name"];
        var DateString;
        let month;
        let day;
        var date = new Date();
        switch(e.target.btnradio.value){
            case "today":
                month = date.getMonth() + 1;
                month = month < 10 ? '0' + month : month;
                day = date.getDate();
                day = day < 10 ? '0' + day : day;
                DateString = date.getFullYear() + '-' + month + '-' + day + 'T08:08:00';
                break;
            case "tommorow":
                date.setDate(date.getDate() + 1);
                month = date.getMonth() + 1;
                month = month < 10 ? '0' + month : month;
                day = date.getDate();
                day = day < 10 ? '0' + day : day;
                DateString = date.getFullYear() + '-' + month  + '-' + day  + 'T08:08:00';
                break;
            default:
                console.log("Something went wrong");
                
                break;
        }
        var notice = {
            "id": Operations.generateGuid(),
            "noticeCreatorName": UsersName,
            "title": e.target.title.value,
            "noticeText": e.target.noticeText.value,
            "noticeShowDate": DateString
        }
        console.log(notice);
        ApiOperations.Post(notice, 'Notices').then(res => {
            console.log(res);
            window.location.reload();
        });
    }

    return (
      <div className={displayAsPage ? "NoticeBoardMain" : "NoticeBoard"} >
        <div className="NoticesHeader">
            <h1>Notices</h1>
            <div>
                <h6 onClick={() => setCreatingNoticeBool(true)} className='TextLink'>Create a new Notice</h6>
                <h6>Date: {Operations.GetDateString()}</h6>
            </div>
        </div>
        {loading ? 
            <Loading />
            : 
        <div className={CreatingNoticeBool ? 'hidden' : displayAsPage ? 'NoticesMain overflow-auto' : 'Notices overflow-auto'}>
            {
                notices.map(note => {
                    return (
                        <div className='Note' key={note.id}>
                            <div>
                                <h2>{note.title}</h2>
                                <p>Posted By: {note.noticeCreatorName}</p>
                            </div>
                            <p>
                                {note.noticeText}
                            </p>
                        </div>
                    )
                })
            }
        </div>
        }
        <div className={CreatingNoticeBool ? displayAsPage ? "CreateNoticeMain" : "CreateNotice" : 'hidden'}>
            <h3>Create a new Notice</h3>
            <form onSubmit={(e) => NewNotice(e)}>
                <div className="input-group ">
                    <span className="input-group-text" id="inputGroup-sizing-default">Title</span>
                    <input type="text" name='title' className="form-control" />
                </div>
                <div className="input-group">
                    <span className="input-group-text">Notice</span>
                    <textarea className="form-control" name='noticeText' aria-label="With textarea"></textarea>
                </div>
                <div className="btn-group" readOnly role="group" aria-label="Basic radio toggle button group">
                    <input type="radio" className="btn-check" value="today"  name="btnradio" id="btnradio1" autoComplete="off"  />
                    <label className="btn btn-outline-primary" htmlFor="btnradio1">Display Today</label>

                    <input type="radio" className="btn-check" value="tommorow" name="btnradio" id="btnradio2" autoComplete="off" />
                    <label className="btn btn-outline-primary" htmlFor="btnradio2">Display Tommorow</label>
                </div>
                <p className='ValidationMessage'>{validationMessage}</p>
                <div className='flexColum'>
                    <button className="btn btn-success " type='submit'>Create Notice</button>
                    <div onClick={() => setCreatingNoticeBool(false)} className="btn btn-danger backButton" >Back</div>
                </div>
            </form>
        </div>
      </div>
    );
  }
  
  export default NoticeBoard;
  