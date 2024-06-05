"use client";
import { useEffect, useState } from "react";
import AndroidServices from "../services/androidservice";
import NepaliDate from "nepali-date-converter";
import axios from "axios";
import { getAllMedia, saveText } from "../utils/indexdb";

export default function Navbar() {
  const [headerData, setHeaderData] = useState<any>();

  const GetNaveHtml = async () => {
    var resp = await AndroidServices.GetHtmlContentList(
      1,
      99,
      "	Gau-Palika",
      "en"
    );
    if (resp.Code == 200) {
      await saveText(resp?.Data.SettingKey, resp?.Data?.HtmlContentVM[0], "headerInfo");
    }
    const media = await getAllMedia();
    setHeaderData(media &&media.filter((item: any) => item.type == "headerInfo"));
  };
  const date = new Date();
  const hour = date.getHours();
  const minute = date.getMinutes();

  const nepaliDigits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];

  function toNepaliNumerals(number: any) {
    return number
      .toString()
      .split("")
      .map((digit: any) => nepaliDigits[digit])
      ?.join("");
  }

  
  const [weatherDetail, setWeatherDetail] = useState<any>();
  const getWeather = async () => {
    try {
      axios
        .get(
          "http://dataservice.accuweather.com/forecasts/v1/hourly/1hour/241809?apikey=92qhweritEx8Ag7GIb3VAdg2XGrvEvDp"
        )
        .then((result) => {
          setWeatherDetail(result);
        });

    } catch (error) {
      console.log("weather api error", error);

    }

  };

  useEffect(() => {
    GetNaveHtml()
    getWeather();
    // getHeader();
  }, []);
  return (
    <>
      <section className="navbar my-2">
        <div
          className="d-flex align-items-center justify-content-between w-100"
          style={{ height: "11vh" }}
        >
          <div className="w-20 logo h-50 ms-4" style={{width:"13.75%"}}>
            <img
              src="/images/guapalika.png"
              alt="logo"
              className="h-100 "
            />
          </div>
          <div className="weather_info h-100 d-flex justify-content-center align-items-center mx-2"style={{ width: "13.75%" }}>
            <div className="" style={{ height: "50%" }}>
              <img
                src="/images/sun.png"
                alt="logo"
                className="h-100 w-100"
              />
            </div>
            <div className="mx-4">
              <div>
                <span style={{ color: "#3460b9", fontWeight: "bolder" }}>
                  {weatherDetail && weatherDetail?.data[0]?.Temperature?.Value > 0 ? ((weatherDetail?.data[0]?.Temperature?.Value - 32) * (5 / 9))?.toFixed(2) : 0.0} °C
                </span>
              </div>
              <div>
                <span style={{ color: "#3a9426", fontWeight: "bolder" }}>
                  मौसम
                </span>
              </div>
            </div>
          </div>
          <div dangerouslySetInnerHTML={{__html:headerData &&headerData[0]?.data.ContentHtml}}></div>
          {/* <div className="d-flex flex-column align-items-center" style={{width:"45%"}}>
            <label
              className="font-bold "
              style={{ color: "#3460b9", lineHeight: "1.5rem" }}
            >
              {headerData && headerData[0]?.data?.heading_1}
            </label>
            <label
              className="font-bold "
              style={{ color: "#d01e29", lineHeight: "1.5rem" }}
            >
              {headerData && headerData[0]?.data?.heading_2}
            </label>
            <label
              className="font-bold "
              style={{ color: "#3460b9", lineHeight: "1.5rem" }}
            >
              {headerData && headerData[0]?.data?.heading_3}
            </label>
            <label
              className="font-bold "
              style={{ color: "#d01e29", lineHeight: "1.5rem" }}
            >
              {headerData && headerData[0]?.data?.heading_4}
            </label>
          </div> */}
          <div className="d-flex align-items-center gap-2" style={{width:"27.5%"}}>
            <div className="d-flex align-items-center gap-2">
              <svg
                version="1.0"
                className="w-[15vh]"
                xmlns="http://www.w3.org/2000/svg"
                width="185.000000pt"
                height="123.000000pt"
                viewBox="0 0 185.000000 123.000000"
                preserveAspectRatio="xMidYMid meet"
              >
                <g
                  transform="translate(0.000000,123.000000) scale(0.100000,-0.100000)"
                  fill="#000000"
                  stroke="none"
                >
                  <path d="M667 974 c-4 -4 -7 -27 -7 -51 0 -37 3 -43 21 -43 18 0 20 5 17 47 -3 44 -15 62 -31 47z"></path>
                  <path d="M830 930 c0 -38 4 -50 15 -50 11 0 15 12 15 50 0 38 -4 50 -15 50 -11 0 -15 -12 -15 -50z"></path>
                  <path d="M990 930 c0 -38 4 -50 15 -50 11 0 15 12 15 50 0 38 -4 50 -15 50 -11 0 -15 -12 -15 -50z"></path>
                  <path d="M1157 974 c-4 -4 -7 -27 -7 -51 0 -35 3 -43 19 -43 15 0 18 7 17 47 -1 43 -13 63 -29 47z"></path>
                  <path d="M536 898 c-14 -19 -16 -66 -16 -313 0 -159 4 -295 8 -301 20 -31 54 -34 397 -34 343 0 377 3 397 34 4 6 8 142 8 301 0 331 -1 335 -71 335 -35 0 -39 -3 -39 -24 0 -31 -24 -56 -54 -56 -30 0 -46 18 -46 52 0 24 -4 28 -30 28 -22 0 -30 -5 -30 -18 0 -28 -29 -62 -54 -62 -30 0 -46 18 -46 52 0 25 -3 28 -35 28 -32 0 -35 -3 -35 -28 0 -15 -5 -33 -12 -40 -30 -30 -88 1 -88 46 0 18 -6 22 -30 22 -26 0 -30 -4 -30 -28 0 -34 -16 -52 -46 -52 -30 0 -54 25 -54 56 0 21 -4 24 -39 24 -30 0 -44 -6 -55 -22z m754 -367 c0 -199 -2 -230 -16 -235 -9 -3 -167 -6 -353 -6 -249 0 -340 3 -349 12 -9 9 -12 75 -12 235 l0 223 365 0 365 0 0 -229z"></path>
                  <path d="M692 673 c-102 -50 -118 -189 -31 -267 102 -93 262 -31 276 106 6 55 -28 124 -76 155 -41 28 -120 31 -169 6z m142 -13 c55 -27 79 -63 83 -124 7 -89 -57 -156 -147 -156 -58 0 -103 28 -130 79 -33 67 -23 127 32 178 49 46 101 53 162 23z"></path>
                  <path d="M763 635 c0 -8 4 -15 9 -15 4 0 8 7 8 15 0 8 -4 15 -8 15 -5 0 -9 -7 -9 -15z"></path>
                  <path d="M665 580 c3 -5 11 -10 16 -10 6 0 7 5 4 10 -3 6 -11 10 -16 10 -6 0 -7 -4 -4 -10z"></path>
                  <path d="M855 580 c-3 -5 -2 -10 4 -10 5 0 13 5 16 10 3 6 2 10 -4 10 -5 0 -13 -4 -16 -10z"></path>
                  <path d="M767 533 c-3 -4 7 -17 22 -27 l26 -20 -20 25 c-11 13 -21 25 -21 27 -1 2 -4 0 -7 -5z"></path>
                  <path d="M665 470 c-3 -5 -2 -10 4 -10 5 0 13 5 16 10 3 6 2 10 -4 10 -5 0 -13 -4 -16 -10z"></path>
                  <path d="M850 476 c0 -2 7 -7 16 -10 8 -3 12 -2 9 4 -6 10 -25 14 -25 6z"></path>
                  <path d="M766 415 c4 -8 8 -15 10 -15 2 0 4 7 4 15 0 8 -4 15 -10 15 -5 0 -7 -7 -4 -15z"></path>
                  <path d="M1007 673 c-37 -6 -33 -37 6 -41 23 -3 27 0 27 22 0 14 -1 25 -2 25 -2 -1 -16 -4 -31 -6z"></path>
                  <path d="M1190 653 c0 -19 6 -23 30 -23 24 0 30 4 30 23 0 18 -6 22 -30 22 -24 0 -30 -4 -30 -22z"></path>
                  <path d="M1090 650 c0 -16 7 -20 30 -20 23 0 30 4 30 20 0 16 -7 20 -30 20 -23 0 -30 -4 -30 -20z"></path>
                  <path d="M980 570 c0 -16 7 -20 30 -20 23 0 30 4 30 20 0 16 -7 20 -30 20 -23 0 -30 -4 -30 -20z"></path>
                  <path d="M1087 570 c4 -14 14 -20 34 -20 22 0 29 5 29 20 0 16 -7 20 -34 20 -29 0 -33 -3 -29 -20z"></path>
                  <path d="M1190 570 c0 -16 7 -20 30 -20 23 0 30 4 30 20 0 16 -7 20 -30 20 -23 0 -30 -4 -30 -20z"></path>
                  <path d="M1190 488 c0 -13 8 -18 30 -18 19 0 30 5 30 14 0 8 -13 16 -30 18 -24 4 -30 1 -30 -14z"></path>
                  <path d="M980 485 c0 -10 10 -15 30 -15 20 0 30 5 30 15 0 10 -10 15 -30 15 -20 0 -30 -5 -30 -15z"></path>
                  <path d="M1090 485 c0 -10 10 -15 30 -15 20 0 30 5 30 15 0 10 -10 15 -30 15 -20 0 -30 -5 -30 -15z"></path>
                  <path d="M980 400 c0 -16 7 -20 30 -20 23 0 30 4 30 20 0 16 -7 20 -30 20 -23 0 -30 -4 -30 -20z"></path>
                  <path d="M1087 400 c4 -14 14 -20 34 -20 22 0 29 5 29 20 0 16 -7 20 -34 20 -29 0 -33 -3 -29 -20z"></path>
                  <path d="M1190 400 c0 -16 7 -20 30 -20 23 0 30 4 30 20 0 16 -7 20 -30 20 -23 0 -30 -4 -30 -20z"></path>
                </g>
              </svg>

              <div className="d-flex flex-column gap-2">
                <label className=" text-xl  italic" style={{ color: "#3460b9" }}>
                  {new NepaliDate(new Date()).format("YYYY MMMM  DD", "np")}
                  {/* २०८१ जेठ १४  */}
                </label>
                <label className=" text-xl  italic" style={{ color: "#d01e29" }}>
                  {new NepaliDate(new Date()).format(" ddd ", "np")},
                  {toNepaliNumerals(hour)}:{toNepaliNumerals(minute)}
                  {/* सोमबार , १७ : ५१ बजे */}
                </label>
              </div>
            </div>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Flag_of_Nepal_%28with_spacing%2C_aspect_ratio_4-3%29.svg/220px-Flag_of_Nepal_%28with_spacing%2C_aspect_ratio_4-3%29.svg.png"
              className=" ms-auto h-[8vh]" style={{width:"30%"}}
            ></img>
          </div>
        </div>
      </section>
    </>
  );
}
