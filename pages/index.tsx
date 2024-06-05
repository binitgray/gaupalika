"use client";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useRef, useState } from "react";
// import { urlToBase64 } from "../api/base64";
import { useRouter } from "next/navigation";
import AndroidServices from "../services/androidservice";
import Navbar from "../components/navbar";
import Scroller from "../components/scroller";
import { urlToBase64 } from "../api/base64";
import { getAllMedia, saveMedia, saveText } from "../utils/indexdb";

export default function Gaupalika() {
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 1 },
      items: 2,
    },
  };
  const responsive1 = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 1 },
      items: 1,
    },
  };
  const responsive3 = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 1,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
    },
  };
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    vertical: true,
    verticalSwiping: true,
    autoplay: true,
    autoplaySpeed: 4000,
  };
  const [pageChange, setPageChange] = useState(false);
  const [officials, setOfficials] = useState<any>([]);
  const [officialSlider, setOfficialSlider] = useState<any>([]);
  const [staff, setStaff] = useState<any>([]);
  const [staffSlider, setStaffSlider] = useState<any>([]);
  const [mainContain, setMainContain] = useState<any>([]);
  const [notice, setNotice] = useState<any>([]);
  const [generalInfo, setGeneralInfo] = useState<any>([]);
  const [badapatraPdf, setBadapatraPdf] = useState<any>();
  const [base64Image, setBase64Image] = useState("");
  const [mediaList, setMediaList] = useState<any>([]);
  const [settingData, setSettingData] = useState<any>();
  const [wadaPatraImage, setWadaPatraImage] = useState<any>([]);
  const [muteControl, setMuteControl] = useState(true);

  const processAndSaveImagesGray = async (items: any, type: any) => {
    const promises = items?.map(async (item: any, index: any) => {
      const imageUrl = `https://api.graycode.com.np/${
        item.ProfileImagePath || item.ImagePath
      }`;
      const base64 = await urlToBase64(imageUrl);
      item.image = base64;
      if (item.ProfileImagePath || item.ImagePath) {
        await saveMedia(item.Id, item, type);
      }
    });
    await Promise.all(promises);
    const media = await getAllMedia();
    const filteredMedia = media.filter((item) => item.type === type);
    switch (type) {
      case "officialSlider":
        setOfficialSlider(filteredMedia);
        break;
      case "officials":
        setOfficials(filteredMedia);
        break;
      case "staff":
        setStaff(filteredMedia);
        break;
      case "staffSlider":
        setStaffSlider(filteredMedia);
        break;
      // case "mainContain":
      //   setMainContain(filteredMedia);
      //   break;
      default:
        break;
    }
  };


  const [isLoading, setIsLoading] = useState<boolean>(true);
  

  const ConvetToBase64 = async (path: any) => {
    const imageUrl = `https://api.graycode.com.np${path?.MediaGalleryListVMS[0]?.MediaPath}`;
    try {
      const base64: any = await urlToBase64(imageUrl);
      setBase64Image(base64);
      await handleImageUpload(base64, path);
    } catch (error) {
      console.error("Error converting to base64:", error);
    }
  };

  const handleImageUpload = async (event: any, data: any) => {
    await saveMedia(data.Key, event, "badapatrapdf");
    const media = await getAllMedia();
    setMediaList(media);
    const filteredMedia = media.filter((item) => item.type === "badapatrapdf");
    setWadaPatraImage(filteredMedia);
  };


  const GetExeTeams = async () => {
    var resp = await AndroidServices.GetTeamsListbyKey(
      1,
      99,
      "Gau-Palika-tems",
      "en"
    );
    if (resp.Code == 200) {
      await saveText(
        resp.Data.SettingKey,
        resp.Data.TeamListVM,
        "firstpagedetail"
      );
    }
    const media = await getAllMedia();
    const detail = media.find((item) => item.type === "firstpagedetail");
    if (detail?.data) {
      const data = detail.data;
      await processAndSaveImagesGray(data, "officials");
      setIsLoading(false);
    }
  };

  const GetCountHtml = async () => {
    var resp = await AndroidServices.GetHtmlContentList(
      1,
      99,
      "Gau-Palika-Count",
      "en"
    );
    if (resp.Code == 200) {
      await saveText(
        resp?.Data.SettingKey,
        resp?.Data?.HtmlContentVM[0],
        "counts"
      );
    }
    const media = await getAllMedia();
    const detail = media.find((item) => item.type === "counts");
    setGeneralInfo(detail);
  };


  const GetEmployeeTeams = async () => {
    var resp = await AndroidServices.GetTeamsListbyKey(
      1,
      99,
      "Gau-Palika-Team-Employee",
      "en"
    );
    if (resp.Code == 200) {
      await saveText(
        resp.Data.SettingKey,
        resp.Data.TeamListVM,
        "firstEmployeedetail"
      );
    }
    const media = await getAllMedia();
    const detail = media.find((item) => item.type === "firstEmployeedetail");
    if (detail?.data) {
      const data = detail.data;
      await processAndSaveImagesGray(data, "staffSlider");
      setIsLoading(false);
    }
  };

  const getWebGallery = async () => {
    var response = await AndroidServices.GetWebGalleryList(
      1,
      10,
      "Gau-Palika-Badapatra"
    );
    if (response.Code == 200) {
      await ConvetToBase64(response.Data);
    }
  };

  const getMainContent = async () => {
    var response = await AndroidServices.GetBannerImageList(
      1,
      10,
      "Gau-Palika-Main-Banner"
    );
    if (response.Code == 200) {
      
      await saveText(response.Data.SettingKey, response?.Data?.Banners, "mainContain");
    }
    const media = await getAllMedia();
    const detail:any = media.find((item) => item.id === "Gau-Palika-Main-Banner");
      await processAndSaveImagesGrayMain(detail?.data, "mainContains");
      setIsLoading(false);
  };
  const processAndSaveImagesGrayMain = async (items: any, type: any) => {

    const promises = items && items.map(async (item: any, index: any) => {
        const imageUrl = `https://api.graycode.com.np/${item?.ImagePath}`;
        const base64 = await urlToBase64(imageUrl);
        item.image = base64;
      if (item?.ImagePath) {
        await saveMedia(item?.Id, item, type);
      }
    });
    await Promise.all(promises);
    const media = await getAllMedia();
    const filteredMedia = media.filter((item) => item.type === type);
    if (type == "mainContains") {
      setMainContain(filteredMedia);
    }
  };
  const GetBudget = async () => {
    var response = await AndroidServices.GetHtmlContentList(
      1,
      10,
      "Gau-Palika-Budget",
      "en"
    );
    if (response.Code == 200) {
      await saveText(response.Data.SettingKey, response.Data, "Budget");
    }
    const media = await getAllMedia();
    const detail = media.find((item) => item.type === "Budget");
    if (detail?.data) {
      setSettingData(detail?.data?.HtmlContentVM);
    }
  };
  const GetNotice = async () => {
    var response = await AndroidServices.GetNoticeList(
      1,
      10,
      "Gau-Palika-Notice",
    );
    if (response.Code == 200) {
      await saveText(response.Data.SettingKey, response.Data, "Notice");
    }
    const media = await getAllMedia();
    const detail = media.find((item) => item.type === "Notice");
    if (detail?.data) {
      
      setNotice(detail?.data?.NoticePopupoutputVM);
    }
  };
  
  console.log("main",mainContain);
  

  
  useEffect(() => {
    GetNotice()
    getWebGallery();
    GetBudget();
    GetCountHtml();
    getMainContent();
    GetExeTeams();
    GetEmployeeTeams();
  }, []);



  useEffect(() => {
    const intervalId = setInterval(() => {
      setPageChange((prev) => !prev);
      setMuteControl(false);
    }, 60000);
    return () => clearInterval(intervalId);
  }, []);
  const palikaLength = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  return (
    <>
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center h-screen">
          <div
            className="loader"
            style={{ width: "50px", height: "50px" }}
          ></div>
        </div>
      ) : (
        <div>
          <Navbar />
          <Scroller />
          {pageChange == false && (
            <div>
              <section className="members">
                <div
                  className="d-flex  align-items-center h-[18vh]"
                  style={{ width: "100%" }}
                >
                  <div
                    className=" bg-gray-200 h-full ps-6 grid d-flex gap-2 "
                    style={{ width: "20%" }}
                  >
                    <div className="d-flex  justify-content-center text-sm gap-4 align-items-center">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: generalInfo?.data?.ContentHtml,
                        }}
                      />
                    </div>
                    <div
                      className="bg-[#2460B9] text-white d-flex align-items-center  w-[3vw]"
                      style={{ height: "100%" }}
                    >
                      <span
                        className="-rotate-90"
                        style={{ margin: "0 -1.5rem", fontSize: "19px" }}
                      >
                        पदाधिकारिहरु
                      </span>
                    </div>
                  </div>
                  <div
                    className="d-flex   justify-content-between"
                    style={{ width: "48%", height: "100%" }}
                  >
                    {officials &&
                      officials?.length > 3 &&
                      officials
                        ?.slice(0, 3)
                        ?.map((item: any, index: number) => {
                          return (
                            <div
                              key={index}
                              style={{ width: "33.33%", height: "100%" }}
                            >
                              <div className="d-flex gap-2 h-100">
                                <img
                                  style={{ width: "40%", height: "100%" }}
                                  className=" object-cover aspect-auto"
                                  alt={`${item?.data?.FullName}`}
                                  src={item?.data?.image}
                                />
                                <div
                                  className="d-flex flex-column justify-content-between py-2"
                                  style={{ width: "60%", height: "100%" }}
                                >
                                  <div>
                                    <div
                                      className=" text-md  font-bold text-wrap "
                                      style={{ margin: "-4px", width: "100%" }}
                                    >
                                      {item?.data?.FullName}
                                    </div>
                                    <div
                                      className="  color-thm-green"
                                      style={{ margin: "-4px" }}
                                    >
                                      {item?.data?.Title}
                                    </div>
                                  </div>
                                  <div className="d-flex relative align-items-center gap-3">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 24 24"
                                      className="absolute w-4 text-blue-400"
                                      fill="currentColor"
                                    >
                                      <path d="M21 16.42V19.9561C21 20.4811 20.5941 20.9167 20.0705 20.9537C19.6331 20.9846 19.2763 21 19 21C10.1634 21 3 13.8366 3 5C3 4.72371 3.01545 4.36687 3.04635 3.9295C3.08337 3.40588 3.51894 3 4.04386 3H7.5801C7.83678 3 8.05176 3.19442 8.07753 3.4498C8.10067 3.67907 8.12218 3.86314 8.14207 4.00202C8.34435 5.41472 8.75753 6.75936 9.3487 8.00303C9.44359 8.20265 9.38171 8.44159 9.20185 8.57006L7.04355 10.1118C8.35752 13.1811 10.8189 15.6425 13.8882 16.9565L15.4271 14.8019C15.5572 14.6199 15.799 14.5573 16.001 14.6532C17.2446 15.2439 18.5891 15.6566 20.0016 15.8584C20.1396 15.8782 20.3225 15.8995 20.5502 15.9225C20.8056 15.9483 21 16.1633 21 16.42Z"></path>
                                    </svg>
                                    <span className="ml-4 text-base color-thm-red color-thm-red">
                                      {item?.data?.MessageContent}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                  </div>
                  <div
                    className="slider "
                    style={{ width: "32%", height: "100%" }}
                  >
                    {officials && officials?.length > 0 && (
                      <Carousel
                        responsive={responsive}
                        arrows={false}
                        autoPlay
                        autoPlaySpeed={4000}
                        infinite
                      >
                        {officials &&
                          officials
                            ?.slice(3)
                            .map((item: any, index: number) => {
                              return (
                                <div
                                  key={index}
                                  className="swiper-slide d-flex gap-1"
                                  style={{ width: "100%", height: "100%" }}
                                >
                                  <div className="d-flex gap-1 h-100">
                                    <img
                                      style={{ width: "40%", height: "100%" }}
                                      className=" object-cover aspect-auto"
                                      alt={`${item?.data?.FullName}`}
                                      src={item?.data?.image}
                                    />

                                    <div
                                      className="d-flex flex-column justify-content-between py-2"
                                      style={{ width: "60%", height: "100%" }}
                                    >
                                      <div>
                                        <div
                                          className=" text-md whitespace-nowrap font-bold "
                                          style={{
                                            margin: "-4px",
                                            width: "100%",
                                          }}
                                        >
                                          {item?.data?.FullName}
                                        </div>
                                        <div
                                          className="   whitespace-nowrap overflow-hidden color-thm-green"
                                          style={{ margin: "-4px" }}
                                        >
                                          {item?.data?.Title}
                                        </div>
                                      </div>
                                      <div className="d-flex relative align-items-center gap-3">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          viewBox="0 0 24 24"
                                          className="absolute w-4 text-blue-400"
                                          fill="currentColor"
                                        >
                                          <path d="M21 16.42V19.9561C21 20.4811 20.5941 20.9167 20.0705 20.9537C19.6331 20.9846 19.2763 21 19 21C10.1634 21 3 13.8366 3 5C3 4.72371 3.01545 4.36687 3.04635 3.9295C3.08337 3.40588 3.51894 3 4.04386 3H7.5801C7.83678 3 8.05176 3.19442 8.07753 3.4498C8.10067 3.67907 8.12218 3.86314 8.14207 4.00202C8.34435 5.41472 8.75753 6.75936 9.3487 8.00303C9.44359 8.20265 9.38171 8.44159 9.20185 8.57006L7.04355 10.1118C8.35752 13.1811 10.8189 15.6425 13.8882 16.9565L15.4271 14.8019C15.5572 14.6199 15.799 14.5573 16.001 14.6532C17.2446 15.2439 18.5891 15.6566 20.0016 15.8584C20.1396 15.8782 20.3225 15.8995 20.5502 15.9225C20.8056 15.9483 21 16.1633 21 16.42Z"></path>
                                        </svg>
                                        <span className="ml-4 text-base color-thm-red">
                                          {item?.data?.MessageContent}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                      </Carousel>
                    )}
                  </div>
                </div>
              </section>
              <section className="main-content">
                <div className="d-flex" style={{ height: "63vh" }}>
                  <div className="d-flex flex-column " style={{ width: "25%" }}>
                    <label className="text-white bg-thm-blue w-100 h-[3vh] d-flex align-items-center justify-content-center">
                      कर्मचारिहरु
                    </label>
                    <div className="d-flex h-[59vh]">
                      <div className="d-flex flex-col w-[20vw] py-2">
                        <div className="d-flex flex-col  px-2 h-[31vh] justify-between">
                          {staffSlider &&
                            staffSlider.length > 0 &&
                            staffSlider
                              ?.slice(0, 2)
                              ?.map((item: any, index: number) => {
                                return (
                                  <div
                                    key={index}
                                    className="d-flex gap-4 h-[15.5vh] p-1"
                                  >
                                    <img
                                      className="h-[13vh] w-[6vw] object-cover aspect-auto"
                                      alt={`${item?.data?.FullName}`}
                                      src={item?.data?.image}
                                    />
                                    <div className="d-flex flex-column justify-content-between ">
                                      <div>
                                        <div className=" text-lg whitespace-nowrap font-bold">
                                          {item?.data?.FullName}
                                        </div>
                                        <div className=" color-thm-green whitespace-nowrap overflow-hidden">
                                          {item?.data?.Title}
                                        </div>
                                      </div>
                                      {item?.data?.MessageContent && (
                                        <div className="d-flex relative align-items-center gap-3">
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            className="absolute w-4 text-blue-400"
                                            fill="currentColor"
                                          >
                                            <path d="M21 16.42V19.9561C21 20.4811 20.5941 20.9167 20.0705 20.9537C19.6331 20.9846 19.2763 21 19 21C10.1634 21 3 13.8366 3 5C3 4.72371 3.01545 4.36687 3.04635 3.9295C3.08337 3.40588 3.51894 3 4.04386 3H7.5801C7.83678 3 8.05176 3.19442 8.07753 3.4498C8.10067 3.67907 8.12218 3.86314 8.14207 4.00202C8.34435 5.41472 8.75753 6.75936 9.3487 8.00303C9.44359 8.20265 9.38171 8.44159 9.20185 8.57006L7.04355 10.1118C8.35752 13.1811 10.8189 15.6425 13.8882 16.9565L15.4271 14.8019C15.5572 14.6199 15.799 14.5573 16.001 14.6532C17.2446 15.2439 18.5891 15.6566 20.0016 15.8584C20.1396 15.8782 20.3225 15.8995 20.5502 15.9225C20.8056 15.9483 21 16.1633 21 16.42Z"></path>
                                          </svg>
                                          <span className="ml-4 text-base color-thm-red">
                                            {item?.data?.MessageContent}
                                          </span>
                                        </div>
                                      )}
                                      <label
                                        className=" color-thm-blue"
                                        style={{ margin: "-3px" }}
                                      ></label>
                                    </div>
                                  </div>
                                );
                              })}
                        </div>
                        <div className=" d-flex flex-column gap-4 px-2 h-[27vh] justify-between staff-slider">
                          {staffSlider && staffSlider?.length > 0 && (
                            <div className="vertical-carousel">
                              <Slider {...settings}>
                                {staffSlider &&
                                  staffSlider
                                    ?.slice(3)
                                    ?.map((item: any, index: number) => (
                                      <div
                                        key={index}
                                        className="d-flex gap-4 h-[15.5vh] p-1"
                                      >
                                        <img
                                          className="h-[13vh] w-[6vw] object-cover aspect-auto"
                                          alt={`${item?.data?.FullName}`}
                                          src={item?.data?.image}
                                        />
                                        <div className="d-flex flex-column justify-content-between">
                                          <div>
                                            <div className="text-lg whitespace-nowrap font-bold">
                                              {item?.data?.FullName}
                                            </div>
                                            <div className=" color-thm-green whitespace-nowrap overflow-hidden">
                                              {item?.data?.Title}
                                            </div>
                                          </div>
                                          {item?.data?.MessageContent && (
                                            <div className="d-flex relative align-items-center gap-3">
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                className="absolute w-4 text-blue-400"
                                                fill="currentColor"
                                              >
                                                <path d="M21 16.42V19.9561C21 20.4811 20.5941 20.9167 20.0705 20.9537C19.6331 20.9846 19.2763 21 19 21C10.1634 21 3 13.8366 3 5C3 4.72371 3.01545 4.36687 3.04635 3.9295C3.08337 3.40588 3.51894 3 4.04386 3H7.5801C7.83678 3 8.05176 3.19442 8.07753 3.4498C8.10067 3.67907 8.12218 3.86314 8.14207 4.00202C8.34435 5.41472 8.75753 6.75936 9.3487 8.00303C9.44359 8.20265 9.38171 8.44159 9.20185 8.57006L7.04355 10.1118C8.35752 13.1811 10.8189 15.6425 13.8882 16.9565L15.4271 14.8019C15.5572 14.6199 15.799 14.5573 16.001 14.6532C17.2446 15.2439 18.5891 15.6566 20.0016 15.8584C20.1396 15.8782 20.3225 15.8995 20.5502 15.9225C20.8056 15.9483 21 16.1633 21 16.42Z"></path>
                                              </svg>
                                              <span className="ml-4 text-base color-thm-red">
                                                {item?.data?.MessageContent}
                                              </span>
                                            </div>
                                          )}
                                          <label
                                            className="color-thm-blue"
                                            style={{ margin: "-3px" }}
                                          ></label>
                                        </div>
                                      </div>
                                    ))}
                              </Slider>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="d-flex  main-slider "
                    style={{ width: "50%" }}
                  >
                    {mainContain && mainContain?.length > 0 && (
                      <Carousel
                        responsive={responsive1}
                        infinite
                        arrows={false}
                        autoPlay
                        autoPlaySpeed={8000}
                      >
                        {mainContain &&
                          mainContain.map((item: any, index: number) => {
                            return (
                              <div
                                key={index}
                                style={{ width: "100%", height: "100%" }}
                              >
                                <div className="d-flex flex-column h-100">
                                  <label
                                    style={{ padding: "1px" }}
                                    className="d-flex justify-content-center align-items-center font-bold text-white h-[3vh]  bg-thm-blue w-[50vw]"
                                  >
                                    {item?.data?.Title}
                                  </label>

                                  <img
                                    className="w-100 h-[59vh] border border-right border-left border-light"
                                    style={{ objectFit: "fill" }}
                                    alt={`${item?.data?.title}`}
                                    src={item?.data?.image}
                                  />
                                </div>
                              </div>
                            );
                          })}
                      </Carousel>
                    )}
                  </div>
                  <div className=" " style={{ width: "25%" }}>
                    <div style={{ width: "100%" }}>
                      {settingData && settingData.length>0 &&
                      <Carousel
                        responsive={responsive1}
                        autoPlaySpeed={8000}
                        infinite
                        arrows={false}
                      >
                       {settingData && settingData.map((item:any,index:number)=>{
                        return (
                          <div key={index}>
                            <div dangerouslySetInnerHTML={{__html:item.ContentHtml}}/>

                          </div>
                        )
                       })}
                       
                       
                      </Carousel>}
                    </div>
                    <div className=" mx-aauto d-flex flex-column justify-content-center position-absolute w-100 mt-2 swiper-backface-hidden">
                      {notice && notice?.length > 0 && (
                        <Carousel
                          responsive={responsive1}
                          arrows={false}
                          infinite
                        >
                          {notice &&
                            notice.map((item: any, index: number) => {
                              return (
                                <div
                                  key={index}
                                  className=" d-flex gap-4"
                                  data-swiper-slide-index="2"
                                  style={{ width: "25%", paddingLeft: "1rem" }}
                                >
                                  <div className="rounded-sm border my-1">
                                    <label className="font-bold text-lg text-center flex justify-content-center bg-thm-red text-white">
                                      सूचना सूचना सूचना !!!
                                    </label>
                                    <p className="break-all text-base p-2 text-black">
                                      <span dangerouslySetInnerHTML={{__html:item?.NoticeContent}}/>
                                      
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                        </Carousel>
                      )}
                    </div>
                  </div>
                </div>
              </section>
              <section className="position-relative">
                <div className="position-absolute bottom-0 mt-2 bg-thm-red flex w-full justify-content-center text-white py-1 h-[4vh] align-items-center z-10">
                  <label>Powered By Encraft Technologies Pvt. Ltd.</label>
                </div>
              </section>
            </div>
          )}
          {pageChange == true && (
            <div
              className="d-flex col-xl-12 col-lg-12 h-[85vh] p-1"
              style={{ backgroundColor: "bisque" }}
            >
              <div className="col-6 pe-1 h-100">
                <video
                  className="h-100 w-100 object-fit-cover"
                  controls
                  autoPlay
                  loop
                  muted={muteControl}
                  src={
                    // youtubeVideo
                    //   ? youtubeVideo[0]?.data
                    //   :
                    "/video/himali.mp4"
                  }
                  width={"100%"}
                  height={"100%"}
                ></video>
              </div>
              <div className="col-6 m-0 ps-1 pdf-carousel h-100">
                <div
                  className=" d-flex justify-content-center "
                  style={{ backgroundColor: "#3460b9" }}
                >
                  <span className="text-center text-white fs-5">
                    {badapatraPdf && badapatraPdf?.title}
                  </span>
                </div>
                {/* <iframe src={wadaPatraImage &&wadaPatraImage[0]?.data} title="PDF Viewer" width="100%" height="100%" /> */}

                {palikaLength && palikaLength?.length > 0 && (
                  <Carousel
                    arrows={false}
                    autoPlaySpeed={8000}
                    autoPlay
                    infinite
                    responsive={responsive3}
                  >
                    {palikaLength &&
                      palikaLength?.map((item: any, index: number) => (
                        <div key={index} className="w-100 h-100">
                          <iframe
                            src={
                              wadaPatraImage &&
                              wadaPatraImage[0]?.data +
                                `#page=${
                                  index + 1
                                }&toolbar=0&navpanes=0&scrollbar=0&view=fit`
                            }
                            title="PDF Viewer"
                            width="100%"
                            height="100%"
                          />

                          {/* <img src={item.data} className="img-fluid h-100" /> */}
                        </div>
                      ))}
                  </Carousel>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
