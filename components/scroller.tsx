'use client'
import Marquee from "react-fast-marquee";
import AndroidServices from "../services/androidservice";
import { useEffect, useState } from "react";
import { getAllMedia, saveText } from "../utils/indexdb";

export default function Scroller() {
    const [marqueeNews,setMarqueeNew]=useState<any>()


    const GetNoticeScroller = async () => {
        var resp = await AndroidServices.GetNoticeScrollerList(1, 99, "Gau-Palika-Notice-Scroller", "en");
        if (resp.Code == 200) {
        await saveText(resp?.Data.SettingKey,resp?.Data?.NoticeScrollerListVM,"marqueenews")

        }
        const media = await getAllMedia();
        let marqnews=media.filter((item:any)=>item.type=="marqueenews")
        setMarqueeNew(marqnews[0].data)
      };

    
    
    useEffect(()=>{GetNoticeScroller()},[])
    return (
        <>
            <section className="scroller">
                <div className="news-container bg-primary-red d-flex  z-10" style={{ height: "4vh" }}>
                    <span className="d-flex align-items-center justify-content-center px-1 font-bold text-xl 2xl:p-3 text-white bg-danger w-[6%] " >सुचना</span>
                    <div className=" d-flex align-items-center text-white  text-lg  w-[94%] ms-auto " style={{ backgroundColor: "#3460b9" }}>
                        
                    {marqueeNews &&marqueeNews?.length > 0 && (
                  <div className="text">
                    <Marquee>
                      <div className="d-flex ">
                        {marqueeNews.map((item: any, index: number) => {
                          return (
                            <div className=""  key={index}>
                            
                                <p className="text-center mt-3">{item?.NoticeTitle ?? ""}</p>
                              
                            </div>
                          )
                        })}
                      </div>
                    </Marquee>
                    </div>)
                    }
                    </div>
                    <span className="d-flex align-items-center justify-content-center px-1 font-bold text-xl 2xl:p-3 text-white bg-danger w-[4%] " ></span>

                </div>
            </section>
        </>
    )
}