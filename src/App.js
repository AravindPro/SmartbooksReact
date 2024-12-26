import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

let URL = "https://smartbooks-sfgp.onrender.com";

// let URL = "http://127.0.0.1:8000";
let chapno = 1;
let index = 0;
let nxtchapno = null;
let nxtind = null;
// let bookname = "prideandprejudice.json";
let first=true; //Used to run useEffect only once
// let compressionratio = 4;
function App() {
    let [text, setText] = useState(`# Markdown Test

## Introduction

Welcome to this **random** Markdown test! Below you'll find various sections demonstrating Markdown formatting.

### Bullet List

- Item 1
- Item 2
- Item 3
  - Subitem 1
  - Subitem 2
- Item 4

### Numbered List

1. First item
2. Second item
3. Third item`);
    
    let [booklist, setBooklist] = useState([]);
    let [bookname, setBookname] = useState('');
    let [compressionratio, setCompressionratio] = useState(1.5);
    let [wordlimit, setWordLimit] = useState(700);

    const getpiece = ()=>{
      // console.log("Here");
      console.log(`${wordlimit}`);
      axios.post(`${URL}/nextpiece`, null, {params: { bookname: bookname, chapno: chapno, index: index, WORDLIMIT: wordlimit }})
        // &bookname=${bookname}&chapno=${chapno}&index=${index}&styletokens=${styletokens}`)
        .then((res)=>res.data)
        .then((data)=>{
          if(!('error' in data)){
            text = data['text'];
            console.log(text)
            text = text.replace(/\.\/images\/([^\/]+)\/([^ ]+\.[a-z]{3,4})/g, `${URL}/images/$1/$2`)
            setText(text);
            nxtchapno = data['chap'];
            nxtind = data['ind'];
          }
        })
        .catch((e)=>console.log(e));
    }
    const refresh = ()=>{
      console.log(`${chapno} ${index}`);
      axios.post(`${URL}/nextpiecegpt`, null, {params: { bookname: bookname, chapno: chapno, index: index, WORDLIMIT: wordlimit, COMPRESSIONRATIO: compressionratio, styletokens: "simple language and in the language of coldfusion youtuber" }})
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

    const prevPiece = ()=>{
      axios.post(`${URL}/prevpiece`, null, {params: { bookname: bookname, chapno: chapno, index: index, WORDLIMIT: wordlimit }})
        // &bookname=${bookname}&chapno=${chapno}&index=${index}&styletokens=${styletokens}`)
        .then((res)=>res.data)
        .then((data)=>{
          if(!('error' in data)){
            text = data['text'];
            console.log(text)
            text = text.replace(/\.\/images\/([^\/]+)\/([^ ]+\.[a-z]{3,4})/g, `${URL}/images/$1/$2`)
            setText(text);
            nxtchapno = chapno;
            nxtind = index;
            chapno = data['chap'];
            index = data['ind'];
            console.log(`${nxtchapno} ${nxtind} ${chapno} ${index}`);
          }
        })
        .catch((e)=>console.log(e));
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
        <input type="text" name="wordlimit" id="" value={wordlimit} onChange={(e)=>setWordLimit(e.target.value)}/>
        <select name="selection" className="selection" value={bookname} onChange={(i)=>{ console.log("Changed!");  chapno=0; index=0; setBookname(i.target.value);}}>
          {booklist.map((i) => <option value={i}>{i}</option>)};
        </select>
      </div>
      <div className="main">
        <div className="buttonsTray">
          <span className="buttons prevPage" onClick={prevPiece}>
            <svg viewBox="0 0 78 78" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M78 62C78 70.8366 70.8366 78 62 78H16C7.16344 78 0 70.8366 0 62V16C0 7.16344 7.16344 0 16 0H62C70.8366 0 78 7.16344 78 16V62Z" fill="#949494"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M36.0762 59.5096C36.3061 59.2402 36.494 56.2654 36.494 52.8998V46.7808L50.7471 46.5828L65.0001 46.3849V39.3931V32.4013L50.7715 32.2033L36.5423 32.006L36.3618 25.6391C36.2541 21.8613 35.902 19.1639 35.4948 19.0057C34.5418 18.6355 13.0001 38.1588 13.0001 39.3931C13.0001 40.3226 34.2067 60.0005 35.2078 60.0005C35.4559 60.0005 35.8469 59.7797 36.0762 59.5096Z" fill="white"/>
            </svg>
          </span>
        </div>
        <div className="MainBook">
          <div className="text">
            <ReactMarkdown>{text}</ReactMarkdown>
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
