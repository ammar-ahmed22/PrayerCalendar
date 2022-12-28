import axios from "axios";
import "datejs"
import { createEvents, EventAttributes, DateArray } from "ics";
import { generateURL } from "./url";

interface PrayerTimesOpts{
  latlng: {
    lat: number,
    lng: number
  },
  month: number,
  year: number,
  authority: string,
  madhab: string,
  numberOfMonths: number
}



const prayerNames = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const; 

type Prayer = typeof prayerNames[number];

type Timings = {
  [x in Prayer]: Date
}

const isPrayer = (string: any): string is Prayer => {

  if (prayerNames.includes(string)){
    return true
  }

  return false;
}

// const sleep = (ms: number) : Promise<boolean> => new Promise( resolve => {
//   setTimeout(() => {resolve(true)}, ms)
// })

const parsePrayerResponse = (response: any[]) : Timings[] => {
  return response.map( item => {
    const result : Timings = { 
      Fajr: new Date(),
      Dhuhr: new Date(),
      Asr: new Date(),
      Maghrib: new Date(),
      Isha: new Date()
    };
    Object.keys(item.timings).forEach( timing => {
      if (isPrayer(timing)){
        const iso = item.timings[timing].split(" ")[0];
        result[timing] = new Date(iso);
      }
    })

    return result;
  })
}

export const getPrayerTimes = async ({ 
  latlng,
  month,
  year,
  authority,
  madhab,
  numberOfMonths
} : PrayerTimesOpts) => {

  const BASE = "http://api.aladhan.com/v1/calendar";
  let result: Timings[] = [];

  for (let i = 0; i < numberOfMonths; i++){
    const start = Date.today().set({ month, year, day: 2 });
    const curr = start.add({ months: i });

    const url = generateURL(BASE, {
      latitude: latlng.lat,
      longitude: latlng.lng,
      month: curr.getMonth() + 1,
      year: curr.getFullYear(),
      method: authority,
      school: madhab,
      iso8601: true
    })
  
    const resp = await axios.get(url.href);

    result = result.concat(parsePrayerResponse(resp.data.data))
  }

  return result;

}

const dateArray = (date: Date) : DateArray => {
  return [
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    date.getHours(),
    date.getSeconds()
  ]
}

export const generateICS = (timings: Timings[]) => {
  const events : EventAttributes[] = [];

  for (const timing in timings){
    const day = timings[timing];
    for (const prayer in day){
      const p = prayer as Prayer
      const prayerTime = day[p];

      events.push({
        title: prayer,
        start: dateArray(prayerTime),
        duration: { minutes: 5 }
      })

    }
  }

  const { error, value } = createEvents(events);

  if (error){
    console.log(error);
    return;
  }

  return value

}