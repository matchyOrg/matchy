<p align="center">
  <img width="512" src="./frontend/src/assets/matchyLogoGreen.svg" alt="Matchy Logo">
</p>
<p align="center">
  <i>Making speed dating paperless! 💌 🏃🏻💨</i>
</p>

For a super short summary - check out the [elevator pitch](https://www.youtube.com/watch?v=n2XdwmY_asM&t=133s) from HackZürich2022:

<a href="https://www.youtube.com/watch?v=n2XdwmY_asM&t=133s">
  <p align="center">
    <img width="512" src="./docs/interview_preview.jpeg" alt="bouncing yahya lol">
  </p>
</a>

Also this [UI mockup](/docs/figma%20mockups/V3/matchy%20V3.pdf) could give you a good idea of where we're currently at.

<br>

---

> <i> ⚠ **DEVELOPMENT IS CURRENTLY ON HOLD** ⚠ </i>
>
> Thanks for helping us develop this proof-of-concept!
>
> We threw a couple of events in cooperation with the FsWInf @ TU Wien and after gathering user feedback, we discovered that people really enjoyed using the app and found it to be a valuable tool.
>
> However, despite our efforts, **we were unable to secure financial backing to continue developing the project**.
>
> We explored various funding options, such as reaching out to potential investors, but unfortunately, none of these efforts resulted in the necessary financial support. As a result, we have made the difficult decision to put the project on hold for the time being.
>
> We want to express our gratitude to everyone who contributed to this project and helped us along the way. We are proud of what we were able to accomplish, and we hope that in the future, we will be able to return to this project and continue its development.

---

<br>

## What is speed dating?

Speed dating doesn't happen online! <br>
It is an organized social event in which participants have one-on-one conversations in person, which are typically limited to less than ten minutes, for the purpose of meeting people they would like to date or befriend.

Here's how it works: When you arrive at the event, a host will sign you up and you will receive a card with your name on it. <br>
There will be two rows sitting in front of eachother at tables and one these rows will remain seated while the other one rotates about every 3-4 mins. Think of the dates as mini introductions. <br>
You will use your card to mark down if you are interested in the people you meet.

After the event, each of the participants will give their cards to the host to process. The host will then contact each person individually and send them their matches' contact data.

Enough said. See what it's like to participate in such an event for yourself in this [short demo](https://www.youtube.com/watch?v=p-3cmlPnx0s&t=9s).

<br>

## How are we improving speed dating?

No more paperwork! With our app:

- the participants can focus on what matters most: making fun experiences and lasting relationships instead of fiddling around with paper. Also they don't have to wait days until their matches get evaluated by the host anymore.

- the event hosts no longer have to print any cards, use a clock to time the dates or spend countless hours after the events determining the matches and contacting the participants.

Evaluating the matches is very time consuming and is the most expensive part of throwing these events.

<details>
  <summary> <i> How expensive? Let's do the math! </i> </summary>

> Let's assume that we have $n$ participants, split into two groups. For example, 40 participants in total, of which there are 20 in each group.
> Each participant speed-dates everyone from the other group and fills out their cards as they go along. This gives you $(n)$ 40 cards, each with $(\frac{n}{2})$ 20 reviews.
>
> Now, when going through a single card, the host will check if the participant liked the other one. If yes, time to search for their card, and check if they also liked our participant. Then we need somewhere between 0 and $(\frac{n}{2})$ 20 card comparisons to determine the matches for a _single_ person. And finally, for each match, all the contact information needs to be manually noted down, and sent to our participant.
>
> Repeat this for every single of the $(n)$ 40 participants, and you have at most $(n \cdot \frac{n}{2})$ 800 card comparisons to determine all the matches.
>
> Now assuming that we do this as efficient as possible by iterating through each date that happened at the event once instead of twice from both sides (in the description above we iterated through the people, not the dates) we still have $((\frac{n}{2})^2)$ comparisons - in our example this would mean the host has to do 400 comparisons for just 40 participants which is still very time consuming.
>
> But we also have the option to disable groups altogether which enables all participants to date each other. <br> In this case the number of comparisons would be a lot higher. If iterating by people we would require $(n \cdot (n-1))$ 1560 comparisons and if iterating by dates we would require a grand total of $({\sum}_{i = 0}^{n-1}i = \frac{n(n+1)}{2} - n)$ 740 comparisons.

</details>
