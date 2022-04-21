import React, {useState, useEffect} from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';
import moment from 'moment';
import { AiFillDelete, AiFillHome, AiFillSetting, AiFillPhone  } from 'react-icons/ai';
import { IconContext } from "react-icons";
import { BiPhoneIncoming, BiPhoneOutgoing } from 'react-icons/bi';

import Header from './Header.jsx';

const App = () => {
  const [flag, setFlag] = useState(1)
  const [res, setRes] = useState();
  const getRes = () => {
    axios.get('https://aircall-job.herokuapp.com/activities')
    .then((response) => {
      console.log(response.data)
      setRes(response.data)
    })
  }
    
  const getFlag = () => {
    setFlag(flag + 1)
    console.log(flag)
  }
  useEffect(() => getRes(), [res]); // add res 
    
  const convertTime = (time) => {
    const date = new Date(time)
    .toLocaleTimeString('en-US',
      {timeZone:'UTC',hour12:true,hour:'numeric',minute:'numeric'}
    );
    return date
  }
  const getDate = (str) => {
    const date = new Date(str)
    return `${getMonthName(parseInt(date.getMonth()))},  ${date.getDate()} ${date.getFullYear()}`
  }
  const getMonthName = (monthNumber) => {
    const months = [ "January", "February", "March", "April", "May", "June", 
              "July", "August", "September", "October", "November", "December" ];
    return months[monthNumber];
  }

  const archiveAllCalls = () => {
    console.log('hello')
  }
  


  if (!res) return null
  return (
    <div className='container'>
      <Header/>
      
      <div className="container-view">
        <h3 className="head-activity">Call logs: </h3>
        <br />
        <div className="calls">
          {res.map((user) => (
            !user.is_archived && 
            <div className ="user" key={user.id}>
              <h3 className="date">{getDate(user.created_at)}</h3>
              <div className="user-details">
                <div className="call-details">
                  <div className="icon">
                    <IconContext.Provider
                        value={{ color: 'rgb(5, 161, 0)', size: '25px' }}
                      >
                      {user.direction == 'outbound' ? <BiPhoneOutgoing /> : <BiPhoneIncoming />}
                    </IconContext.Provider>
                    </ div>
                  <div className="name-details">
                    <h3 className="name" id="callDetails">{user.from}</h3>
                    <h3 id="callDetails">{user.direction == 'outbound' ? 'Outgoing' : 'Incoming'} at {convertTime(user.created_at)}</h3>
                  </div>
                </div>
                <button onClick={() => {
                    axios.post(`https://aircall-job.herokuapp.com/activities/${user.id}/`, {
                      is_archived: true
                    })
                    .then((response) => {
                      console.log(response.data)
                    }).catch((err) => {
                      console.log(err);
                    })
                  }
                } className="button">
                  <IconContext.Provider
                    value={{ color: '#E11515', size: '20px' }}
                  >
                    <AiFillDelete />
                  </IconContext.Provider>
                  </button>
              </div>
            </div>
          ))}
        </div>
      </div>
        <IconContext.Provider
          value={{ color: 'white', size: '25px' }}
        >
          <div class="navbar">
            <a href="#calls" id="bottom-icon"><AiFillPhone /></a>
            <a href="#home" id="bottom-icon"><AiFillHome /></a>
            <a href="#settings" id="bottom-icon"><AiFillSetting /></a>
          </div>
        </IconContext.Provider>
    </div>
  );
};

ReactDOM.render(<App/>, document.getElementById('app'));

export default App;
