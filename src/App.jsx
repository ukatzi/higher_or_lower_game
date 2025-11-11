import { useState, useEffect, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import './App.css'
import TopPlate from './topPlate/TopPlate'
function App() {
  let [count, setCount] = useState(0);
  let [maxCount, setMaxCount] = useState(0);
  let [ch1, setCh1] = useState(0);
  let [ch2, setCh2] = useState(0);
  let [cur, setCur] = useState(0);
  let [c2Data, setC2Data] = useState(0);
  let [isAnimationProceed, setIsAnimationProceed] = useState(false);
  let refName1 = useRef(null), refCount1 = useRef(null), refSrc1 = useRef(null), refOnClick1 = useRef(null);
  let refName2 = useRef(null), refCount2 = useRef(null), refSrc2 = useRef(null), refOnClick2 = useRef(null);
  let c2 = 0;
  useEffect(() => {
    if(isAnimationProceed){
      let num = 0;
      let myVar = setInterval(numIncreasing, 50);
      setTimeout(stopAnimation, 1000);
      function numIncreasing(){
        num++;
        refCount2.current.innerHTML = Math.floor(c2Data * num / 20);
      }
      function stopAnimation(){
        clearInterval(myVar)
        setTimeout(Update, 500);
        function Update(){
          setIsAnimationProceed(false);
          setCur(cur + 1);
        }
      }
    }
  });
  

  useEffect(() => {
    let first_tag = Math.floor(Math.random() * 20);
    let second_tag = Math.floor(Math.random() * 20);

    let name_tags = fetch("https://api.rule34.gg/getTags?raw=true&limit=1000&type=is_character")
      .then(data => data.json());

    let tag_promise1 = name_tags.then(data => data["tags"][first_tag]["tag_name"]);
    let tag_promise2 = name_tags.then(data => data["tags"][second_tag]["tag_name"])

    tag_promise1.then(data => {refName1.current.innerHTML = data;});
    tag_promise2.then(data => {refName2.current.innerHTML = data;});

    tag_promise1.then(data => {return fetch("https://api.rule34.gg/getRandomPosts?amount=1&tags=solo&tags=sfw&tags=" + data)})
      .then(data => data.json())
      .then(data => {refSrc1.current.src = data["posts"][0]["preview"]["file"]});
    tag_promise2.then(data => {return fetch("https://api.rule34.gg/getRandomPosts?amount=1&tags=solo&tags=sfw&tags=" + data)})
      .then(data => data.json())
      .then(data => {refSrc2.current.src = data["posts"][0]["preview"]["file"]});

      let count_promise1 = name_tags.then(data => data["tags"][first_tag]["count"]);
      let count_promise2 = name_tags.then(data => data["tags"][second_tag]["count"]);
      count_promise1.then(data => {refCount1.current.innerHTML = data});
      count_promise2.then(data => {
        refCount2.current.innerHTML = "???";
        c2 = data;
        //alert(data);
      }); 

      count_promise1.then(count1 => {
        count_promise2.then(count2 => {
          if(count1 > count2){
            refOnClick1.current.onclick = onCorrect;
            refOnClick2.current.onclick = onIncorrect;
          }
          else if(count1 == count2){
            refOnClick1.current.onclick = onCorrect;
            refOnClick2.current.onclick = onCorrect;
          }
          else{
            refOnClick1.current.onclick = onIncorrect;
            refOnClick2.current.onclick = onCorrect;
          }
        })
      });
  }, [cur]);
  function onCorrect(){
    if(isAnimationProceed){
      return;
    }
    setIsAnimationProceed(true);
    setC2Data(c2);
    setCount(count + 1); 
    setMaxCount(Math.max(maxCount, count + 1));
  }
  function onIncorrect(){
    if(isAnimationProceed){
      return;
    }
    setIsAnimationProceed(true);
    setC2Data(c2);
    setCount(0);
  }
  return (
    <>
      <div>
        Current round: {cur} 
      </div>
      <div>
        Streak: {count}
      </div>
      <div>
        Record: {maxCount}
      </div>
      <div>
        <Option refName = {refName1} refCount = {refCount1} refSrc = {refSrc1} refOnClick = {refOnClick1} character = {ch1}></Option>
        <Option refName = {refName2} refCount = {refCount2} refSrc = {refSrc2} refOnClick = {refOnClick2} character = {ch2}></Option> 
      </div>
    </>
  )
}

function Option({refName, refCount, refSrc, refOnClick, character}) {
  return (
  <button ref={refOnClick}>
    <img ref={refSrc}></img>
    
    <div ref={refName}>

    </div>
    <div ref={refCount}>

    </div>
  </button>
  )
}

export default App
