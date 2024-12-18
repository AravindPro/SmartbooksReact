import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

// let URL = "https://smartbooks-sfgp.onrender.com";

let URL = "http://127.0.0.1:8000";
let chapno = 0;
let index = 0;
let nxtchapno = null;
let nxtind = null;
// let bookname = "prideandprejudice.json";
let first=true; //Used to run useEffect only once
// let compressionratio = 4;
function App() {
    let [text, setText] = useState(`Lorem ipsum dolor sit amet. Et quia commodi id necessitatibus sint aut libero eligendi et quis expedita sed iure
              delectus. At quaerat quia ut porro dolores aut rerum quidem sed repudiandae debitis in autem deserunt ad unde debitis.
              Non harum accusamus qui voluptatibus reprehenderit a explicabo quia. Qui magni quod ut autem praesentium est illo
              impedit sed dolor deleniti hic reprehenderit consequatur. Nam iure aspernatur et saepe pariatur eum molestiae quia non
              consequuntur nisi sed voluptatum cumque!
    
              Non veritatis voluptatem est tempora omnis sit voluptatem fuga ea natus quae et aliquid internos et odio velit. Ea
              maxime accusamus At magnam facere et minus soluta et harum accusamus hic vitae ipsam. Vel modi veritatis aut dolorem
              accusamus cum voluptatum quos eum culpa galisum qui quaerat sint a molestiae quos.v`);
    
    let [booklist, setBooklist] = useState([]);
    let [bookname, setBookname] = useState('');
    let [compressionratio, setCompressionratio] = useState(1.5);

    const getpiece = ()=>{
      // console.log("Here");
      console.log(`${chapno} ${index}`);
      axios.post(`${URL}/nextpiece`, null, {params: { bookname: bookname, chapno: chapno, index: index, WORDLIMIT: 150 }})
        // &bookname=${bookname}&chapno=${chapno}&index=${index}&styletokens=${styletokens}`)
        .then((res)=>res.data)
        .then((data)=>{
          if(!('error' in data)){
            setText(data['text']);
            nxtchapno = data['chap'];
            nxtind = data['ind'];
          }
        })
        .catch((e)=>console.log(e));
    }
    const refresh = ()=>{
      axios.post(`${URL}/nextpiecegpt`, null, {params: { bookname: bookname, chapno: chapno, index: index, WORDLIMIT: 150, COMPRESSIONRATIO: compressionratio }})
        // &bookname=${bookname}&chapno=${chapno}&index=${index}&styletokens=${styletokens}`)
        .then((res)=>res.data)
        .then((data)=>{
          if(!('error' in data)){
            setText(data['text']);
            nxtchapno = data['chap'];
            nxtind = data['ind'];
          }
        })
        .catch((e)=>console.log(e));
    }
    const nextPiece = ()=>{
      index = nxtind;
      chapno = nxtchapno;
      return getpiece();
    }
  // Load the first piece of text
  useEffect(()=>{
    getpiece(); first = false;
    
    // TODO Verify 
    axios.get(`${URL}/listbooks`, null)
      .then(res => res.data)
      .then((data)=>{
        console.log(data);
        setBooklist(data.books);
      })
      .catch(e => console.log(e));

  }, [first]);

  useEffect(() => {
    getpiece();
  }, [bookname]);

  return (
    <div className="App">
      <div className="selectionDiv">
        <input type="text" name="compression" id="" value={compressionratio} onChange={(e)=>setCompressionratio(e.target.value)}/>
        <select name="selection" className="selection" value={bookname} onChange={(i)=>{ console.log("Changed!");  chapno=0; index=0; setBookname(i.target.value);}}>
          {booklist.map((i) => <option value={i}>{i}</option>)};
        </select>
      </div>
      <div className="main">
        <div className="MainBook">
          <div className="text">
            {text.split('\n').map((i)=><p>{i.trim()}</p>)}
          </div>
        </div>
        <div className="buttonsTray">
          <span className="buttons retry" onClick={refresh}>
            <svg fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="59.5306" height="59.5306" rx="16" fill="#949494" />
              <path
                d="M29.9795 49.6806C30.093 49.6822 30.2056 49.6612 30.311 49.6189C30.4163 49.5766 30.5122 49.5137 30.593 49.434C30.6738 49.3543 30.738 49.2594 30.7818 49.1546C30.8256 49.0499 30.8482 48.9375 30.8482 48.824C30.8482 48.7105 30.8256 48.5981 30.7818 48.4934C30.738 48.3887 30.6738 48.2937 30.593 48.214C30.5122 48.1343 30.4163 48.0715 30.311 48.0292C30.2056 47.9868 30.093 47.9659 29.9795 47.9675C20.0352 47.9675 11.9918 39.924 11.9918 29.9798C11.9918 20.0356 20.0352 11.9921 29.9795 11.9921C39.9237 11.9921 47.9671 20.0356 47.9671 29.9798C47.9671 35.7125 45.2855 40.8025 41.1147 44.0962L41.1147 38.5453C41.1163 38.4318 41.0953 38.3192 41.053 38.2138C41.0107 38.1085 40.9478 38.0126 40.8681 37.9318C40.7884 37.851 40.6935 37.7868 40.5887 37.743C40.484 37.6992 40.3716 37.6766 40.2581 37.6766C40.1446 37.6766 40.0322 37.6992 39.9275 37.743C39.8228 37.7868 39.7278 37.851 39.6481 37.9318C39.5684 38.0126 39.5056 38.1085 39.4633 38.2138C39.4209 38.3192 39.4 38.4318 39.4016 38.5453L39.4016 45.7826L39.4016 47.1109L47.9671 47.1109C48.0806 47.1125 48.1933 47.0915 48.2987 47.0492C48.404 47.0069 48.4999 46.9441 48.5807 46.8644C48.6615 46.7847 48.7257 46.6897 48.7695 46.585C48.8133 46.4803 48.8359 46.3679 48.8359 46.2544C48.8359 46.1408 48.8133 46.0285 48.7695 45.9237C48.7257 45.819 48.6615 45.724 48.5807 45.6443C48.4999 45.5647 48.404 45.5018 48.2987 45.4595C48.1933 45.4172 48.0806 45.3962 47.9671 45.3978L42.2289 45.3978C46.7662 41.7876 49.6802 36.2222 49.6802 29.9798C49.6802 19.1097 40.8496 10.279 29.9795 10.279C19.1094 10.279 10.2787 19.1097 10.2787 29.9798C10.2787 40.8499 19.1094 49.6806 29.9795 49.6806Z"
                fill="white" />
            </svg>
          </span>
          <span className="buttons nextButton" onClick={nextPiece}>
            <svg viewBox="0 0 78 78" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M0 16C0 7.16344 7.16344 0 16 0H62C70.8366 0 78 7.16344 78 16V62C78 70.8366 70.8366 78 62 78H16C7.16344 78 0 70.8366 0 62V16Z"
							fill="#949494" />
						<path fillRule="evenodd" clipRule="evenodd"
							d="M41.9239 18.4909C41.694 18.7603 41.506 21.7351 41.506 25.1007V31.2197L27.253 31.4176L13 31.6156V38.6074V45.5992L27.2286 45.7972L41.4578 45.9945L41.6382 52.3614C41.746 56.1392 42.0981 58.8366 42.5053 58.9948C43.4582 59.365 65 39.8417 65 38.6074C65 37.6779 43.7934 18 42.7922 18C42.5441 18 42.1532 18.2208 41.9239 18.4909Z"
							fill="white" />
					</svg>
          </span>
        </div>
      </div>
    </div>
  );
}

export default App;
