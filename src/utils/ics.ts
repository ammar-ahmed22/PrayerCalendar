import type { Timings, Prayer } from "./prayer";
import { createEvents, EventAttributes, DateArray } from "ics";

/**
 * Creates a date array 
 *
 * @param {Date} date
 * @returns {DateArray} [year, month, day, hour, minute]
 */
const dateArray = (date: Date) : DateArray => {
  return [
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    date.getHours(),
    date.getMinutes()
  ]
}

export interface GenerateICSOpts{
  duration?: number,
  offsets?: {
    [x in Prayer]?: number
  },
  includeSunrise?: boolean
}
/**
 * Creates .ics file from prayer times
 *
 * @param {Timings[]} timings Timings array
 * @param {GenerateICSOpts} [opts] Optional parameters for event generation
 * @returns {string | undefined} `.ics` file in string format
 */
export const generateICS = (timings: Timings[], opts?: GenerateICSOpts) : string | undefined => {
  const events : EventAttributes[] = [];

  for (const timing in timings){
    const day = timings[timing];
    for (const prayer in day){
      if (prayer !== "date" && prayer !== "sunrise"){
        const p = prayer as Prayer
        const dur = opts?.duration ?? 5;
        const offset = opts?.offsets ? opts.offsets[p] : 0;
        const prayerTime = day[p].addMinutes(offset ?? 0);


        events.push({
          title: prayer,
          start: dateArray(prayerTime),
          duration: { minutes: dur }
        })
      }

      if (prayer === "sunrise" && opts?.includeSunrise){
        const dur = opts?.duration ?? 5;
        console.log({ dur });
        events.push({
          title: "Sunrise",
          start: dateArray(day.sunrise),
          duration: { minutes: dur }
        })
      }
    }
  }

  const { error, value } = createEvents(events);

  if (error){
    console.log(error);
    return;
  }

  return value

}
