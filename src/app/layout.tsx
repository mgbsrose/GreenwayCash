import type {Metadata,Viewport} from 'next';import './styles.css';
export const metadata:Metadata={title:'ROSI zählt für euch!',description:'Offlinefähige Weihnachtsmarkt-Rechenhilfe',appleWebApp:{capable:true,title:'ROSI',statusBarStyle:'default'}};
export const viewport:Viewport={width:'device-width',initialScale:1,viewportFit:'cover',themeColor:'#173e35'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="de"><body>{children}</body></html>}
