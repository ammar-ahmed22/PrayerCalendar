import axios from "axios";
import "datejs"
import { generateURL } from "./url";

export const prayerNames = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const; 

export type Prayer = typeof prayerNames[number];

export type Timings = {
  [x in Prayer]: Date
} & { date: Date, sunrise: Date }

/**
 * Typeguard for Prayer type. Checks if a string is a prayer name
 *
 * @param {*} string
 * @returns {string is Prayer} true | false
 */
export const isPrayer = (string: any): string is Prayer => {

  if (prayerNames.includes(string)){
    return true
  }

  return false;
}

export interface ParsePrayerResponseOpts {
  isAnnual?: boolean
}

export const extractTimings = (item: any) : Timings => {
  const result : Timings = { 
    Fajr: new Date(),
    Dhuhr: new Date(),
    Asr: new Date(),
    Maghrib: new Date(),
    Isha: new Date(),
    date: new Date(parseInt(item.date.timestamp) * 1000),
    sunrise: new Date()
  };
  Object.keys(item.timings).forEach( timing => {
    if (isPrayer(timing)){
      const iso = item.timings[timing].split(" ")[0];
      result[timing] = new Date(iso);
    }
    if (timing === "Sunrise"){
      const iso = item.timings[timing].split(" ")[0];
      result.sunrise = new Date(iso)
    }
  })

  return result;
}

/**
 * Parses Al-Adhan API responses to Timings type
 *
 * @param {any[] | any} response
 * @returns {Timings[]} Timings
 */
export const parsePrayerResponse = (response: any[] | any, opts?: ParsePrayerResponseOpts) : Timings[] => {
  if (opts?.isAnnual){
    return Object.keys(response).flatMap( month => {
      return response[month].map( (item: any) => {
        return extractTimings(item);
      })
    })
  }
  return response.map( (item: any) => {
    return extractTimings(item);
  })
}

export interface AnnualTimingsOpts {
  latlng: {
    lat: number,
    lng: number
  },
  year: number,
  authority: string,
  madhab: string,
}

/**
 * Gets prayer time data for the year specified and parses it.
 * 
 * @async
 * @param {object} params 
 * @param {number} params.latlng.lat The latitude value
 * @param {number} params.latlng.lng The longitude value
 * @param {number} params.year The year to pull data for
 * @param {string} params.authority The Islamic authority to pull data from (string from 0 -12)
 * @param {string} params.madhab The fiqhi madhab to follow (0 for shafi, 1 for hanafi)
 * @returns {Promise<Timings[]>} Parsed prayer timings array
 */
export const annualTimings = async ({
  latlng,
  year,
  authority,
  madhab
} : AnnualTimingsOpts) : Promise<Timings[]> => {
  const BASE = "http://api.aladhan.com/v1/calendar";
  const url = generateURL(BASE, {
    latitude: latlng.lat,
    longitude: latlng.lng,
    year,
    method: authority,
    school: madhab,
    iso8601: true,
    annual: true
  })

  const response = await axios.get(url.href);
  return parsePrayerResponse(response.data.data, { isAnnual: true });
}

export type RangeTimingsOpts = Omit<AnnualTimingsOpts, "month" | "year"> & {
  start: Date,
  end: Date
}

/**
 * Gets prayer time data for a range of dates and parses it
 *
 * @async
 * @param {object} params
 * @param {number} params.latlng.lat The latitude value
 * @param {number} params.latlng.lng The longitude value
 * @param {Date} params.start The start of the range
 * @param {Date} params.end The end of the range
 * @param {string} params.authority The Islamic authority to pull data from (string from 0 -12)
 * @param {string} params.madhab The fiqhi madhab to follow (0 for shafi, 1 for hanafi)
 * 
 * 
 * @returns {Promise<Timings[]>} Parsed prayer timings array
 */
export const rangeTimings = async ({
  latlng,
  start,
  end,
  authority,
  madhab
} : RangeTimingsOpts) : Promise<Timings[]> => {
  const allTimings: Timings[] = [];
  if (end < start){
    throw new Error("Start must be before end!");
  }

  if (start.getFullYear() === end.getFullYear()){

    const res = await annualTimings({
      latlng,
      year: start.getFullYear(),
      authority,
      madhab
    })

    allTimings.push(...res);

  } else {
    let diff = end.getFullYear() - start.getFullYear();

    for (let i = 0; i <= diff; i++){
      const res = await annualTimings({
        latlng,
        year: start.getFullYear() + i,
        authority,
        madhab
      })

      allTimings.push(...res);
    }
  }


  return allTimings.filter( timing => {
    return timing.date.between(start, end);
  })

}


