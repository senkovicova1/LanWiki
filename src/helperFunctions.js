import React from 'react';

export const toSelArr = (arr,index = 'title')=> arr.map((item)=>{return {...item,value:item.id,label:item[index]}})
export const isEmail = (email) => (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(email)
export const snapshotToArray = (snapshot) => {
  if(snapshot.empty){
    return [];
  }
  return snapshot.docs.map((item)=>{
    return {id:item.id,...item.data()};
    })
  }
export const hightlightText = (message,text, color)=>{
  let index = message.toLowerCase().indexOf(text.toLowerCase());
  if (index===-1){
    return (<span>{message}</span>);
  }
  return (<span>{message.substring(0,index)}<span style={{color}}>{message.substring(index,index+text.length)}</span>{message.substring(index+text.length,message.length)}</span>);
}
