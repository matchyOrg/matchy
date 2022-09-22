<p align="center">
<img width="512" src="./frontend/src/assets/matchyLogoGreen.svg" alt="Matchy Logo">
</p>
<p align="center">
<i>Making speed dating paperless! 💌 🏃🏻💨</i>
</p>

For a super short summary - check out this [elevator pitch](https://www.youtube.com/watch?v=n2XdwmY_asM&t=133s).

Also this [simplified mockup](https://www.figma.com/file/ClWUVCuVzjNAG4Gat5TO10/matchy-V2-(Read-Only)?node-id=9%3A1033) gives you a good idea of where we're trying to get (currently not up to date).
<br><br><br><br>


## What is speed dating?

Speed dating doesn't happen online! <br>
It is an organized social event in which participants have one-on-one conversations in person, which are typically limited to less than ten minutes, for the purpose of meeting people they would like to date or befriend.

Here's how it works: When you arrive at the event, a host will sign you up and you will receive a card with your name on it. <br>
There will be two rows sitting in front of eachother at tables and one these rows will remain seated while the other one rotates about every 3-4 mins. Think of the dates as mini introductions. <br>
You will use your card to mark down if you are interested in the people you meet.

After the event, each of the participants will give their cards to the host to process. The host will then contact each person individually and send them their matches' contact data.

Enough said. See what it's currently like to participate in such an event for yourself in this [short demo](https://www.youtube.com/watch?v=p-3cmlPnx0s&t=9s).
<br><br><br><br>


## How are we improving speed dating?

No more paperwork! With our app: 

- the participants can focus on what matters most: making fun experiences and lasting relationships instead of fiddling around with paper. Also they don't have to wait days until their matches get evaluated by the host anymore.

- the event hosts no longer have to print any cards, use a clock to time the dates or spend countless hours after the events determining the matches and contacting the participants.
  
Evaluating the matches is very time consuming and is the most expensive part of throwing these events.

<details>
  <summary> How expensive? Let's do the math! </summary>

  > Let's assume that we have $n$ participants, split into two groups. For example, 40 participants in total, of which there are 20 in each group.
  > Each participant speed-dates everyone from the other group and fills out their cards as they go along. This gives you $(n)$ 40 cards, each with $(\frac{n}{2})$ 20 reviews.
  >
  > Now, when going through a single card, the host will check if the participant liked the other one. If yes, time to search for their card, and check if they also liked our participant. Then we need somewhere between 0 and $(\frac{n}{2})$ 20 card comparisons to determine the matches for a *single* person. And finally, for each match, all the contact information needs to be manually noted down, and sent to our participant.
  >
  > Repeat this for every single of the $(n)$ 40 participants, and you have at most $(n \cdot \frac{n}{2})$ 800 card comparisons to determine all the matches.
  > 
  > Now assuming that we do this as efficient as possible by iterating through each date that happened at the event once instead of twice from both sides (in the description above we iterated through the people, not the dates) we still have $((\frac{n}{2})^2)$ comparisons - in our example this would mean the host has to do 400 comparisons for just 40 participants which is still very time consuming.
  > 
  > But we also have the option to disable groups altogether which enables all participants to date each other. <br> In this case the number of comparisons would be a lot higher. If iterating by people we would require $(n \cdot (n-1))$ 1560 comparisons and if iterating by dates we would require a grand total of $({\sum}_{i = 0}^{n-1}i = \frac{n(n+1)}{2} - n)$ 740 comparisons.

</details>
<br><br><br>


## Who is this for?

The main goal of this app is to provide existing speed friending or dating organizations with a better alternative to pen and paper after some of them reached out to us - so we already know that there is a demand for it!

Here are some selected non profits in Vienna, that we are aiming to help out:
- https://www.meetup.com/speed-friending-events/ (over 8800 members in Vienna)
- https://esnuniwien.com/events/speedfriending-esn-1
- https://events.htu.at/events/d58a7134-469b-4528-bc4a-dca2e7b1fa74
- https://www.wien.gv.at/video/1482/Speeddating-unter-Pensionisten

But effectively anyone can use it to throw their own event!
<br><br><br><br>


## How can I join you guys and contribute?

Joining the community doesn't require you to commit to anything / contribute anything. <br>
You can just [join our wonderful discord server](https://discord.gg/ahNVefYjUc) and just have a good time, meme around and get to know us. <br>
Most of us are students or working as software engineers and have pretty tight schedules - so we can totally understand if you're unsure whether you really want to put in the time / energy. We want the development process to be fun. We don't have any deadlines. 🍜🐱 <br>
There are so many ways you could contribute! You don't even necessarily have to code to be a software developer. <br>
Also: If you feel like the project is overwhelming / too complex, don't worry! We're here to help you out and introduce you to the technologies we're using.

If you feel ready to contribute:
- Check out the `CONTRIBUTING.md` file. It's an in depth guide to this app.
- Access all relevant documents, resources and references of this project on our public notion page: https://sueszli.notion.site/matchy-457ed5cee087469ab5ff78e67bacf3b6
