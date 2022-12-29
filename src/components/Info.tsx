import React from "react";
import { VStack, Heading, Text, OrderedList, ListItem, UnorderedList, Link, useColorModeValue } from "@chakra-ui/react";

const Info : React.FC = () => {

  const linkColor = useColorModeValue("accent1.500", "accent2.500");
  return (
    <VStack px={{ base: "5", md: "40" }} py="5" align="flex-start" spacing={4} >
      <Heading id="what" variant="gradient" fontWeight="bold" size="2xl" >What is this?</Heading>
      <Text fontSize="lg">
        This website generates calendar events for prayer times that you can upload to any calendar app you choose to use. 
        It does this by generating a <kbd>.ics</kbd> file that is accepted for upload by all the major calendar applications. Currently, you can only generate events for a specified number of months at a time, however, I will eventually make this more customizable.
      </Text>

      <Heading id="how" variant="gradient" fontWeight="bold" size="2xl" >How does it work?</Heading>
      <Text fontSize="lg">
        Go to <kbd>/generate</kbd> and you will be asked a series of questions as to how you want to generate your prayer time events. Prayer time data is pulled based on your city and country from the Al-Adhan API. You can specify many options such as the month to start generating from, number of months to generate for, madhab, authority for calculation (ISNA, Muslim World League, Umm Al-Qura University, Makkah, etc.) and more. A <kbd>.ics</kbd> file is generated with your events.
      </Text>

      <Heading id="why" variant="gradient" fontWeight="bold" size="2xl">Why did I make this?</Heading>
      <Text fontSize="lg" >
        As many, I typically use my calendar application to plan out my days. Previously, I was neglecting my 
        fardh salah which is obviously very bad. Although I knew that I had to pray, I was struggling with reminding
        myself at the prescribed times. There are very good prayer apps already made for the very purpose I am describing, however,  
        I found that I would not go into the app to see the prayer time and thus be back to where I started. You may be wondering, what about the notifications? As most my age, I get hundreds if not thousands of notifications every day
        and the prayer app notifications would simply be drowned out and neglected. 
      </Text>
      <Text fontSize="lg">
        From this, I realized that one app I 
        am constantly checking is my calendar app. I would plan out things I have to do for the day and put my calendar 
        widget somewhere easily visible so that I wouldn't miss important meetings or appointments. Therefore, I thought
        having time blocked out to pray would be great. The problem was the prayer times change every day. so, I'd need 
        a way to get the correct prayer times for each of the prayers. It would be way too tedious to do this manually.
      </Text>

      <Heading id="how-ics" variant="gradient" fontWeight="bold" size="2xl">How do I use <kbd>.ics</kbd> files?</Heading>
      <Text fontSize="lg">
        <kbd>.ics</kbd> files are the standard file for calendar event uploads. The most popular calendar applications such as Apple Calendar's, Google Calendar's and Outlook all 
        accept <kbd>.ics</kbd> uploads. I will outline how to use the generated <kbd>.ics</kbd> files in each of these popular applications. If you use a different application, it 
        should be a simple Google search to find out how to use the <kbd>.ics</kbd> file.
      </Text>
      <Heading id="apple-cal" variant="gradient" fontWeight="bold" size="xl" >Apple Calendar</Heading>
      <Heading size="lg" fontWeight="bold" variant="gradient">On a Mac</Heading>
      <OrderedList fontSize="lg" pl="10">
        <ListItem>Open the file.</ListItem>
        <ListItem>You will be promped to add the events to a calendar of your choosing in your Apple Calendar.</ListItem>
      </OrderedList>

      <Heading size="lg" fontWeight="bold" variant="gradient">iOS</Heading>
      <OrderedList fontSize="lg" pl="10">
        <ListItem>Send the file via email to an email connected to your iOS Mail application.</ListItem>
        <ListItem>Open the email in your iOS Mail application.</ListItem>
        <ListItem>Tap on the attached <kbd>.ics</kbd> file.</ListItem>
        <ListItem>Click "Add All".</ListItem>
      </OrderedList>

      <Heading id="g-cal" variant="gradient" fontWeight="bold" size="xl" >Google Calendar and Outlook</Heading>
      <Text fontSize="lg" >I have provided links below with tutorials on how to use <kbd>.ics</kbd> files with Google Calendar and Outlook.</Text>
      <UnorderedList fontSize="lg" pl="10">
        <ListItem>
          <Link 
            color={linkColor} 
            href="https://support.google.com/calendar/answer/37118?hl=en&co=GENIE.Platform%3DDesktop" 
            isExternal 
          >Google Calendar</Link>
        </ListItem>
        <ListItem>
          <Link 
            color={linkColor} 
            href="https://support.microsoft.com/en-us/office/import-calendars-into-outlook-8e8364e1-400e-4c0f-a573-fe76b5a2d379"
            isExternal
          >Outlook</Link>
        </ListItem>
      </UnorderedList>
    </VStack>
  )
};

export default Info;