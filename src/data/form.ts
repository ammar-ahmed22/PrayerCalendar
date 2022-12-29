export const authorities = [
  "Shia Ithna-Ansari",
  "University of Islamic Sciences, Karachi",
  "Islamic Society of North America",
  "Muslim World League",
  "Umm Al-Qura University, Makkah",
  "Egyptian General Authority of Survey",
  "Institute of Geophysics, University of Tehran",
  "Gulf Region",
  "Kuwait",
  "Qatar",
  "Majlis Ugama Islam Singapura, Singapore",
  "Union Organization islamic de France",
  "Diyanet İşleri Başkanlığı, Turkey",
  "Spiritual Administration of Muslims of Russia"
];

export const formFieldDescriptions = {
  address: "Your address is used to calculate the prayer times for your locality using latitude and longitude coordinates. Your data is not saved anywhere.",
  yearMonth: "The month to start generating events from. i.e. December 2022: Prayer events will be generated for all of December 2022 + the number of months you decided to generate for.",
  numMonths: "The number of month to generate events for. 1 month will generate only for the selected month, 2 months will generate for the selected month as well as the next month, etc.",
  authority: "The authority to be used to conduct the calculations. Each authority uses slightly different variations for calculations. It is best to use the authority closest to your locality.",
  madhab: "The school of thought you implement for matters of fiqh. This is only pertinent for calculation of Asr time. Note: Shafi, Hanbali and Maliki all use the same method, Hanafi differs with a later asr time.",
  email: "The generated file is sent to your email of choosing to make the event upload easier. Email addresses are never saved anywhere.",
  start: "The date to start generating prayer time events for. Defaults to today's date.",
  end: "The date to generate events up to. Events will be generated from start to this date, including the start and end date.",
  duration: "The amount of time each prayer event should last for in minutes. Defaults to 5 minutes. Must be greater than or equal to 5 and less than or equal to 60",
  offsets: "Offset values for prayer times in minutes. If you would like the event to be started slightly later than the prescribed time, you can input an offset here. The value should be a comma separated list containing 5 values, one for each of the prayers (Fajr,Dhuhr,Asr,Maghrib,Isha). i.e. a value of 5,0,0,0,0 will make the Fajr event start 5 minutes after the calculated time for Fajr. Values must be between 0 and 60."
}