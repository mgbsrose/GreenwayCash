'use client';
import {useRef,useState} from 'react';
import type {PointerEvent,ReactNode} from 'react';
export function LongPress({children,onTap,onHold,delay=600,className='',style,title}:{children:ReactNode;onTap?:()=>void;onHold:()=>void;delay?:number;className?:string;style?:React.CSSProperties;title?:string}){
 const timer=useRef<ReturnType<typeof setTimeout>|null>(null);const fired=useRef(false);const start=useRef<[number,number]>([0,0]);const [holding,setHolding]=useState(false);
 const cancel=()=>{if(timer.current)clearTimeout(timer.current);timer.current=null;setHolding(false)};
 const down=(e:PointerEvent<HTMLButtonElement>)=>{if(e.button!==0)return;fired.current=false;start.current=[e.clientX,e.clientY];setHolding(true);timer.current=setTimeout(()=>{fired.current=true;setHolding(false);onHold()},delay)};
 const move=(e:PointerEvent<HTMLButtonElement>)=>{if(Math.hypot(e.clientX-start.current[0],e.clientY-start.current[1])>14){cancel();fired.current=true}};
 const up=()=>{const shouldTap=timer.current!==null&&!fired.current;cancel();if(shouldTap)onTap?.()};
 return <button type="button" title={title} className={`${className} ${holding?'holding':''}`} style={style} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={cancel} onContextMenu={e=>e.preventDefault()}>{children}</button>;
}
